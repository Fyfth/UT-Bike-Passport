"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bikes/new", label: "Create Passport" },
  { href: "/recovery", label: "Recovery" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

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
            Bike ownership, theft reporting, and recovery matching for UT riders.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 rounded-[28px] border border-[var(--line)] bg-[rgba(255,248,239,0.72)] p-2 shadow-[0_20px_60px_rgba(53,38,22,0.08)]">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted-strong)] hover:bg-[rgba(191,87,0,0.1)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="relative mx-auto w-full max-w-7xl px-4 md:px-8">{children}</main>
    </div>
  );
}