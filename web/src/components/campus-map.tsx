"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusPill } from "@/components/status-pill";
import { mapLegend } from "@/lib/demo-content";
import type { MissingBoardReport } from "@/lib/missing-reports";

type CampusMapProps = {
  reports: MissingBoardReport[];
};

function getTone(status: MissingBoardReport["status"]) {
  if (status === "Fresh report") return "alert" as const;
  if (status === "Possible lead") return "success" as const;
  return "accent" as const;
}

export function CampusMap({ reports }: CampusMapProps) {
  const [activeId, setActiveId] = useState(reports[0]?.id ?? "");

  const activeReport = useMemo(
    () => reports.find((report) => report.id === activeId) ?? reports[0],
    [activeId, reports],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="card-surface rounded-[34px] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
              Interactive campus board
            </p>
            <h2 className="mt-3 font-display text-4xl font-black text-[var(--foreground)]">
              Click a hotspot to inspect an active report.
            </h2>
          </div>
          <StatusPill label="interactive" tone="accent" />
        </div>

        <div className="mt-6 overflow-hidden rounded-[32px] border border-[var(--line)] bg-[rgba(255,250,244,0.82)] p-3 md:p-4">
          <div className="relative aspect-[4/3] rounded-[28px] bg-[linear-gradient(180deg,rgba(244,232,215,0.96),rgba(239,226,207,0.96))]">
            <div className="absolute left-[8%] top-[8%] h-[74%] w-[13%] rounded-[26px] bg-[rgba(70,117,93,0.12)]" />
            <div className="absolute left-[30%] top-[16%] h-[56%] w-[18%] rounded-[28px] bg-[rgba(35,22,15,0.06)]" />
            <div className="absolute left-[55%] top-[15%] h-[22%] w-[18%] rounded-[28px] bg-[rgba(70,117,93,0.1)]" />
            <div className="absolute left-[52%] top-[49%] h-[28%] w-[26%] rounded-[32px] bg-[rgba(35,22,15,0.06)]" />
            <div className="absolute left-[74%] top-[26%] h-[44%] w-[11%] rounded-[26px] bg-[rgba(70,117,93,0.12)]" />

            <div className="absolute left-[23%] top-0 h-full w-[4px] -translate-x-1/2 bg-[rgba(35,22,15,0.16)]" />
            <div className="absolute left-[49%] top-0 h-full w-[4px] -translate-x-1/2 bg-[rgba(35,22,15,0.16)]" />
            <div className="absolute left-0 top-[54%] h-[4px] w-full -translate-y-1/2 bg-[rgba(35,22,15,0.16)]" />

            <div className="absolute left-[11%] top-[10%] text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)] md:text-xs">
              West Campus
            </div>
            <div className="absolute left-[35%] top-[58%] text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)] md:text-xs">
              Dobie
            </div>
            <div className="absolute left-[56%] top-[8%] text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)] md:text-xs">
              PCL
            </div>
            <div className="absolute left-[61%] top-[71%] text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-strong)] md:text-xs">
              San Antonio
            </div>
            <div className="absolute left-[25%] top-[3%] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] md:text-xs">
              Speedway
            </div>
            <div className="absolute right-[6%] top-[56%] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] md:text-xs">
              24th Street
            </div>

            {reports.map((report) => {
              const isActive = report.id === activeReport?.id;

              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setActiveId(report.id)}
                  className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition ${
                    isActive
                      ? "border-[var(--accent-strong)] bg-[var(--accent)] text-white shadow-[0_0_0_10px_rgba(191,87,0,0.18)]"
                      : "border-[rgba(35,22,15,0.18)] bg-[rgba(255,255,255,0.92)] text-[var(--foreground)] hover:border-[var(--accent)]"
                  }`}
                  style={{ left: `${report.x}%`, top: `${report.y}%` }}
                  aria-label={`Open report for ${report.title}`}
                >
                  <span className="text-xs font-black uppercase tracking-[0.16em]">
                    {report.zone.split(" ")[0]}
                  </span>
                </button>
              );
            })}

            {activeReport ? (
              <div className="absolute bottom-4 left-4 right-4 rounded-[24px] border border-[var(--line)] bg-[rgba(255,248,239,0.96)] p-4 shadow-[0_12px_40px_rgba(35,22,15,0.1)] md:right-auto md:w-[20rem]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                      Active hotspot
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">
                      {activeReport.title}
                    </h3>
                  </div>
                  <StatusPill label={activeReport.status} tone={getTone(activeReport.status)} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{activeReport.landmark}</p>
                <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{activeReport.reportedAt}</p>
                {activeReport.passportSlug ? (
                  <Link href={`/bikes/${activeReport.passportSlug}`} className="mt-4 inline-block text-sm font-bold text-[var(--accent-strong)]">
                    View linked passport
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {mapLegend.map((item) => (
            <div key={item.label} className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4">
              <p className="text-sm font-bold text-[var(--foreground)]">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </article>

      <aside className="space-y-4">
        {reports.map((report) => {
          const isActive = report.id === activeReport?.id;

          return (
            <article
              key={report.id}
              onClick={() => setActiveId(report.id)}
              className={`card-surface cursor-pointer rounded-[28px] p-5 text-left transition ${
                isActive ? "border-[rgba(191,87,0,0.35)] shadow-[0_18px_60px_rgba(191,87,0,0.14)]" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                    {report.zone}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">
                    {report.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{report.bikeType}</p>
                </div>
                <StatusPill label={report.status} tone={getTone(report.status)} />
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{report.summary}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{report.reportedAt}</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--muted)]">{report.landmark}</span>
                {report.passportSlug ? (
                  <span className="text-sm font-bold text-[var(--accent-strong)]">Passport on file</span>
                ) : null}
              </div>
            </article>
          );
        })}
      </aside>
    </div>
  );
}
