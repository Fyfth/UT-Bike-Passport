import Link from "next/link";
import { PassportCard } from "@/components/passport-card";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { incidents, zoneSummaries } from "@/lib/demo-content";
import { getDashboardData } from "@/lib/passports";

export default async function DashboardPage() {
  const { passports, recoveredBikes, stats } = await getDashboardData();

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface rounded-[34px] p-8 md:p-10">
          <StatusPill label="Product dashboard" tone="accent" />
          <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
            Bike passports, alerts, and recovery leads in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
            This is the in-app view. It is intentionally leaner than the landing page so riders can
            move straight into ownership records and active recovery signals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bikes/new"
              className="rounded-full bg-[var(--accent)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              Create passport
            </Link>
            <Link
              href="/recovery"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
            >
              Open recovery board
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard
            label="Registered passports"
            value={String(stats.passportCount).padStart(2, "0")}
            note="These records now come from the project data store instead of being hard-coded in the page."
          />
          <StatCard
            label="Stolen passports"
            value={String(stats.stolenCount).padStart(2, "0")}
            note="This is where stolen-bike mode starts to matter once reporting is live."
          />
          <StatCard
            label="Possible recovery matches"
            value={String(stats.possibleMatches).padStart(2, "0")}
            note="Keep matching explainable so riders know why a recovered bike was surfaced."
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">
                Your passports
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">
                Ownership records
              </h2>
            </div>
            <Link href="/bikes/new" className="text-sm font-bold text-[var(--accent-strong)]">
              Add another passport
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {passports.map((passport) => (
              <PassportCard key={passport.id} passport={passport} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">
                  Recovery signals
                </p>
                <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">
                  Active leads
                </h2>
              </div>
              <StatusPill label="live demo data" tone="quiet" />
            </div>
            <div className="mt-6 space-y-4">
              {recoveredBikes.map((bike) => (
                <article key={bike.id} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[var(--foreground)]">{bike.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{bike.zone} Â· {bike.foundAt}</p>
                    </div>
                    <StatusPill
                      label={bike.holdStatus}
                      tone={bike.holdStatus.includes("Awaiting") ? "success" : bike.holdStatus.includes("No clean") ? "quiet" : "accent"}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{bike.note}</p>
                  {bike.matchCandidates[0] ? (
                    <p className="mt-4 text-sm font-semibold text-[var(--accent-strong)]">
                      {bike.matchCandidates[0].confidence} confidence: {bike.matchCandidates[0].passportNickname}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </article>

          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">
              Campus snapshot
            </p>
            <div className="mt-5 space-y-4">
              {zoneSummaries.map((zone) => (
                <article key={zone.name} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.68)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-black text-[var(--foreground)]">{zone.name}</h3>
                    <StatusPill
                      label={zone.risk}
                      tone={zone.risk === "High watch" ? "alert" : zone.risk === "Recovery hotspot" ? "success" : "accent"}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{zone.guidance}</p>
                </article>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="card-surface rounded-[32px] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">
              Incident feed
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">
              Signals riders should see quickly
            </h2>
          </div>
          <Link href="/recovery" className="text-sm font-bold text-[var(--accent-strong)]">
            Recovery board
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {incidents.map((incident) => (
            <article key={incident.id} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--muted-strong)]">
                    {incident.zone}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">
                    {incident.bikeType}
                  </h3>
                </div>
                <StatusPill
                  label={incident.status}
                  tone={incident.status === "Open" ? "alert" : incident.status === "Recovered lead" ? "success" : "accent"}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{incident.timestamp}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{incident.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}