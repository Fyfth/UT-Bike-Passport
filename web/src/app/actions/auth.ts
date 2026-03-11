"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readUsers, USER_SESSION_COOKIE, writeUsers } from "@/lib/store";

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .trim()
    .replace(/[\r\n]+/g, " ");
}

export async function signInUser(formData: FormData) {
  const name = readText(formData, "name");
  const email = readText(formData, "email").toLowerCase();

  if (!name || !email) {
    redirect("/sign-in?error=missing-fields");
  }

  const users = await readUsers();
  const now = new Date().toISOString();
  let user = users.find((candidate) => candidate.email === email);

  if (user) {
    user.name = name;
    user.updatedAt = now;
  } else {
    user = {
      id: `user-${crypto.randomUUID()}`,
      name,
      email,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
  }

  await writeUsers(users);

  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/");
  revalidatePath("/sign-in");
  revalidatePath("/bikes/new");
  redirect("/bikes/new");
}

export async function signOutUser() {
  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  revalidatePath("/");
  revalidatePath("/sign-in");
  redirect("/");
}