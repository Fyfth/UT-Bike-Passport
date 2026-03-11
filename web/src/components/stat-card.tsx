type StatCardProps = {
  label: string;
  value: string;
  note: string;
};

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <article className="card-surface rounded-[28px] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">
        {label}
      </p>
      <p className="mt-4 font-display text-4xl font-black text-[var(--foreground)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{note}</p>
    </article>
  );
}