import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { getRecoveryBoardData } from "@/lib/passports";

export default async function RecoveryPage() {
  const recoveredBikes = await getRecoveryBoardData();

  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <StatusPill label="Recovery workflow" tone="success" />
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
              Recovered-bike intake should create immediate owner leads.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
              This board is still seeded demo data, but it now comes from the same saved store as
              the bike passports. That keeps the recovery story tied to real records.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          {recoveredBikes.map((bike) => (
            <article key={bike.id} className="card-surface rounded-[30px] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                    Recovered listing
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">
                    {bike.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{bike.zone} Â· {bike.foundAt}</p>
                </div>
                <StatusPill
                  label={bike.holdStatus}
                  tone={bike.holdStatus.includes("Awaiting") ? "success" : bike.holdStatus.includes("No clean") ? "quiet" : "accent"}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{bike.note}</p>
              <div className="mt-5 space-y-3">
                {bike.matchCandidates.map((candidate) => (
                  <div key={`${bike.id}-${candidate.passportSlug}`} className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <Link href={`/bikes/${candidate.passportSlug}`} className="text-sm font-bold text-[var(--foreground)]">
                        Candidate passport: {candidate.passportNickname}
                      </Link>
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
              Intake quality
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-6 text-[var(--muted)]">
                Capture clear photos, a found location, and any visible serial or accessory clues.
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-6 text-[var(--muted)]">
                Good intake quality should raise match confidence and make alerts more trustworthy.
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 text-sm leading-6 text-[var(--muted)]">
                The next backend step is a form that lets trusted users add recovered bikes from this screen.
              </div>
            </div>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
              Current scope
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Registration is now real. Recovery intake and stolen-bike reporting are the next major
              write flows to add.
            </p>
          </article>
        </aside>
      </div>
    </div>
  );
}