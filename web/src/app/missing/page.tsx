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
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card-surface rounded-[36px] p-8 md:p-10">
          <StatusPill label="Map-first missing board" tone="alert" />
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
            The missing board is now centered on a free interactive map.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
            Riders can click markers, inspect incident cards, and jump into linked passports when a
            report is tied to a known bike record. Found-bike leads can push these cards into a possible-lead state.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">What this page does</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              It shifts the product from a personal record system into a campus visibility tool. This is
              where people see patterns, not just their own bike.
            </p>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Report or recover</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/sign-in" className="rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
                Sign in
              </Link>
              <Link href="/found" className="rounded-full border border-[rgba(53,104,89,0.18)] bg-[rgba(53,104,89,0.08)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--success-strong)] transition hover:bg-[rgba(53,104,89,0.12)]">
                Create found post
              </Link>
            </div>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Free map stack</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              The live map now uses Leaflet with OpenStreetMap tiles, so there is no Google billing and no API key needed.
            </p>
          </article>
        </div>
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