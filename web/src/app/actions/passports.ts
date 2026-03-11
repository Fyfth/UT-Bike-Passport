"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readStore, writeStore } from "@/lib/store";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
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
  const ownerName = readText(formData, "ownerName");
  const ownerEmail = readText(formData, "ownerEmail").toLowerCase();
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

  if (!ownerName || !ownerEmail || !nickname || !make || !model || !color || !serialNumber || !lockType || !commonParking) {
    redirect("/bikes/new?error=missing-fields");
  }

  const store = await readStore();
  const now = new Date().toISOString();
  const existingOwner = store.owners.find((owner) => owner.email === ownerEmail);
  const ownerId = existingOwner?.id ?? `owner-${crypto.randomUUID()}`;

  if (existingOwner) {
    existingOwner.name = ownerName;
    existingOwner.updatedAt = now;
  } else {
    store.owners.push({
      id: ownerId,
      name: ownerName,
      email: ownerEmail,
      createdAt: now,
      updatedAt: now,
    });
  }

  const baseSlug = slugify(nickname);
  let slug = baseSlug;
  let suffix = 2;

  while (store.passports.some((passport) => passport.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  store.passports.push({
    id: `passport-${crypto.randomUUID()}`,
    slug,
    ownerId,
    nickname,
    make,
    model,
    color,
    frameSize,
    serialNumber,
    lockType,
    commonParking,
    purchaseDate: purchaseDate || null,
    purchaseSource: purchaseSource || null,
    receiptReference: receiptReference || null,
    photoSummary: photoSummary || null,
    receiptStatus: receiptReference ? "Uploaded" : "Pending",
    status: "Protected",
    note: note || "No distinctive notes yet.",
    heroTone: pickHeroTone(make, model),
    createdAt: now,
    updatedAt: now,
  });

  await writeStore(store);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/recovery");
  redirect(`/bikes/${slug}`);
}