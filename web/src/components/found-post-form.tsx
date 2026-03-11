"use client";

import { useState } from "react";
import type { CampusLocation } from "@/lib/campus-locations";

type FoundPostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  locations: CampusLocation[];
};

export function FoundPostForm({ action, locations }: FoundPostFormProps) {
  const [error, setError] = useState("");

  return (
    <form
      action={action}
      className="card-surface rounded-[32px] p-6 md:p-8"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const formData = new FormData(form);
        const hasClue = ["serialNumber", "make", "model", "color", "keywords"].some((key) => {
          const value = String(formData.get(key) ?? "").trim();
          return value.length > 0;
        });

        if (!String(formData.get("locationId") ?? "").trim() || !hasClue) {
          event.preventDefault();
          setError("Add a location and at least one clue like serial number, make, model, color, or keywords.");
          return;
        }

        setError("");
      }}
    >
      {error ? (
        <div className="mb-6 rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          {error}
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Your name</label>
          <input name="reporterName" placeholder="Campus helper" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Contact</label>
          <input name="reporterContact" placeholder="Email or phone" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Found location</label>
          <select
            name="locationId"
            required
            defaultValue={locations[0]?.id}
            className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.zone} - {location.landmark}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Serial or VIN</label>
          <input name="serialNumber" placeholder="WTU2485MUT26" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Color</label>
          <input name="color" placeholder="Burnt orange" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Make</label>
          <input name="make" placeholder="Trek" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Model</label>
          <input name="model" placeholder="FX 2 Disc" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Keywords</label>
          <input name="keywords" placeholder="longhorn sticker, milk crate, basket, scratch" className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Notes</label>
          <textarea name="notes" rows={4} placeholder="Anything else that could help the rider verify this bike." className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white" />
        </div>
      </div>
      <button type="submit" className="mt-6 w-full rounded-full border border-[rgba(53,104,89,0.26)] bg-[var(--success)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_50px_rgba(53,104,89,0.22)] transition hover:bg-[var(--success-strong)] hover:shadow-[0_22px_60px_rgba(53,104,89,0.28)]">
        Create found post
      </button>
    </form>
  );
}
