import Link from "next/link";
import type { ReactNode } from "react";
import { signOutUser } from "@/app/actions/auth";
import { NavigationLinks } from "@/components/navigation-links";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/store";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const currentUser = await getCurrentUser();
  const unreadCount = currentUser ? await getUnreadNotificationCount(currentUser.id) : 0;

  return (
    <div className="relative min-h-screen overflow-hidden pb-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(191,87,0,0.22),_transparent_66%)] blur-2xl" />
        <div className="absolute right-[-6rem] top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(112,143,125,0.18),_transparent_68%)] blur-3xl" />
      </div>
      <header className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Link href="/" className="font-display text-2xl font-black tracking-tight text-[var(--foreground)]">
            UT Bike Passport
          </Link>
          <p className="mt-1 text-sm text-[var(--muted-strong)]">
            Sign in, register your bike, report it missing, and route found leads back to the owner.
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
                <Link href="/sign-in" className="rounded-full border border-[rgba(53,104,89,0.18)] bg-[rgba(53,104,89,0.1)] px-4 py-2 font-semibold text-[var(--success-strong)] transition hover:bg-[rgba(53,104,89,0.16)]">
                  {unreadCount} unread alerts
                </Link>
                <form action={signOutUser}>
                  <button type="submit" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.78)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:bg-white">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/sign-in" className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.78)] px-4 py-2 font-semibold text-[var(--foreground)] transition hover:bg-white">
                Sign in to start
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-7xl px-4 md:px-8">{children}</main>
    </div>
  );
}