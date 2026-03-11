import Link from "next/link";
import { createBikePassport } from "@/app/actions/passports";
import { StatusPill } from "@/components/status-pill";
import { requireCurrentUser } from "@/lib/store";

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

function FieldLabel({ label }: { label: string }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">
      {label}
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
      className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
    />
  );
}

export default async function NewBikePage({ searchParams }: NewBikePageProps) {
  const params = (await searchParams) ?? {};
  const currentUser = await requireCurrentUser();

  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <Link href="/sign-in" className="text-sm font-bold text-[var(--accent-strong)]">
          Back to sign in
        </Link>
        <div className="mt-5 flex items-center gap-3">
          <StatusPill label="Step 2: bike passport" tone="accent" />
          <StatusPill label={`Signed in as ${currentUser.name}`} tone="success" />
        </div>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
          Create a bike passport for your signed-in account.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
          The owner fields are gone now because the bike will be attached directly to <strong>{currentUser.name}</strong>
          &#39;s account.
        </p>
      </section>

      {params.error === "missing-fields" ? (
        <div className="rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          Fill in the required bike fields before saving the passport.
        </div>
      ) : null}

      <form action={createBikePassport} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface rounded-[32px] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <FieldLabel label="Bike nickname" />
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
              <FieldLabel label="Serial number" />
              <TextInput name="serialNumber" placeholder="WTU2485MUT26" required />
            </div>
            <div>
              <FieldLabel label="Purchase source" />
              <TextInput name="purchaseSource" placeholder="Bicycle Sport Shop" />
            </div>
            <div>
              <FieldLabel label="Purchase date" />
              <TextInput name="purchaseDate" placeholder="August 2025" />
            </div>
            <div>
              <FieldLabel label="Receipt note or link" />
              <TextInput name="receiptReference" placeholder="Receipt link or note" />
            </div>
            <div>
              <FieldLabel label="Photo summary" />
              <TextInput name="photoSummary" placeholder="Left side, right side, serial close-up" />
            </div>
            <div>
              <FieldLabel label="Lock setup" />
              <select
                name="lockType"
                required
                defaultValue="U-lock"
                className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
              >
                {lockChoices.map((choice) => (
                  <option key={choice}>{choice}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel label="Common parking" />
              <select
                name="commonParking"
                required
                defaultValue="PCL racks"
                className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
              >
                {parkingSpots.map((spot) => (
                  <option key={spot}>{spot}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Distinctive notes" />
              <textarea
                name="note"
                rows={4}
                placeholder="Sticker, rack, basket, scratch, bell, or anything a recoverer would notice."
                className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">After save</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                The passport is attached to your signed-in user profile.
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                You land directly on your bike passport page.
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                From there you can jump to the missing board and inspect the map.
              </div>
            </div>
          </article>
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Where the data goes</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              <p>Your user record is stored in <code>web/data/users.csv</code>.</p>
              <p>Your bike passport is stored in <code>web/data/bikes.csv</code>.</p>
            </div>
          </article>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
          >
            Save passport to your account
          </button>
        </aside>
      </form>
    </div>
  );
}
