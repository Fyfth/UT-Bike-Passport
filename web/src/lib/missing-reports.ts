import { unstable_noStore as noStore } from "next/cache";
import { readMissingReports, type MissingReportStatus } from "@/lib/store";

export type MissingBoardStatus = MissingReportStatus;

export type MissingBoardReport = {
  id: string;
  title: string;
  bikeType: string;
  zone: string;
  landmark: string;
  reportedAt: string;
  status: MissingBoardStatus;
  summary: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  passportSlug?: string;
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getMissingBoardReports() {
  noStore();
  const records = await readMissingReports();

  return records
    .slice()
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((record) => ({
      id: record.id,
      title: record.title,
      bikeType: record.bikeType,
      zone: record.zone,
      landmark: record.landmark,
      reportedAt: record.reportedAt,
      status: record.status,
      summary: record.summary,
      x: toNumber(record.x),
      y: toNumber(record.y),
      lat: toNumber(record.lat),
      lng: toNumber(record.lng),
      passportSlug: record.passportSlug || undefined,
    })) satisfies MissingBoardReport[];
}