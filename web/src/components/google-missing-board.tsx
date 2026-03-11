"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CampusMap } from "@/components/campus-map";
import { StatusPill } from "@/components/status-pill";
import type { MissingBoardReport } from "@/lib/missing-reports";

type LeafletMapInstance = {
  setView: (center: [number, number], zoom: number) => void;
  panTo: (center: [number, number]) => void;
  remove: () => void;
};

type LeafletMarkerInstance = {
  on: (eventName: string, handler: () => void) => void;
  bindPopup: (content: string) => LeafletMarkerInstance;
  openPopup: () => void;
  setStyle: (style: Record<string, unknown>) => void;
};

type LeafletApi = {
  map: (node: HTMLElement, options: Record<string, unknown>) => LeafletMapInstance;
  tileLayer: (url: string, options: Record<string, unknown>) => {
    addTo: (map: LeafletMapInstance) => void;
  };
  circleMarker: (position: [number, number], options: Record<string, unknown>) => LeafletMarkerInstance & {
    addTo: (map: LeafletMapInstance) => LeafletMarkerInstance;
  };
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

type FreeMissingBoardProps = {
  reports: MissingBoardReport[];
};

type MapState = "loading" | "ready" | "fallback";

let leafletScriptPromise: Promise<LeafletApi> | null = null;

function getTone(status: MissingBoardReport["status"]) {
  if (status === "Fresh report") return "alert" as const;
  if (status === "Possible lead") return "success" as const;
  return "accent" as const;
}

function getMarkerColor(status: MissingBoardReport["status"]) {
  if (status === "Fresh report") return "#b24933";
  if (status === "Possible lead") return "#356859";
  return "#bf5700";
}

function loadLeaflet() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet only loads in the browser."));
  }

  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (!document.querySelector('link[data-leaflet="true"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.crossOrigin = "";
    link.setAttribute("data-leaflet", "true");
    document.head.appendChild(link);
  }

  if (!leafletScriptPromise) {
    leafletScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-leaflet="true"]') as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (window.L) {
            resolve(window.L);
          } else {
            reject(new Error("Leaflet loaded without the L namespace."));
          }
        });
        existingScript.addEventListener("error", () => reject(new Error("Failed to load Leaflet.")));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "";
      script.setAttribute("data-leaflet", "true");
      script.onload = () => {
        if (window.L) {
          resolve(window.L);
        } else {
          reject(new Error("Leaflet loaded without the L namespace."));
        }
      };
      script.onerror = () => reject(new Error("Failed to load Leaflet."));
      document.head.appendChild(script);
    });
  }

  return leafletScriptPromise;
}

export function GoogleMissingBoard({ reports }: FreeMissingBoardProps) {
  const [activeId, setActiveId] = useState(reports[0]?.id ?? "");
  const [mapState, setMapState] = useState<MapState>("loading");
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<Map<string, LeafletMarkerInstance>>(new Map());

  const activeReport = useMemo(
    () => reports.find((report) => report.id === activeId) ?? reports[0],
    [activeId, reports],
  );

  useEffect(() => {
    if (!mapNodeRef.current) {
      return;
    }

    let cancelled = false;
    const markerStore = markersRef.current;

    loadLeaflet()
      .then((leaflet) => {
        if (cancelled || !mapNodeRef.current) {
          return;
        }

        const map = leaflet.map(mapNodeRef.current, {
          zoomControl: true,
          attributionControl: true,
        });
        map.setView([30.2845, -97.7394], 16);

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
          })
          .addTo(map);

        markerStore.clear();

        reports.forEach((report) => {
          const marker = leaflet
            .circleMarker([report.lat, report.lng], {
              radius: 10,
              color: "#fff8ef",
              weight: 2,
              fillColor: getMarkerColor(report.status),
              fillOpacity: 1,
            })
            .addTo(map)
            .bindPopup(`
              <div style="max-width:220px;padding:2px 0;font-family:Arial,sans-serif;">
                <strong style="display:block;margin-bottom:6px;">${report.title}</strong>
                <div style="font-size:12px;color:#5d4d42;line-height:1.4;">${report.zone} &middot; ${report.landmark}</div>
                <div style="margin-top:8px;font-size:12px;color:#23160f;">${report.reportedAt}</div>
              </div>
            `);

          marker.on("click", () => setActiveId(report.id));
          markerStore.set(report.id, marker);
        });

        mapRef.current = map;
        setMapState("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setMapState("fallback");
        }
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerStore.clear();
    };
  }, [reports]);

  useEffect(() => {
    if (!activeReport || mapState !== "ready" || !mapRef.current) {
      return;
    }

    markersRef.current.forEach((marker, reportId) => {
      marker.setStyle({
        fillOpacity: reportId === activeReport.id ? 1 : 0.85,
        radius: reportId === activeReport.id ? 12 : 10,
      });
    });

    mapRef.current.panTo([activeReport.lat, activeReport.lng]);
    markersRef.current.get(activeReport.id)?.openPopup();
  }, [activeReport, mapState]);

  if (mapState === "fallback") {
    return (
      <div className="space-y-4">
        <div className="rounded-[24px] border border-[rgba(191,87,0,0.18)] bg-[rgba(191,87,0,0.08)] px-5 py-4 text-sm leading-7 text-[var(--accent-strong)]">
          <p className="font-semibold">The free live map could not load, so the board fell back to the built-in campus map.</p>
          <p className="mt-2">This version uses Leaflet with OpenStreetMap tiles, so there is no Google billing or API key required.</p>
        </div>
        <CampusMap reports={reports} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
      <article className="card-surface rounded-[34px] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Free live map</p>
            <h2 className="mt-3 font-display text-4xl font-black text-[var(--foreground)]">Interactive campus incidents</h2>
          </div>
          <StatusPill label={mapState === "ready" ? "leaflet live" : "loading map"} tone="accent" />
        </div>
        <div ref={mapNodeRef} className="mt-6 h-[28rem] w-full overflow-hidden rounded-[30px] border border-[var(--line)] bg-[rgba(255,248,239,0.7)]" />
        {activeReport ? (
          <div className="mt-5 rounded-[26px] border border-[var(--line)] bg-[rgba(255,255,255,0.78)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Selected hotspot</p>
                <h3 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">{activeReport.title}</h3>
              </div>
              <StatusPill label={activeReport.status} tone={getTone(activeReport.status)} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{activeReport.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-strong)]">
              <span>{activeReport.zone}</span>
              <span>{activeReport.landmark}</span>
              <span>{activeReport.reportedAt}</span>
            </div>
            {activeReport.passportSlug ? (
              <Link href={`/bikes/${activeReport.passportSlug}`} className="mt-4 inline-block text-sm font-bold text-[var(--accent-strong)]">
                View linked passport
              </Link>
            ) : null}
          </div>
        ) : null}
      </article>

      <aside className="space-y-4">
        {reports.map((report) => {
          const isActive = report.id === activeReport?.id;

          return (
            <button
              key={report.id}
              type="button"
              onClick={() => setActiveId(report.id)}
              className={`card-surface w-full rounded-[28px] p-5 text-left transition ${
                isActive ? "border-[rgba(191,87,0,0.35)] shadow-[0_18px_60px_rgba(191,87,0,0.14)]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{report.zone}</p>
                  <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">{report.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{report.bikeType}</p>
                </div>
                <StatusPill label={report.status} tone={getTone(report.status)} />
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{report.summary}</p>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">{report.reportedAt}</span>
                {report.passportSlug ? <span className="font-bold text-[var(--accent-strong)]">Passport on file</span> : null}
              </div>
            </button>
          );
        })}
      </aside>
    </div>
  );
}