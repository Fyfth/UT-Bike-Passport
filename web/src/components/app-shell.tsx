import Link from "next/link";
import type { ReactNode } from "react";
import { signOutUser } from "@/app/actions/auth";
import { NavigationLinks } from "@/components/navigation-links";
import { UnreadAlertsLink } from "@/components/unread-alerts-link";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/store";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const currentUser = await getCurrentUser();
  const unreadCount = currentUser ? await getUnreadNotificationCount(currentUser.id) : 0;

  return (
    <div className="min-h-screen pb-12">
      <header className="border-b border-[rgba(191,87,0,0.14)] bg-[var(--card-strong)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-strong)]">
              University of Texas at Austin
            </p>
            <Link href="/" className="mt-2 inline-block font-display text-3xl font-black tracking-tight text-[var(--foreground)]">
              UT Bike Passport
            </Link>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              Campus bike recovery, ownership records, and crowd-sourced leads for Longhorn riders.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <NavigationLinks />
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-strong)]">
              {currentUser ? (
                <>
                  <span>
                    Signed in as <strong className="text-[var(--foreground)]">{currentUser.name}</strong>
                  </span>
                  <UnreadAlertsLink initialCount={unreadCount} />
                  <form action={signOutUser}>
                    <button type="submit" className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:border-[rgba(191,87,0,0.18)] hover:text-[var(--accent-strong)]">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/sign-in" className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:border-[rgba(191,87,0,0.18)] hover:text-[var(--accent-strong)]">
                  Sign in to start
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 md:px-8">{children}</main>
    </div>
  );
}
