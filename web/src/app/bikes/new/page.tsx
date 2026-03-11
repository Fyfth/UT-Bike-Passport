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
      className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
    />
  );
}

export default async function NewBikePage({ searchParams }: NewBikePageProps) {
  const params = (await searchParams) ?? {};
  const currentUser = await requireCurrentUser();

  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[36px] border-t-4 border-[var(--accent)] p-8 md:p-10">
        <Link href="/sign-in" className="text-sm font-bold text-[var(--accent-strong)]">
          Back to dashboard
        </Link>
        <div className="mt-5 flex items-center gap-3">
          <StatusPill label="Bike passport" tone="accent" />
          <StatusPill label={currentUser.name} tone="success" />
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
          Create a recovery-ready passport for your bike.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
          Use the details that would help another rider, staff member, or campus officer verify the bike fast if it goes missing.
        </p>
      </section>

      {params.error === "missing-fields" ? (
        <div className="rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
          Fill in the required bike fields before saving the passport.
        </div>
      ) : null}

      <form action={createBikePassport} className="card-surface rounded-[32px] p-6 md:p-8">
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
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
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
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
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
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[rgba(92,59,28,0.08)] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-7 text-[var(--muted)]">
            Prioritize the details another Longhorn would recognize instantly: serial, color, stickers, racks, bags, baskets, or lock marks.
          </p>
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
          >
            Save passport
          </button>
        </div>
      </form>
    </div>
  );
}
