import { unstable_noStore as noStore } from "next/cache";
import { readStore, type HeroTone, type MatchConfidence, type PassportStatus, type ReceiptStatus } from "@/lib/store";

export type DashboardPassport = {
  id: string;
  nickname: string;
  ownerName: string;
  make: string;
  model: string;
  color: string;
  frameSize: string;
  serialNumber: string;
  lockType: string;
  commonParking: string[];
  purchaseDate?: string | null;
  purchaseSource?: string | null;
  receiptReference?: string | null;
  photoSummary?: string | null;
  receiptStatus: ReceiptStatus;
  status: PassportStatus;
  lastSeen?: string | null;
  reportedAt?: string | null;
  note: string;
  heroTone: HeroTone;
};

export type DashboardRecoveredBike = {
  id: string;
  title: string;
  foundAt: string;
  zone: string;
  holdStatus: string;
  note: string;
  matchCandidates: {
    passportSlug: string;
    passportNickname: string;
    confidence: MatchConfidence;
    reason: string;
  }[];
};

function splitParking(value: string) {
  return value
    .split(",")
    .map((spot) => spot.trim())
    .filter(Boolean);
}

export async function getDashboardData() {
  noStore();
  const store = await readStore();

  const passports: DashboardPassport[] = store.passports
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((passport) => {
      const owner = store.owners.find((candidate) => candidate.id === passport.ownerId);

      return {
        id: passport.slug,
        nickname: passport.nickname,
        ownerName: owner?.name ?? "Unknown owner",
        make: passport.make,
        model: passport.model,
        color: passport.color,
        frameSize: passport.frameSize,
        serialNumber: passport.serialNumber,
        lockType: passport.lockType,
        commonParking: splitParking(passport.commonParking),
        purchaseDate: passport.purchaseDate,
        purchaseSource: passport.purchaseSource,
        receiptReference: passport.receiptReference,
        photoSummary: passport.photoSummary,
        receiptStatus: passport.receiptStatus,
        status: passport.status,
        lastSeen: passport.lastSeen,
        reportedAt: passport.reportedAt,
        note: passport.note,
        heroTone: passport.heroTone,
      };
    });

  const recoveredBikes: DashboardRecoveredBike[] = store.recoveredBikes
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((bike) => ({
      id: bike.id,
      title: bike.title,
      foundAt: bike.foundAt,
      zone: bike.zone,
      holdStatus: bike.holdStatus,
      note: bike.note,
      matchCandidates: bike.matchCandidates.map((candidate) => ({
        passportSlug: candidate.passportSlug,
        passportNickname:
          store.passports.find((passport) => passport.slug === candidate.passportSlug)?.nickname ??
          candidate.passportSlug,
        confidence: candidate.confidence,
        reason: candidate.reason,
      })),
    }));

  return {
    passports,
    recoveredBikes,
    stats: {
      passportCount: passports.length,
      stolenCount: passports.filter((passport) => passport.status === "Stolen").length,
      possibleMatches: recoveredBikes.reduce((total, bike) => total + bike.matchCandidates.length, 0),
    },
  };
}

export async function getBikePassportBySlug(slug: string) {
  noStore();
  const store = await readStore();
  const passport = store.passports.find((candidate) => candidate.slug === slug);

  if (!passport) {
    return null;
  }

  const owner = store.owners.find((candidate) => candidate.id === passport.ownerId);
  const matches = store.recoveredBikes
    .filter((bike) => bike.matchCandidates.some((candidate) => candidate.passportSlug === slug))
    .map((bike) => ({
      id: bike.id,
      title: bike.title,
      foundAt: bike.foundAt,
      zone: bike.zone,
      holdStatus: bike.holdStatus,
      note: bike.note,
      confidence:
        bike.matchCandidates.find((candidate) => candidate.passportSlug === slug)?.confidence ??
        "Needs review",
      reason:
        bike.matchCandidates.find((candidate) => candidate.passportSlug === slug)?.reason ??
        "Possible visual overlap.",
    }));

  return {
    id: passport.slug,
    nickname: passport.nickname,
    ownerName: owner?.name ?? "Unknown owner",
    make: passport.make,
    model: passport.model,
    color: passport.color,
    frameSize: passport.frameSize,
    serialNumber: passport.serialNumber,
    lockType: passport.lockType,
    commonParking: splitParking(passport.commonParking),
    purchaseDate: passport.purchaseDate,
    purchaseSource: passport.purchaseSource,
    receiptReference: passport.receiptReference,
    photoSummary: passport.photoSummary,
    receiptStatus: passport.receiptStatus,
    status: passport.status,
    lastSeen: passport.lastSeen,
    reportedAt: passport.reportedAt,
    note: passport.note,
    heroTone: passport.heroTone,
    matches,
  };
}

export async function getRecoveryBoardData() {
  noStore();
  const store = await readStore();

  return store.recoveredBikes
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((bike) => ({
      id: bike.id,
      title: bike.title,
      foundAt: bike.foundAt,
      zone: bike.zone,
      holdStatus: bike.holdStatus,
      note: bike.note,
      matchCandidates: bike.matchCandidates.map((candidate) => ({
        passportSlug: candidate.passportSlug,
        passportNickname:
          store.passports.find((passport) => passport.slug === candidate.passportSlug)?.nickname ??
          candidate.passportSlug,
        confidence: candidate.confidence,
        reason: candidate.reason,
      })),
    }));
}