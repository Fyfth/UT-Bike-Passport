import { NextRequest, NextResponse } from "next/server";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { USER_SESSION_COOKIE } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get(USER_SESSION_COOKIE)?.value;

  if (!userId) {
    return NextResponse.json({ count: 0 });
  }

  const count = await getUnreadNotificationCount(userId);
  return NextResponse.json({ count });
}
