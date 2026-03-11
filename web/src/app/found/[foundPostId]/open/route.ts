import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { markFoundPostNotificationsRead } from "@/lib/notifications";
import { USER_SESSION_COOKIE } from "@/lib/store";

type OpenFoundLeadRouteProps = {
  params: Promise<{
    foundPostId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: OpenFoundLeadRouteProps) {
  const { foundPostId } = await params;
  const userId = request.cookies.get(USER_SESSION_COOKIE)?.value;

  if (userId) {
    const bikeSlugs = await markFoundPostNotificationsRead(userId, foundPostId);

    if (bikeSlugs.length) {
      revalidatePath("/", "layout");
      revalidatePath("/sign-in");
      revalidatePath(`/found/${foundPostId}`);
      bikeSlugs.forEach((bikeSlug) => revalidatePath(`/bikes/${bikeSlug}`));
    }
  }

  return NextResponse.redirect(new URL(`/found/${foundPostId}`, request.url));
}
