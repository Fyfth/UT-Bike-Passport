import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { incidents, passports, recoveredBikes, zoneSummaries } from "@/lib/mock-data";

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="card-surface rounded-[28px] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">{label}</p>
      <p className="mt-4 font-display text-4xl font-black text-[var(--foreground)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{note}</p>
    </article>
  );
}

function PassportCard({
  id,
  nickname,
  make,
  model,
  status,
  commonParking,
}: {
  id: string;
  nickname: string;
  make: string;
  model: string;
  status: string;
  commonParking: string[];
}) {
  const tone = status === "Stolen" ? "alert" : status === "Recovered" ? "success" : "accent";

  return (
    <Link
      href={`/bikes/${id}`}
      className="group card-surface block rounded-[28px] p-5 transition duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Bike passport</p>
          <h3 className="mt-3 font-display text-2xl font-black text-[var(--foreground)]">{nickname}</h3>
        </div>
        <StatusPill label={status} tone={tone} />
      </div>
      <p className="mt-4 text-sm text-[var(--muted-strong)]">{make} {model}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {commonParking.slice(0, 2).map((spot) => (
          <span
            key={spot}
            className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--muted-strong)]"
          >
            {spot}
          </span>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold text-[var(--accent-strong)] transition group-hover:translate-x-1">
        Open passport details
      </p>
    </Link>
  );
}

export default function Home() {
  const possibleMatches = recoveredBikes.flatMap((bike) => bike.matchCandidates).length;

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="card-surface texture-grid rounded-[34px] p-8 md:p-10">
          <StatusPill label="Stage 1 web MVP" tone="accent" />
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-black leading-[0.92] tracking-tight text-[var(--foreground)] md:text-7xl">
            Give every UT bike a passport before it becomes a police report.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-strong)] md:text-lg">
            UT Bike Passport is a website-first safety layer for registration-ready bike records,
            rapid stolen-bike reporting, and recovered-bike matching before bikes disappear into a
            dead-end workflow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bikes/new"
              className="rounded-full bg-[var(--accent)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              Create bike passport
            </Link>
            <Link
              href="/recovery"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.7)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-[rgba(255,255,255,0.92)]"
            >
              Open recovery board
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Pilot focus</p>
            <div className="mt-5 space-y-5">
              <div className="rounded-[22px] bg-[rgba(191,87,0,0.08)] p-4">
                <p className="text-sm font-bold text-[var(--foreground)]">1. Build the passport</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Photos, receipts, serials, and parking habits live in one clean record.
                </p>
              </div>
              <div className="rounded-[22px] bg-[rgba(70,117,93,0.08)] p-4">
                <p className="text-sm font-bold text-[var(--foreground)]">2. Trigger stolen-bike mode</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Turn the passport into a sharp report packet instead of a frantic scramble.
                </p>
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.06)] p-4">
                <p className="text-sm font-bold text-[var(--foreground)]">3. Match recovered bikes</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Create recovery leads before recovered inventory gets lost in the surplus pipeline.
                </p>
              </div>
            </div>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Why this matters</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              The product is most useful when it feels like a calm, daily ownership tool rather than
              a panic-only theft app. That is why the passport comes first.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Registered passports"
          value={String(passports.length).padStart(2, "0")}
          note="Seeded pilot records covering protected, stolen, and recovered states."
        />
        <StatCard
          label="Open incident signals"
          value={String(incidents.length).padStart(2, "0")}
          note="Demo incident feed to prove how the web dashboard will feel when reports arrive."
        />
        <StatCard
          label="Possible recovery matches"
          value={String(possibleMatches).padStart(2, "0")}
          note="Matches should stay human-readable, explainable, and easy to confirm."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Passport board</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">
                Bike identity before the crisis
              </h2>
            </div>
            <Link href="/bikes/new" className="text-sm font-bold text-[var(--accent-strong)]">
              Create passport
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {passports.map((passport) => (
              <PassportCard key={passport.id} {...passport} />
            ))}
          </div>
        </div>
        <aside className="card-surface rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Campus pulse</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Where the system helps first</h2>
            </div>
            <StatusPill label="map later" tone="quiet" />
          </div>
          <div className="mt-6 space-y-4">
            {zoneSummaries.map((zone) => (
              <article key={zone.name} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.68)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-black text-[var(--foreground)]">{zone.name}</h3>
                  <StatusPill label={zone.risk} tone={zone.risk === "High watch" ? "alert" : zone.risk === "Recovery hotspot" ? "success" : "accent"} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{zone.guidance}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card-surface rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Recovery board</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Recovered-bike intake</h2>
            </div>
            <Link href="/recovery" className="text-sm font-bold text-[var(--accent-strong)]">
              View all recovered bikes
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recoveredBikes.map((bike) => (
              <article key={bike.id} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)]">{bike.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{bike.zone} · {bike.foundAt}</p>
                  </div>
                  <StatusPill label={bike.holdStatus} tone={bike.holdStatus.includes("Awaiting") ? "success" : bike.holdStatus.includes("No clean") ? "quiet" : "accent"} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{bike.note}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--accent-strong)]">
                  {bike.matchCandidates[0]?.confidence ?? "Pending"} confidence match: {bike.matchCandidates[0]?.reason}
                </p>
              </article>
            ))}
          </div>
        </article>

        <article className="card-surface rounded-[32px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">Incident feed</p>
          <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">What the reporting layer should surface</h2>
          <div className="mt-6 space-y-4">
            {incidents.map((incident) => (
              <article key={incident.id} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--muted-strong)]">{incident.zone}</p>
                    <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">{incident.bikeType}</h3>
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
        </article>
      </section>
    </div>
  );
}

