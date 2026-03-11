import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { recoveredBikes } from "@/lib/mock-data";

export default function RecoveryPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill label="Recovery workflow" tone="success" />
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
              The recovered-bike board should save bikes from going cold.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
              This screen is where a trusted partner, admin, or future campus collaborator can log
              found bikes and immediately see which passports deserve a fast owner alert.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.74)] p-5 md:max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Intake checklist</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Capture clear photos, log found location, describe accessories, and confirm serials when
              possible. The product should reward better intake quality with better match confidence.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          {recoveredBikes.map((bike) => (
            <article key={bike.id} className="card-surface rounded-[30px] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Recovered listing</p>
                  <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">{bike.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{bike.zone} · {bike.foundAt}</p>
                </div>
                <StatusPill
                  label={bike.holdStatus}
                  tone={bike.holdStatus.includes("Awaiting") ? "success" : bike.holdStatus.includes("No clean") ? "quiet" : "accent"}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{bike.note}</p>
              <div className="mt-5 space-y-3">
                {bike.matchCandidates.map((candidate) => (
                  <div key={`${bike.id}-${candidate.passportId}`} className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-[var(--foreground)]">Candidate passport: {candidate.passportId}</p>
                      <StatusPill
                        label={candidate.confidence}
                        tone={candidate.confidence === "High" ? "success" : candidate.confidence === "Medium" ? "accent" : "quiet"}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{candidate.reason}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-6">
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Admin intake preview</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-6 text-[var(--muted)]">
                Fields: found location, date, bike type, color, photos, distinctive notes, serial number if visible.
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-6 text-[var(--muted)]">
                Matching should stay explainable. We should always show owners why a bike was surfaced.
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-6 text-[var(--muted)]">
                Good recovered-bike intake is what turns this from a nice profile app into a true recovery tool.
              </div>
            </div>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Build next</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/bikes/new" className="rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
                Add passport flow
              </Link>
              <Link href="/" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-white">
                Return to dashboard
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}

