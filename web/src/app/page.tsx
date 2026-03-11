import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { problemSignals, registrationSignals } from "@/lib/demo-content";

export default function LandingPage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface texture-grid rounded-[36px] p-8 md:p-10">
          <StatusPill label="Problem-first landing page" tone="accent" />
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-black leading-[0.92] tracking-tight text-[var(--foreground)] md:text-7xl">
            Bike theft should not be the reason UT students stop riding.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-strong)] md:text-lg">
            UT Bike Passport is a website-first product that helps riders prove ownership before a
            theft, report fast when something goes wrong, and reconnect recovered bikes with the
            right owner before those leads disappear.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bikes/new"
              className="rounded-full bg-[var(--accent)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              Start a bike passport
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
            >
              View product dashboard
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
              The gap we are fixing
            </p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">
              The first hour after a theft is usually too scattered.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Students should not have to rebuild proof of ownership, search old photos, and guess
              where recovery information lives while they are already stressed.
            </p>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
              Why registration matters
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Registration is not just a form. It is the record that powers better theft reports,
              faster recovery checks, and stronger proof when a found bike looks like yours.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {problemSignals.map((signal) => (
          <article key={signal.title} className="card-surface rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
              Problem
            </p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">
              {signal.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{signal.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card-surface rounded-[34px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
            Registration breakdown
          </p>
          <h2 className="mt-3 font-display text-4xl font-black text-[var(--foreground)]">
            What the passport captures and why it helps.
          </h2>
          <div className="mt-6 space-y-4">
            {registrationSignals.map((signal, index) => (
              <div key={signal.title} className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
                  Step 0{index + 1}
                </p>
                <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">
                  {signal.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{signal.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card-surface rounded-[34px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
            Product flow
          </p>
          <div className="mt-6 space-y-5">
            <div className="rounded-[24px] bg-[rgba(191,87,0,0.08)] p-5">
              <p className="text-sm font-bold text-[var(--foreground)]">1. Create a passport</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Save the bike details once so the rider does not rebuild them under pressure later.
              </p>
            </div>
            <div className="rounded-[24px] bg-[rgba(70,117,93,0.08)] p-5">
              <p className="text-sm font-bold text-[var(--foreground)]">2. Trigger stolen-bike mode</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Turn the saved passport into a clean report packet and a shareable alert.
              </p>
            </div>
            <div className="rounded-[24px] bg-[rgba(35,22,15,0.06)] p-5">
              <p className="text-sm font-bold text-[var(--foreground)]">3. Match recovered listings</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Surface likely owner matches before recovered inventory goes cold.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-[26px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
              Stage 1 scope
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Start on the web, prove the workflow, and then extend to a dedicated mobile app with
              push notifications and camera-first capture.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}