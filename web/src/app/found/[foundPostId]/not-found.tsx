import Link from "next/link";

export default function FoundLeadNotFound() {
  return (
    <div className="card-surface mx-auto mt-10 max-w-2xl rounded-[32px] p-8 text-center md:mt-16 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Found post not found</p>
      <h1 className="mt-4 font-display text-5xl font-black text-[var(--foreground)]">That found-bike lead does not exist anymore.</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
        Head back to the found-bike desk to review current leads or return to your alerts.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/found" className="rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--accent-strong)]">
          Back to found desk
        </Link>
        <Link href="/sign-in" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-white">
          Open alerts
        </Link>
      </div>
    </div>
  );
}
