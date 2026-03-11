import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/status-pill";
import { getNotificationsForUser } from "@/lib/notifications";
import { getBikePassportBySlug } from "@/lib/passports";
import { getCurrentUser } from "@/lib/store";

type BikeDetailPageProps = {
  params: Promise<{
    bikeId: string;
  }>;
  searchParams?: Promise<{
    updated?: string;
  }>;
};

const heroClasses = {
  burnt: "from-[rgba(191,87,0,0.22)] via-[rgba(255,248,239,0.82)] to-[rgba(255,255,255,0.6)]",
  sage: "from-[rgba(91,132,109,0.22)] via-[rgba(255,248,239,0.82)] to-[rgba(255,255,255,0.6)]",
  steel: "from-[rgba(104,126,136,0.22)] via-[rgba(255,248,239,0.82)] to-[rgba(255,255,255,0.6)]",
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(35,22,15,0.08)] py-3 last:border-b-0">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{label}</span>
      <span className="max-w-[60%] text-right text-sm leading-6 text-[var(--foreground)]">{value}</span>
    </div>
  );
}

export default async function BikeDetailPage({ params, searchParams }: BikeDetailPageProps) {
  const { bikeId } = await params;
  const query = (await searchParams) ?? {};
  const [passport, currentUser] = await Promise.all([getBikePassportBySlug(bikeId), getCurrentUser()]);

  if (!passport) {
    notFound();
  }

  const isOwner = currentUser?.id === passport.ownerId;
  const notifications = isOwner && currentUser ? await getNotificationsForUser(currentUser.id) : [];
  const bikeNotifications = notifications.filter((notification) => notification.bikeSlug === passport.id);
  const tone = passport.status === "Stolen" ? "alert" : passport.status === "Recovered" ? "success" : "accent";

  return (
    <div className="space-y-8 pb-10">
      {query.updated === "missing" ? (
        <div className="rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          Missing report sent. Your bike is now on the missing board and eligible for found-bike matching.
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className={`card-surface rounded-[36px] bg-gradient-to-br ${heroClasses[passport.heroTone]} p-8 md:p-10`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                {isOwner ? "Your passport" : "Passport on file"}
              </p>
              <h1 className="mt-3 font-display text-5xl font-black text-[var(--foreground)] md:text-6xl">
                {passport.nickname}
              </h1>
            </div>
            <StatusPill label={passport.status} tone={tone} />
          </div>

          <div className="mt-8 rounded-[30px] border border-[var(--line)] bg-[rgba(255,248,239,0.88)] p-6 shadow-[0_20px_60px_rgba(53,38,22,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Owner</p>
                <p className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">{passport.ownerName}</p>
              </div>
              <StatusPill label={passport.receiptStatus === "Uploaded" ? "proof saved" : "proof pending"} tone={passport.receiptStatus === "Uploaded" ? "success" : "quiet"} />
            </div>
            <div className="mt-6">
              <DetailRow label="Bike" value={`${passport.make} ${passport.model}`} />
              <DetailRow label="Color" value={passport.color} />
              <DetailRow label="Frame" value={passport.frameSize} />
              <DetailRow label="Serial" value={passport.serialNumber} />
              <DetailRow label="Lock" value={passport.lockType} />
              <DetailRow label="Parking" value={passport.commonParking.join(", ")} />
              <DetailRow label="Last seen" value={passport.lastSeen || "No missing report on file"} />
            </div>
            <div className="mt-5 rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-7 text-[var(--muted)]">
              {passport.note}
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Action center</p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">
              This passport now supports both missing reports and found-bike recovery alerts.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Start from your passport, put the bike on the missing board when needed, and come back here when the app finds a likely lead.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/missing" className="rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
                Open missing-board map
              </Link>
              {isOwner ? (
                <Link href={`/bikes/${passport.id}/report-missing`} className="rounded-full border border-[rgba(178,73,51,0.2)] bg-[rgba(178,73,51,0.08)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--alert-strong)] transition hover:bg-[rgba(178,73,51,0.12)]">
                  {passport.status === "Stolen" ? "Update missing report" : "Mark as missing"}
                </Link>
              ) : null}
              <Link href="/found" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-white">
                Open found-bike desk
              </Link>
            </div>
          </article>

          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Stored proof</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-bold text-[var(--foreground)]">Receipt</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{passport.receiptReference || "No receipt note saved yet."}</p>
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-bold text-[var(--foreground)]">Photo summary</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{passport.photoSummary || "No photo summary saved yet."}</p>
              </div>
            </div>
          </article>

          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Found-bike alerts</p>
            {bikeNotifications.length ? (
              <div className="mt-4 space-y-3">
                {bikeNotifications.map((notification) => (
                  <div key={notification.id} className="rounded-[22px] border border-[rgba(53,104,89,0.16)] bg-[rgba(53,104,89,0.08)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-[var(--foreground)]">{notification.title}</p>
                      <StatusPill label={notification.status} tone={notification.status === "Unread" ? "success" : "quiet"} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{notification.message}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{notification.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                No found-bike alerts for this passport yet.
              </p>
            )}
          </article>
        </aside>
      </section>
    </div>
  );
}