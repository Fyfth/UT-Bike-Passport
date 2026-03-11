import { unstable_noStore as noStore } from "next/cache";
import { readBikes, readFoundPosts, readNotifications } from "@/lib/store";

export type UserNotification = {
  id: string;
  bikeSlug: string;
  bikeNickname: string;
  title: string;
  message: string;
  reason: string;
  status: "Unread" | "Read";
  createdAt: string;
  foundSummary: string;
};

export async function getNotificationsForUser(userId: string) {
  noStore();
  const [notifications, bikes, foundPosts] = await Promise.all([
    readNotifications(),
    readBikes(),
    readFoundPosts(),
  ]);

  return notifications
    .filter((notification) => notification.userId === userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((notification) => {
      const bike = bikes.find((candidate) => candidate.slug === notification.bikeSlug);
      const foundPost = foundPosts.find((candidate) => candidate.id === notification.foundPostId);

      return {
        id: notification.id,
        bikeSlug: notification.bikeSlug,
        bikeNickname: bike?.nickname ?? notification.bikeSlug,
        title: notification.title,
        message: notification.message,
        reason: notification.reason,
        status: notification.status,
        createdAt: notification.createdAt,
        foundSummary: foundPost ? `${foundPost.zone} - ${foundPost.landmark}` : "Found-bike lead",
      } satisfies UserNotification;
    });
}

export async function getUnreadNotificationCount(userId: string) {
  noStore();
  const notifications = await readNotifications();
  return notifications.filter((notification) => notification.userId === userId && notification.status === "Unread").length;
}
