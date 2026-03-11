import Link from "next/link";
import { createBikePassport } from "@/app/actions/passports";
import { StatusPill } from "@/components/status-pill";

const parkingSpots = [
  "PCL racks",
  "Speedway Mall",
  "Jester racks",
  "West Campus edge",
  "San Antonio Garage",
];

const lockChoices = ["U-lock", "U-lock + cable", "Folding lock", "Chain lock", "Other"];

type NewBikePageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
        {label}
      </span>
      {hint ? <span className="block text-sm text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

function TextInput({
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
    />
  );
}

export default async function NewBikePage({ searchParams }: NewBikePageProps) {
  const params = (await searchParams) ?? {};

  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-bold text-[var(--accent-strong)]">
              Back to dashboard
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <StatusPill label="Step 1: registration" tone="accent" />
              <StatusPill label="real save flow" tone="success" />
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
              Create a bike passport that actually saves.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
              This page now writes to the project data store. Start with the fields that
              matter most for ownership, recovery, and fast reporting.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 md:max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
              MVP note
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              This pass stores text notes for receipt proof and photos. Real file uploads can be the
              next backend milestone.
            </p>
          </div>
        </div>
      </section>

      {params.error === "missing-fields" ? (
        <div className="rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          Fill in the required ownership fields before saving the passport.
        </div>
      ) : null}

      <form action={createBikePassport} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card-surface rounded-[32px] p-6 md:p-8">
          <div className="grid gap-8">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                Owner
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Owner name" />
                  <TextInput name="ownerName" placeholder="Maya Chen" required />
                </div>
                <div>
                  <FieldLabel label="Primary email" />
                  <TextInput name="ownerEmail" placeholder="maya@utexas.edu" type="email" required />
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                Bike identity
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Bike nickname" hint="This becomes the label riders recognize in alerts." />
                  <TextInput name="nickname" placeholder="Burnt Orange Commuter" required />
                </div>
                <div>
                  <FieldLabel label="Make" />
                  <TextInput name="make" placeholder="Trek" required />
                </div>
                <div>
                  <FieldLabel label="Model" />
                  <TextInput name="model" placeholder="FX 2 Disc" required />
                </div>
                <div>
                  <FieldLabel label="Color" />
                  <TextInput name="color" placeholder="Burnt orange" required />
                </div>
                <div>
                  <FieldLabel label="Frame size" />
                  <TextInput name="frameSize" placeholder="Medium" />
                </div>
                <div>
                  <FieldLabel label="Serial number" hint="This is the strongest recovery field." />
                  <TextInput name="serialNumber" placeholder="WTU2485MUT26" required />
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                Proof and habits
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Purchase source" />
                  <TextInput name="purchaseSource" placeholder="Bicycle Sport Shop" />
                </div>
                <div>
                  <FieldLabel label="Purchase date" />
                  <TextInput name="purchaseDate" placeholder="August 2025" />
                </div>
                <div>
                  <FieldLabel label="Receipt note or link" hint="Store a receipt note, link, or screenshot reference." />
                  <TextInput name="receiptReference" placeholder="Google Drive receipt link" />
                </div>
                <div>
                  <FieldLabel label="Photo summary" hint="Describe what photos were captured for the bike." />
                  <TextInput name="photoSummary" placeholder="Left side, right side, serial close-up" />
                </div>
                <div>
                  <FieldLabel label="Lock setup" />
                  <select
                    name="lockType"
                    required
                    defaultValue="U-lock"
                    className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
                  >
                    {lockChoices.map((choice) => (
                      <option key={choice}>{choice}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel label="Common parking spot" />
                  <select
                    name="commonParking"
                    required
                    defaultValue="PCL racks"
                    className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
                  >
                    {parkingSpots.map((spot) => (
                      <option key={spot}>{spot}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <FieldLabel label="Distinctive notes" hint="Stickers, racks, lights, scuffs, baskets, tags, or hardware mods." />
                  <textarea
                    name="note"
                    rows={4}
                    placeholder="Bottle cage has a Longhorn sticker. Front light mount is scratched."
                    className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
              Why this page is simpler
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              The landing page handles the problem explanation. This screen stays focused on the
              fields the rider needs to enter right now.
            </p>
          </article>
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
              After save
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                The passport is stored in the project data store.
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                You are redirected to the bike detail page.
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                The dashboard updates to show the new passport.
              </div>
            </div>
          </article>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
          >
            Save bike passport
          </button>
        </aside>
      </form>
    </div>
  );
}