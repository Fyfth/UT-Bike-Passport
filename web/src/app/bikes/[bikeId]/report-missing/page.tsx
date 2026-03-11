import Link from "next/link";
import { notFound } from "next/navigation";
import { reportBikeMissing } from "@/app/actions/incidents";
import { StatusPill } from "@/components/status-pill";
import { campusLocations } from "@/lib/campus-locations";
import { getBikePassportBySlug } from "@/lib/passports";
import { getCurrentUser } from "@/lib/store";

type ReportMissingPageProps = {
  params: Promise<{
    bikeId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function ReportMissingPage({ params, searchParams }: ReportMissingPageProps) {
  const { bikeId } = await params;
  const query = (await searchParams) ?? {};
  const [passport, currentUser] = await Promise.all([getBikePassportBySlug(bikeId), getCurrentUser()]);

  if (!passport) {
    notFound();
  }

  if (!currentUser || currentUser.id !== passport.ownerId) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <Link href={`/bikes/${passport.id}`} className="text-sm font-bold text-[var(--accent-strong)]">
          Back to passport
        </Link>
        <div className="mt-5 flex items-center gap-3">
          <StatusPill label="Missing report" tone="alert" />
          <StatusPill label={passport.nickname} tone="accent" />
        </div>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
          Put your bike on the missing board.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
          This updates the bike status, creates or refreshes the missing-board card, and lets future found posts trigger notifications for you.
        </p>
      </section>

      {query.error === "missing-fields" ? (
        <div className="rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          Pick a campus location before sending the missing report.
        </div>
      ) : null}

      <form action={reportBikeMissing} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <input type="hidden" name="bikeSlug" value={passport.id} />
        <section className="card-surface rounded-[32px] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Campus location</label>
              <select
                name="locationId"
                required
                defaultValue={campusLocations[0]?.id}
                className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
              >
                {campusLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.zone} - {location.landmark}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Last seen time</label>
              <input
                name="lastSeenAt"
                type="datetime-local"
                className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Bike snapshot</label>
              <div className="mt-2 rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {passport.color} {passport.make} {passport.model}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">What should other riders know?</label>
              <textarea
                name="summaryNote"
                rows={5}
                placeholder="Tell riders what lock was used, what makes the bike recognizable, or what happened at the rack."
                className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">What happens next</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              <p>Your passport status changes to stolen.</p>
              <p>The missing board gets a fresh map card for your bike.</p>
              <p>Future found-bike posts will try to match against this report and notify you.</p>
            </div>
          </article>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--alert)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--alert-strong)]"
          >
            Mark bike as missing
          </button>
        </aside>
      </form>
    </div>
  );
}