import Link from "next/link";
import type { DashboardPassport } from "@/lib/passports";
import { StatusPill } from "@/components/status-pill";

type PassportCardProps = {
  passport: DashboardPassport;
};

export function PassportCard({ passport }: PassportCardProps) {
  const tone =
    passport.status === "Stolen"
      ? "alert"
      : passport.status === "Recovered"
        ? "success"
        : "accent";

  return (
    <Link
      href={`/bikes/${passport.id}`}
      className="group card-surface block rounded-[28px] p-5 transition duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-strong)]">
            Bike passport
          </p>
          <h3 className="mt-3 font-display text-2xl font-black text-[var(--foreground)]">
            {passport.nickname}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">Owner: {passport.ownerName}</p>
        </div>
        <StatusPill label={passport.status} tone={tone} />
      </div>
      <p className="mt-4 text-sm text-[var(--muted-strong)]">
        {passport.make} {passport.model}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {passport.commonParking.slice(0, 2).map((spot) => (
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