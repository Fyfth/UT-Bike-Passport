import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/status-pill";
import { getFoundLeadById } from "@/lib/found-posts";
import { formatDateTimeLabel } from "@/lib/time";

type FoundLeadDetailPageProps = {
  params: Promise<{
    foundPostId: string;
  }>;
};

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.76)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{value}</p>
    </div>
  );
}

export default async function FoundLeadDetailPage({ params }: FoundLeadDetailPageProps) {
  const { foundPostId } = await params;
  const lead = await getFoundLeadById(foundPostId);

  if (!lead) {
    notFound();
  }

  const title = [lead.make, lead.model, lead.color].filter(Boolean).join(" ") || "Found bike lead";
  const submittedAt = new Date(lead.createdAt);
  const submittedLabel = Number.isNaN(submittedAt.getTime())
    ? lead.createdAt
    : formatDateTimeLabel(submittedAt);

  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <Link href="/found" className="text-sm font-bold text-[var(--accent-strong)]">
          Back to found-bike desk
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StatusPill label="Found-bike lead" tone="success" />
          <StatusPill label={lead.status} tone={lead.status === "Matched lead" ? "success" : "accent"} />
        </div>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
          This report was submitted by <strong>{lead.reporterName}</strong> near {lead.landmark}. Use the details below to verify whether this is your bike and follow up with the person who shared it.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Contact and location</p>
                <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Who listed it as found</h2>
              </div>
              <StatusPill label={`${lead.matchCount} ${lead.matchCount === 1 ? "alert" : "alerts"}`} tone={lead.matchCount ? "success" : "quiet"} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailCard label="Reporter" value={lead.reporterName} />
              <DetailCard label="Contact" value={lead.reporterContact || "No contact info was shared on the form."} />
              <DetailCard label="Zone" value={lead.zone} />
              <DetailCard label="Landmark" value={lead.landmark} />
              <DetailCard label="Submitted" value={submittedLabel} />
              <DetailCard label="Status" value={lead.status} />
            </div>
          </article>

          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Clues from the report</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailCard label="Serial or VIN" value={lead.serialNumber || "Not provided"} />
              <DetailCard label="Color" value={lead.color || "Not provided"} />
              <DetailCard label="Make" value={lead.make || "Not provided"} />
              <DetailCard label="Model" value={lead.model || "Not provided"} />
              <div className="md:col-span-2">
                <DetailCard label="Keywords" value={lead.keywords || "No keywords were added."} />
              </div>
              <div className="md:col-span-2">
                <DetailCard label="Notes" value={lead.notes || "No extra notes were added."} />
              </div>
            </div>
          </article>
        </section>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Next step</p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">Follow up while the lead is fresh.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Compare the clues here against your passport details, then reach out using the contact info above if this looks like your bike.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/sign-in" className="rounded-full bg-[var(--accent)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
                Open your alerts
              </Link>
              <Link href="/found" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-white">
                Back to found desk
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
