import Link from "next/link";
import { StatusPill } from "@/components/status-pill";

const parkingSpots = ["PCL racks", "Speedway Mall", "Jester racks", "West Campus edge", "San Antonio Garage"];
const lockChoices = ["U-lock", "U-lock + cable", "Folding lock", "Chain lock", "Other"];

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{label}</span>
      {hint ? <span className="block text-sm text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

function Input({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
    />
  );
}

export default function NewBikePage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-sm font-bold text-[var(--accent-strong)]">
              Back to dashboard
            </Link>
            <div className="mt-5 flex items-center gap-3">
              <StatusPill label="Website-first" tone="accent" />
              <StatusPill label="mobile-ready later" tone="quiet" />
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
              Create a bike passport before anything goes wrong.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
              The first MVP is a responsive website. Riders should still be able to upload photos,
              receipts, and serials from a phone browser while we save native app integrations for
              the post-MVP roadmap.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-4 md:max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">What gets unlocked</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              A passport becomes a theft report packet, a shareable poster, and the source record for
              recovery alerts.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form className="card-surface rounded-[32px] p-6 md:p-8">
          <div className="grid gap-8">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Owner snapshot</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Owner name" />
                  <Input placeholder="Maya Chen" />
                </div>
                <div>
                  <FieldLabel label="Primary email" />
                  <Input placeholder="maya@utexas.edu" type="email" />
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Bike identity</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Bike nickname" hint="Make it memorable so alerts feel personal." />
                  <Input placeholder="Burnt Orange Commuter" />
                </div>
                <div>
                  <FieldLabel label="Make" />
                  <Input placeholder="Trek" />
                </div>
                <div>
                  <FieldLabel label="Model" />
                  <Input placeholder="FX 2 Disc" />
                </div>
                <div>
                  <FieldLabel label="Color" />
                  <Input placeholder="Burnt orange" />
                </div>
                <div>
                  <FieldLabel label="Frame size" />
                  <Input placeholder="Medium" />
                </div>
                <div>
                  <FieldLabel label="Serial number" hint="This becomes the cleanest recovery signal." />
                  <Input placeholder="WTU2485MUT26" />
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Proof of ownership</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Purchase source" />
                  <Input placeholder="Bicycle Sport Shop" />
                </div>
                <div>
                  <FieldLabel label="Purchase date" />
                  <Input placeholder="August 2025" />
                </div>
                <div>
                  <FieldLabel label="Receipt upload" hint="Native camera capture comes in the mobile app phase." />
                  <Input placeholder="Upload receipt" />
                </div>
                <div>
                  <FieldLabel label="Bike photo set" />
                  <Input placeholder="Upload three clear bike photos" />
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Security habits</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="Lock setup" />
                  <select className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white">
                    {lockChoices.map((choice) => (
                      <option key={choice}>{choice}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel label="Common parking spot" />
                  <select className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white">
                    {parkingSpots.map((spot) => (
                      <option key={spot}>{spot}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <FieldLabel label="Distinctive notes" hint="Stickers, racks, lights, scuffs, baskets, tags, or hardware mods." />
                  <textarea
                    rows={4}
                    placeholder="Bottle cage has a Longhorn sticker. Front light mount is scratched."
                    className="w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              Save passport draft
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
            >
              Preview theft packet
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Why receipts matter</p>
            <h2 className="mt-3 font-display text-3xl font-black text-[var(--foreground)]">Recovery works better when ownership proof starts early.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              This form is designed so a rider can capture enough detail once and reuse it in any later
              stolen-bike workflow, instead of rebuilding the story from memory under stress.
            </p>
          </article>
          <article className="card-surface rounded-[32px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Stage 2 preview</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                Native camera-first capture for receipts and bike photos.
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                Push notifications when a recovered-bike listing looks like a match.
              </div>
              <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
                Optional QR or hardware integrations without making hardware the core product.
              </div>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}

