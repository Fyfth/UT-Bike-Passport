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
    <nav className="flex flex-wrap items-center gap-2 rounded-[22px] border border-[var(--line)] bg-[var(--card)] p-2">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-[var(--accent)] text-white shadow-[0_8px_24px_rgba(191,87,0,0.2)]"
                : "bg-transparent text-[var(--muted-strong)] hover:bg-[rgba(191,87,0,0.08)] hover:text-[var(--foreground)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
