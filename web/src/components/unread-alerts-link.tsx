"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type UnreadAlertsLinkProps = {
  initialCount: number;
};

function formatUnreadLabel(count: number) {
  return `${count} unread alert${count === 1 ? "" : "s"}`;
}

export function UnreadAlertsLink({ initialCount }: UnreadAlertsLinkProps) {
  const pathname = usePathname();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;

    async function loadUnreadCount() {
      try {
        const response = await fetch("/api/notifications/unread", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { count?: number };

        if (!cancelled && typeof payload.count === "number") {
          setCount(payload.count);
        }
      } catch {
        // Keep the last rendered count if the refresh request fails.
      }
    }

    void loadUnreadCount();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const chipClassName =
    count > 0
      ? "border-[rgba(78,124,106,0.18)] bg-[rgba(78,124,106,0.1)] text-[var(--success-strong)]"
      : "border-[var(--line)] bg-[var(--card)] text-[var(--muted-strong)]";

  return (
    <Link
      href="/sign-in"
      className={`rounded-full border px-4 py-2 font-semibold transition hover:border-[rgba(191,87,0,0.18)] hover:text-[var(--foreground)] ${chipClassName}`}
    >
      {formatUnreadLabel(count)}
    </Link>
  );
}
