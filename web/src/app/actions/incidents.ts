"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCampusLocationById } from "@/lib/campus-locations";
import { hasExistingNotification, matchFoundPostToMissingBikes } from "@/lib/match-found-post";
import { formatInputDateTime, formatReportedLabel } from "@/lib/time";
import {
  readBikes,
  readFoundPosts,
  readMissingReports,
  readNotifications,
  requireCurrentUser,
  writeBikes,
  writeFoundPosts,
  writeMissingReports,
  writeNotifications,
} from "@/lib/store";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .trim()
    .replace(/[\r\n]+/g, " ");
}

function buildMissingSummary(color: string, make: string, model: string, landmark: string, note: string) {
  const bikeLabel = [color, make, model].filter(Boolean).join(" ");
  const detail = note ? ` ${note}` : "";
  return `${bikeLabel} last seen near ${landmark}.${detail}`.trim();
}

export async function reportBikeMissing(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const bikeSlug = readText(formData, "bikeSlug");
  const locationId = readText(formData, "locationId");
  const lastSeenAt = readText(formData, "lastSeenAt");
  const summaryNote = readText(formData, "summaryNote");
  const location = getCampusLocationById(locationId);

  if (!bikeSlug || !locationId) {
    redirect(bikeSlug ? `/bikes/${bikeSlug}/report-missing?error=missing-fields` : "/sign-in");
  }

  const bikes = await readBikes();
  const bikeIndex = bikes.findIndex((candidate) => candidate.slug === bikeSlug && candidate.ownerId === currentUser.id);

  if (bikeIndex === -1) {
    redirect("/sign-in");
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const bike = bikes[bikeIndex];

  bikes[bikeIndex] = {
    ...bike,
    status: "Stolen",
    lastSeen: formatInputDateTime(lastSeenAt) || `${location.landmark}`,
    reportedAt: formatReportedLabel(now),
    updatedAt: nowIso,
  };

  const reports = await readMissingReports();
  const nextReport = {
    id: `missing-${bike.slug}`,
    title: bike.nickname,
    bikeType: [bike.make, bike.model].filter(Boolean).join(" ") || "Bike passport on file",
    zone: location.zone,
    landmark: location.landmark,
    reportedAt: formatReportedLabel(now),
    status: "Fresh report" as const,
    summary: buildMissingSummary(bike.color, bike.make, bike.model, location.landmark, summaryNote || bike.note),
    x: String(location.x),
    y: String(location.y),
    lat: String(location.lat),
    lng: String(location.lng),
    passportSlug: bike.slug,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const reportIndex = reports.findIndex((report) => report.passportSlug === bike.slug);

  if (reportIndex >= 0) {
    reports[reportIndex] = {
      ...reports[reportIndex],
      ...nextReport,
      createdAt: reports[reportIndex].createdAt,
    };
  } else {
    reports.push(nextReport);
  }

  await Promise.all([writeBikes(bikes), writeMissingReports(reports)]);

  revalidatePath("/");
  revalidatePath("/sign-in");
  revalidatePath("/missing");
  revalidatePath(`/bikes/${bike.slug}`);
  redirect(`/bikes/${bike.slug}?updated=missing`);
}

export async function createFoundPost(formData: FormData) {
  const locationId = readText(formData, "locationId");
  const reporterName = readText(formData, "reporterName");
  const reporterContact = readText(formData, "reporterContact");
  const serialNumber = readText(formData, "serialNumber");
  const make = readText(formData, "make");
  const model = readText(formData, "model");
  const color = readText(formData, "color");
  const keywords = readText(formData, "keywords");
  const notes = readText(formData, "notes");
  const location = getCampusLocationById(locationId);

  if (!locationId || (!serialNumber && !make && !model && !color && !keywords)) {
    redirect("/found?error=missing-fields");
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const foundPost = {
    id: `found-${crypto.randomUUID()}`,
    reporterName: reporterName || "Anonymous campus helper",
    reporterContact,
    zone: location.zone,
    landmark: location.landmark,
    serialNumber,
    make,
    model,
    color,
    keywords,
    notes,
    x: String(location.x),
    y: String(location.y),
    lat: String(location.lat),
    lng: String(location.lng),
    status: "Open lead" as const,
    matchCount: "0",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const [foundPosts, bikes, missingReports, notifications] = await Promise.all([
    readFoundPosts(),
    readBikes(),
    readMissingReports(),
    readNotifications(),
  ]);

  const matches = matchFoundPostToMissingBikes(foundPost, bikes, missingReports);
  foundPost.status = matches.length ? "Matched lead" : "Open lead";
  foundPost.matchCount = String(matches.length);
  foundPosts.push(foundPost);

  const nextNotifications = [...notifications];
  const nextReports = [...missingReports];

  matches.forEach((match) => {
    if (hasExistingNotification(nextNotifications, match.bike.ownerId, match.bike.slug, foundPost.id)) {
      return;
    }

    const reason = match.reasons.join(", ");

    nextNotifications.push({
      id: `notification-${crypto.randomUUID()}`,
      userId: match.bike.ownerId,
      bikeSlug: match.bike.slug,
      foundPostId: foundPost.id,
      missingReportId: match.missingReport?.id ?? "",
      title: `Possible match for ${match.bike.nickname}`,
      message: `A found-bike post near ${location.landmark} matched your missing bike profile.`,
      reason,
      status: "Unread",
      createdAt: nowIso,
      updatedAt: nowIso,
    });

    if (match.missingReport) {
      const reportIndex = nextReports.findIndex((report) => report.id === match.missingReport?.id);
      if (reportIndex >= 0) {
        nextReports[reportIndex] = {
          ...nextReports[reportIndex],
          status: "Possible lead",
          updatedAt: nowIso,
        };
      }
    }
  });

  await Promise.all([
    writeFoundPosts(foundPosts),
    writeNotifications(nextNotifications),
    writeMissingReports(nextReports),
  ]);

  revalidatePath("/");
  revalidatePath("/sign-in");
  revalidatePath("/missing");
  revalidatePath("/found");
  matches.forEach((match) => revalidatePath(`/bikes/${match.bike.slug}`));
  redirect(`/found?submitted=1&matches=${matches.length}`);
}