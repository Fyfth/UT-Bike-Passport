import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/status-pill";
import { getPassportById, getRecoveredMatchesForPassport } from "@/lib/mock-data";

type BikeDetailPageProps = {
  params: Promise<{
    bikeId: string;
  }>;
};

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{label}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{value}</p>
    </div>
  );
}

const heroClasses = {
  burnt: "from-[rgba(191,87,0,0.22)] via-[rgba(255,248,239,0.82)] to-[rgba(255,255,255,0.6)]",
  sage: "from-[rgba(91,132,109,0.22)] via-[rgba(255,248,239,0.82)] to-[rgba(255,255,255,0.6)]",
  steel: "from-[rgba(104,126,136,0.22)] via-[rgba(255,248,239,0.82)] to-[rgba(255,255,255,0.6)]",
};

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
  const { bikeId } = await params;
  const passport = getPassportById(bikeId);

  if (!passport) {
    notFound();
  }

  const matches = getRecoveredMatchesForPassport(passport.id);
  const tone = passport.status === "Stolen" ? "alert" : passport.status === "Recovered" ? "success" : "accent";

  return (
    <div className="space-y-8 pb-10">
      <section className={`card-surface rounded-[36px] bg-gradient-to-br ${heroClasses[passport.heroTone]} p-8 md:p-10`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-sm font-bold text-[var(--accent-strong)]">
              Back to dashboard
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <StatusPill label={passport.status} tone={tone} />
              <StatusPill label={passport.receiptStatus === "Uploaded" ? "receipt ready" : "receipt pending"} tone={passport.receiptStatus === "Uploaded" ? "success" : "quiet"} />
            </div>
            <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
              {passport.nickname}
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted-strong)]">
              {passport.make} {passport.model} · {passport.color} · {passport.frameSize} frame
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              {passport.note}
            </p>
          </div>
          <div className="rounded-[26px] border border-[var(--line)] bg-[rgba(255,255,255,0.76)] p-5 md:max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Passport actions</p>
            <div className="mt-4 flex flex-col gap-3">
              <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
                Export theft packet
              </button>
              <button className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-white">
                Share ownership card
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Identity snapshot</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailBlock label="Owner" value={passport.ownerName} />
              <DetailBlock label="Serial number" value={passport.serialNumber} />
              <DetailBlock label="Purchase source" value={passport.purchaseSource} />
              <DetailBlock label="Purchase date" value={passport.purchaseDate} />
              <DetailBlock label="Lock setup" value={passport.lockType} />
              <DetailBlock label="Preferred parking" value={passport.commonParking.join(", ")} />
            </div>
          </article>

          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Stolen-bike mode</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailBlock label="Last seen" value={passport.lastSeen ?? "Not reported yet"} />
              <DetailBlock label="Report created" value={passport.reportedAt ?? "No report on file"} />
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              This is where the passport becomes the reporting engine: the app should turn saved
              ownership proof into a clean summary for UTPD or APD, plus a shareable public-facing
              alert card.
            </p>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Recovery signals</p>
            <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Potential matches</h2>
            <div className="mt-5 space-y-4">
              {matches.length ? (
                matches.map((match) => {
                  const candidate = match.matchCandidates.find((entry) => entry.passportId === passport.id);
                  const candidateTone = candidate?.confidence === "High" ? "success" : candidate?.confidence === "Medium" ? "accent" : "quiet";

                  return (
                    <article key={match.id} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-[var(--foreground)]">{match.title}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">{match.zone} · {match.foundAt}</p>
                        </div>
                        <StatusPill label={candidate?.confidence ?? "Pending"} tone={candidateTone} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{candidate?.reason}</p>
                    </article>
                  );
                })
              ) : (
                <p className="rounded-[24px] border border-dashed border-[var(--line)] p-4 text-sm leading-6 text-[var(--muted)]">
                  No recovery leads yet. Once recovered-bike intake starts, this card becomes the bridge between inventory and owner notification.
                </p>
              )}
            </div>
          </article>

          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Next app milestone</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              After the Stage 1 website proves the workflow, the mobile app can focus on push alerts,
              camera-first uploads, and faster field reporting without changing the core data model.
            </p>
            <Link href="/bikes/new" className="mt-5 inline-block text-sm font-bold text-[var(--accent-strong)]">
              Create another passport
            </Link>
          </article>
        </aside>
      </div>
    </div>
  );
}

