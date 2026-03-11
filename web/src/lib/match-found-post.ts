import type { BikeRecord, FoundPostRecord, MissingReportRecord, NotificationRecord } from "@/lib/store";

type MatchResult = {
  bike: BikeRecord;
  missingReport: MissingReportRecord | undefined;
  score: number;
  reasons: string[];
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function includesBoth(left: string, right: string) {
  const normalizedLeft = normalize(left);
  const normalizedRight = normalize(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  return normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft);
}

function tokenSet(value: string) {
  return new Set(normalize(value).split(/\s+/).filter(Boolean));
}

function overlapCount(left: string, right: string) {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);
  let count = 0;

  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      count += 1;
    }
  });

  return count;
}

export function matchFoundPostToMissingBikes(foundPost: FoundPostRecord, bikes: BikeRecord[], missingReports: MissingReportRecord[]) {
  const activeBikeSlugs = new Set(missingReports.filter((report) => report.passportSlug).map((report) => report.passportSlug));

  const candidates = bikes.filter((bike) => bike.status === "Stolen" || activeBikeSlugs.has(bike.slug));

  return candidates
    .map((bike) => {
      let score = 0;
      const reasons: string[] = [];

      if (foundPost.serialNumber && bike.serialNumber && normalize(foundPost.serialNumber) === normalize(bike.serialNumber)) {
        score += 100;
        reasons.push("serial number matched exactly");
      }

      if (foundPost.make && includesBoth(foundPost.make, bike.make)) {
        score += 20;
        reasons.push("make matched");
      }

      if (foundPost.model && includesBoth(foundPost.model, bike.model)) {
        score += 25;
        reasons.push("model matched");
      }

      if (foundPost.color && includesBoth(foundPost.color, bike.color)) {
        score += 15;
        reasons.push("color matched");
      }

      const keywordMatches = overlapCount(foundPost.keywords, `${bike.nickname} ${bike.note} ${bike.make} ${bike.model}`);
      if (keywordMatches > 0) {
        score += Math.min(18, keywordMatches * 6);
        reasons.push("keywords overlapped");
      }

      const missingReport = missingReports.find((report) => report.passportSlug === bike.slug);
      const accepted = reasons.includes("serial number matched exactly") || score >= 40;

      if (!accepted) {
        return null;
      }

      return {
        bike,
        missingReport,
        score,
        reasons,
      } satisfies MatchResult;
    })
    .filter((match): match is MatchResult => Boolean(match))
    .sort((left, right) => right.score - left.score);
}

export function hasExistingNotification(notifications: NotificationRecord[], userId: string, bikeSlug: string, foundPostId: string) {
  return notifications.some(
    (notification) =>
      notification.userId === userId &&
      notification.bikeSlug === bikeSlug &&
      notification.foundPostId === foundPostId,
  );
}
