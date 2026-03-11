type StatusPillProps = {
  label: string;
  tone?: "neutral" | "accent" | "success" | "alert" | "quiet";
};

const toneClasses: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  neutral: "border border-[var(--line)] bg-[var(--card-strong)] text-[var(--foreground)]",
  accent: "border border-[rgba(191,87,0,0.18)] bg-[rgba(191,87,0,0.1)] text-[var(--accent-strong)]",
  success: "border border-[rgba(78,124,106,0.18)] bg-[rgba(78,124,106,0.1)] text-[var(--success-strong)]",
  alert: "border border-[rgba(196,91,69,0.18)] bg-[rgba(196,91,69,0.1)] text-[var(--alert-strong)]",
  quiet: "border border-[var(--line)] bg-[rgba(255,255,255,0.7)] text-[var(--muted-strong)]",
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
