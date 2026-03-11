import { unstable_noStore as noStore } from "next/cache";
import { readFoundPosts } from "@/lib/store";

export type FoundLead = {
  id: string;
  reporterName: string;
  reporterContact: string;
  zone: string;
  landmark: string;
  serialNumber: string;
  make: string;
  model: string;
  color: string;
  keywords: string;
  notes: string;
  status: "Open lead" | "Matched lead";
  matchCount: number;
  createdAt: string;
};

export async function getFoundLeads() {
  noStore();
  const posts = await readFoundPosts();

  return posts
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((post) => ({
      id: post.id,
      reporterName: post.reporterName,
      reporterContact: post.reporterContact,
      zone: post.zone,
      landmark: post.landmark,
      serialNumber: post.serialNumber,
      make: post.make,
      model: post.model,
      color: post.color,
      keywords: post.keywords,
      notes: post.notes,
      status: post.status,
      matchCount: Number(post.matchCount) || 0,
      createdAt: post.createdAt,
    })) satisfies FoundLead[];
}
