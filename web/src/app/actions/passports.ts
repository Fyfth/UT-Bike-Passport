"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readBikes, requireCurrentUser, writeBikes } from "@/lib/store";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .trim()
    .replace(/[\r\n]+/g, " ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48) || "bike-passport";
}

function pickHeroTone(make: string, model: string) {
  const palette = ["burnt", "sage", "steel"] as const;
  return palette[`${make}${model}`.length % palette.length];
}

export async function createBikePassport(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const nickname = readText(formData, "nickname");
  const make = readText(formData, "make");
  const model = readText(formData, "model");
  const color = readText(formData, "color");
  const frameSize = readText(formData, "frameSize") || "Unspecified";
  const serialNumber = readText(formData, "serialNumber");
  const purchaseSource = readText(formData, "purchaseSource");
  const purchaseDate = readText(formData, "purchaseDate");
  const receiptReference = readText(formData, "receiptReference");
  const photoSummary = readText(formData, "photoSummary");
  const lockType = readText(formData, "lockType");
  const commonParking = readText(formData, "commonParking");
  const note = readText(formData, "note");

  if (!nickname || !make || !model || !color || !serialNumber || !lockType || !commonParking) {
    redirect("/bikes/new?error=missing-fields");
  }

  const bikes = await readBikes();
  const baseSlug = slugify(nickname);
  let slug = baseSlug;
  let suffix = 2;

  while (bikes.some((bike) => bike.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const now = new Date().toISOString();
  bikes.push({
    id: `bike-${crypto.randomUUID()}`,
    slug,
    ownerId: currentUser.id,
    nickname,
    make,
    model,
    color,
    frameSize,
    serialNumber,
    lockType,
    commonParking,
    purchaseDate,
    purchaseSource,
    receiptReference,
    photoSummary,
    receiptStatus: receiptReference ? "Uploaded" : "Pending",
    status: "Protected",
    lastSeen: "",
    reportedAt: "",
    note: note || "No distinctive notes yet.",
    heroTone: pickHeroTone(make, model),
    createdAt: now,
    updatedAt: now,
  });

  await writeBikes(bikes);

  revalidatePath("/");
  revalidatePath("/sign-in");
  revalidatePath("/bikes/new");
  revalidatePath("/missing");
  redirect(`/bikes/${slug}`);
}