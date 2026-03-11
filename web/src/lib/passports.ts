import { unstable_noStore as noStore } from "next/cache";
import { readBikes, readUsers } from "@/lib/store";

export type DashboardPassport = {
  id: string;
  ownerId: string;
  ownerName: string;
  nickname: string;
  make: string;
  model: string;
  color: string;
  frameSize: string;
  serialNumber: string;
  lockType: string;
  commonParking: string[];
  purchaseDate: string;
  purchaseSource: string;
  receiptReference: string;
  photoSummary: string;
  receiptStatus: "Uploaded" | "Pending";
  status: "Protected" | "Stolen" | "Recovered";
  lastSeen: string;
  reportedAt: string;
  note: string;
  heroTone: "burnt" | "sage" | "steel";
};

function splitParking(value: string) {
  return value
    .split(",")
    .map((spot) => spot.trim())
    .filter(Boolean);
}

export async function getPassportsForUser(userId: string) {
  noStore();
  const [users, bikes] = await Promise.all([readUsers(), readBikes()]);
  const owner = users.find((candidate) => candidate.id === userId);

  return bikes
    .filter((bike) => bike.ownerId === userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((bike) => ({
      id: bike.slug,
      ownerId: bike.ownerId,
      ownerName: owner?.name ?? "Unknown owner",
      nickname: bike.nickname,
      make: bike.make,
      model: bike.model,
      color: bike.color,
      frameSize: bike.frameSize,
      serialNumber: bike.serialNumber,
      lockType: bike.lockType,
      commonParking: splitParking(bike.commonParking),
      purchaseDate: bike.purchaseDate,
      purchaseSource: bike.purchaseSource,
      receiptReference: bike.receiptReference,
      photoSummary: bike.photoSummary,
      receiptStatus: bike.receiptStatus,
      status: bike.status,
      lastSeen: bike.lastSeen,
      reportedAt: bike.reportedAt,
      note: bike.note,
      heroTone: bike.heroTone,
    })) satisfies DashboardPassport[];
}

export async function getBikePassportBySlug(slug: string) {
  noStore();
  const [users, bikes] = await Promise.all([readUsers(), readBikes()]);
  const bike = bikes.find((candidate) => candidate.slug === slug);

  if (!bike) {
    return null;
  }

  const owner = users.find((candidate) => candidate.id === bike.ownerId);

  return {
    id: bike.slug,
    ownerId: bike.ownerId,
    ownerName: owner?.name ?? "Unknown owner",
    nickname: bike.nickname,
    make: bike.make,
    model: bike.model,
    color: bike.color,
    frameSize: bike.frameSize,
    serialNumber: bike.serialNumber,
    lockType: bike.lockType,
    commonParking: splitParking(bike.commonParking),
    purchaseDate: bike.purchaseDate,
    purchaseSource: bike.purchaseSource,
    receiptReference: bike.receiptReference,
    photoSummary: bike.photoSummary,
    receiptStatus: bike.receiptStatus,
    status: bike.status,
    lastSeen: bike.lastSeen,
    reportedAt: bike.reportedAt,
    note: bike.note,
    heroTone: bike.heroTone,
  } satisfies DashboardPassport;
}