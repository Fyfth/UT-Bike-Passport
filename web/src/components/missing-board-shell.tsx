"use client";

import dynamic from "next/dynamic";
import type { MissingBoardReport } from "@/lib/missing-reports";

type MissingBoardShellProps = {
  reports: MissingBoardReport[];
};

const LiveMissingBoard = dynamic(
  () => import("@/components/google-missing-board").then((module) => module.GoogleMissingBoard),
  {
    ssr: false,
    loading: () => (
      <div className="card-surface rounded-[34px] p-8 text-sm leading-7 text-[var(--muted)]">
        Loading the live map board...
      </div>
    ),
  },
);

export function MissingBoardShell({ reports }: MissingBoardShellProps) {
  return <LiveMissingBoard reports={reports} />;
}
