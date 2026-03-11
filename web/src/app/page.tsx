import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { problemSignals, registrationSignals } from "@/lib/demo-content";
import { getCurrentUser } from "@/lib/store";

export default async function LandingPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-surface texture-grid rounded-[36px] p-8 md:p-10">
          <StatusPill label="Current MVP path" tone="accent" />
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.92] tracking-tight text-[var(--foreground)] md:text-7xl">
            Sign in, create your bike passport, mark it missing if needed, then recover it through campus leads.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-strong)] md:text-lg">
            UT Bike Passport now has the full loop: rider identity, ownership proof, a map-first missing board, and a found-bike desk that can route likely matches back to the owner.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={currentUser ? "/bikes/new" : "/sign-in"}
              className="rounded-full bg-[var(--accent)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              {currentUser ? "Create another passport" : "Sign in to start"}
            </Link>
            <Link
              href="/missing"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
            >
              Open missing board
            </Link>
            <Link
              href="/found"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
            >
              Found-bike desk
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">What changed</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              The app now supports the actual recovery workflow, not just the passport. Riders can report a bike missing, and campus helpers can create found posts that trigger notifications.
            </p>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Storage model</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Users, bike passports, missing-board reports, found posts, and notifications now live in readable CSV files.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {registrationSignals.map((signal, index) => (
          <article key={signal.title} className="card-surface rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Step 0{index + 1}</p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">{signal.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{signal.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {problemSignals.map((signal) => (
          <article key={signal.title} className="card-surface rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Design focus</p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">{signal.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{signal.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}