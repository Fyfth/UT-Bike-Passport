import Link from "next/link";
import { MissingBoardShell } from "@/components/missing-board-shell";
import { PassportCard } from "@/components/passport-card";
import { StatusPill } from "@/components/status-pill";
import { getMissingBoardReports } from "@/lib/missing-reports";
import { getBikePassportBySlug } from "@/lib/passports";

export default async function MissingBoardPage() {
  const reports = await getMissingBoardReports();
  const linkedPassports = (
    await Promise.all(
      reports
        .filter((report) => report.passportSlug)
        .map((report) => getBikePassportBySlug(report.passportSlug!)),
    )
  ).filter(Boolean);

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface rounded-[36px] border-t-4 border-[var(--accent)] p-8 md:p-10">
          <StatusPill label="UT Austin missing board" tone="alert" />
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
            Track live missing-bike activity across campus.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
            Open the map, inspect each hotspot, and jump into linked passports when a report belongs to a rider already in the system.
          </p>
        </div>
        <aside className="card-surface rounded-[36px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">Campus snapshot</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--card-strong)] p-4">
              <p className="text-4xl font-black text-[var(--foreground)]">{String(reports.length).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-strong)]">Active reports</p>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--card-strong)] p-4">
              <p className="text-4xl font-black text-[var(--foreground)]">{String(linkedPassports.length).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-strong)]">Passport-linked cases</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/sign-in" className="rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
              Sign in
            </Link>
            <Link href="/found" className="rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:border-[rgba(191,87,0,0.18)]">
              Create found post
            </Link>
          </div>
        </aside>
      </section>

      {linkedPassports.length ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Linked passports</p>
            <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Missing bikes with passport records</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {linkedPassports.map((passport) => (
              <PassportCard key={passport.id} passport={passport} />
            ))}
          </div>
        </section>
      ) : null}

      <MissingBoardShell reports={reports} />
    </div>
  );
}
