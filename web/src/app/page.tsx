import Link from "next/link";
import { getCurrentUser, readBikes, readFoundPosts, readMissingReports } from "@/lib/store";

const routeCards = [
  {
    title: "Create a passport",
    detail: "Capture the serial number, parking spots, lock setup, and proof that make recovery faster.",
    href: "/bikes/new",
    fallbackHref: "/sign-in",
    cta: "Start a passport",
  },
  {
    title: "Watch the missing board",
    detail: "See where theft activity is happening around campus and open linked bike records instantly.",
    href: "/missing",
    cta: "Open board",
  },
  {
    title: "Post a found lead",
    detail: "Route a bike sighting back to the right owner with matching based on serial, make, model, and notes.",
    href: "/found",
    cta: "Open desk",
  },
] as const;

export default async function LandingPage() {
  const [currentUser, bikes, reports, foundPosts] = await Promise.all([
    getCurrentUser(),
    readBikes(),
    readMissingReports(),
    readFoundPosts(),
  ]);

  const stats = [
    { label: "Bike passports on file", value: String(bikes.length).padStart(2, "0") },
    { label: "Active missing reports", value: String(reports.length).padStart(2, "0") },
    { label: "Found-bike leads", value: String(foundPosts.length).padStart(2, "0") },
  ];

  return (
    <div className="space-y-8 pb-10">
      <section className="rounded-[40px] bg-[var(--accent)] p-8 text-white md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgba(255,255,255,0.76)]">
          Hackathon Submission - UT Austin Mobility
        </p>
        <h1 className="mt-5 max-w-5xl font-display text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
          Protect bikes across UT Austin with verified ownership, live theft reporting, and routed recovery leads.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[rgba(255,255,255,0.84)] md:text-lg">
          UT Bike Passport gives Longhorn riders one clear flow: register the bike, post it to a live campus board if it goes missing, and get alerted when someone submits a found-bike lead that looks like a match.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={currentUser ? "/bikes/new" : "/sign-in"}
            className="rounded-full bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-strong)] transition hover:bg-[rgba(255,255,255,0.92)]"
          >
            {currentUser ? "Create another passport" : "Sign in to start"}
          </Link>
          <Link
            href="/missing"
            className="rounded-full border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.12)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[rgba(255,255,255,0.18)]"
          >
            Open missing board
          </Link>
          <Link
            href="/found"
            className="rounded-full border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.12)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[rgba(255,255,255,0.18)]"
          >
            Found-bike desk
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[28px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.1)] p-5">
              <p className="text-4xl font-black tracking-tight md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.78)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {routeCards.map((card) => (
          <article key={card.title} className="card-surface rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">Campus workflow</p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">{card.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{card.detail}</p>
            <Link
              href={card.fallbackHref && !currentUser ? card.fallbackHref : card.href}
              className="mt-6 inline-block text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-strong)]"
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
