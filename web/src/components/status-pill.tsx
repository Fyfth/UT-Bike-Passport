type StatusPillProps = {
  label: string;
  tone?: "neutral" | "accent" | "success" | "alert" | "quiet";
};

const toneClasses: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  neutral: "bg-[rgba(29,22,18,0.08)] text-[var(--foreground)]",
  accent: "bg-[rgba(191,87,0,0.12)] text-[var(--accent-strong)]",
  success: "bg-[rgba(70,117,93,0.14)] text-[var(--success-strong)]",
  alert: "bg-[rgba(201,75,50,0.14)] text-[var(--alert-strong)]",
  quiet: "bg-[rgba(255,255,255,0.65)] text-[var(--muted-strong)]",
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
