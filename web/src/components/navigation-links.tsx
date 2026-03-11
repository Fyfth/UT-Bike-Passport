"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/bikes/new", label: "Create Passport" },
  { href: "/missing", label: "Missing Board" },
  { href: "/found", label: "Found Desk" },
];

export function NavigationLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2 rounded-[28px] border border-[var(--line)] bg-[rgba(255,248,239,0.72)] p-2 shadow-[0_20px_60px_rgba(53,38,22,0.08)]">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

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
  );
}