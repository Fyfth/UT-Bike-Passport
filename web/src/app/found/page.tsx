import Link from "next/link";
import { createFoundPost } from "@/app/actions/incidents";
import { FoundPostForm } from "@/components/found-post-form";
import { StatusPill } from "@/components/status-pill";
import { campusLocations } from "@/lib/campus-locations";
import { getFoundLeads } from "@/lib/found-posts";

type FoundPageProps = {
  searchParams?: Promise<{
    error?: string;
    submitted?: string;
    matches?: string;
  }>;
};

export default async function FoundPage({ searchParams }: FoundPageProps) {
  const query = (await searchParams) ?? {};
  const leads = await getFoundLeads();

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card-surface rounded-[36px] p-8 md:p-10">
          <StatusPill label="Found-bike desk" tone="success" />
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
            Create a found post so the right rider gets notified.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
            Enter whatever you know: serial number, color, make, model, or standout keywords. The app compares the post against missing passports and sends alerts when it finds a likely match.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Matching logic</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Exact serial number is strongest. Make, model, color, and keyword overlap can still produce a possible lead when the serial is missing.
            </p>
          </article>
          <article className="card-surface rounded-[30px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Before you submit</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Pick a campus location and fill at least one clue field. The form now blocks empty submissions before it sends the request.
            </p>
          </article>
        </div>
      </section>

      {query.error === "missing-fields" ? (
        <div className="rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          Add a campus location and at least one clue like serial number, make, model, color, or keywords.
        </div>
      ) : null}

      {query.submitted === "1" ? (
        <div className="rounded-[24px] border border-[rgba(53,104,89,0.22)] bg-[rgba(53,104,89,0.08)] px-5 py-4 text-sm font-semibold text-[var(--success-strong)]">
          Found post saved. Matches generated: {query.matches ?? "0"}.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <FoundPostForm action={createFoundPost} locations={campusLocations} />

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Recent found posts</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Open leads and matched leads</h2>
            </div>
            <Link href="/missing" className="text-sm font-bold text-[var(--accent-strong)]">
              Back to map
            </Link>
          </div>
          {leads.length ? (
            leads.map((lead) => (
              <article key={lead.id} className="card-surface rounded-[28px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{lead.zone}</p>
                    <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">{lead.make || lead.model || lead.color || "Found bike lead"}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{lead.landmark}</p>
                  </div>
                  <StatusPill label={lead.status} tone={lead.status === "Matched lead" ? "success" : "accent"} />
                </div>
                <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--muted)]">
                  {lead.serialNumber ? <p>Serial: {lead.serialNumber}</p> : null}
                  {lead.color ? <p>Color: {lead.color}</p> : null}
                  {lead.keywords ? <p>Keywords: {lead.keywords}</p> : null}
                  <p>Matches created: {lead.matchCount}</p>
                </div>
                <Link href={`/found/${lead.id}`} className="mt-4 inline-block text-sm font-bold text-[var(--accent-strong)]">
                  View details
                </Link>
              </article>
            ))
          ) : (
            <article className="card-surface rounded-[28px] p-5 text-sm leading-7 text-[var(--muted)]">
              No found posts yet. This page is ready for someone on campus to report a sighting and trigger matching.
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
