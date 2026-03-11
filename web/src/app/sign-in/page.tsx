import Link from "next/link";
import { signInUser } from "@/app/actions/auth";
import { PassportCard } from "@/components/passport-card";
import { StatusPill } from "@/components/status-pill";
import { getNotificationsForUser } from "@/lib/notifications";
import { getPassportsForUser } from "@/lib/passports";
import { getCurrentUser } from "@/lib/store";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {};
  const currentUser = await getCurrentUser();

  if (currentUser) {
    const [passports, notifications] = await Promise.all([
      getPassportsForUser(currentUser.id),
      getNotificationsForUser(currentUser.id),
    ]);

    return (
      <div className="space-y-8 pb-10">
        <section className="card-surface rounded-[36px] border-t-4 border-[var(--accent)] p-8 md:p-10">
          <StatusPill label="Signed in" tone="success" />
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
            {currentUser.name}, this is your UT bike recovery dashboard.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
            Manage your passports, review recovery leads, and jump straight to the missing board or found-bike desk.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bikes/new"
              className="rounded-full bg-[var(--accent)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              Create your bike passport
            </Link>
            <Link
              href="/missing"
              className="rounded-full border border-[var(--line)] bg-[var(--card)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:border-[rgba(191,87,0,0.18)]"
            >
              Open missing board
            </Link>
            <Link
              href="/found"
              className="rounded-full border border-[var(--line)] bg-[var(--card)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:border-[rgba(191,87,0,0.18)]"
            >
              Found-bike desk
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Notifications</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Possible recovery leads</h2>
            </div>
            <StatusPill label={`${notifications.filter((item) => item.status === "Unread").length} unread`} tone={notifications.some((item) => item.status === "Unread") ? "success" : "quiet"} />
          </div>
          {notifications.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {notifications.map((notification) => (
                <article key={notification.id} className="card-surface rounded-[28px] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">{notification.foundSummary}</p>
                      <h3 className="mt-2 font-display text-2xl font-black text-[var(--foreground)]">{notification.title}</h3>
                    </div>
                    <StatusPill label={notification.status} tone={notification.status === "Unread" ? "success" : "quiet"} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{notification.message}</p>
                  <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">Why it matched: {notification.reason}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <Link href={`/found/${notification.foundPostId}/open`} prefetch={false} className="text-sm font-bold text-[var(--accent-strong)]">
                      Open found post
                    </Link>
                    <Link href={`/bikes/${notification.bikeSlug}`} className="text-sm font-bold text-[var(--success-strong)]">
                      Open {notification.bikeNickname}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <article className="card-surface rounded-[28px] p-5 text-sm leading-7 text-[var(--muted)]">
              No active recovery leads yet. When a found-bike post overlaps with one of your missing passports, it will appear here.
            </article>
          )}
        </section>

        {passports.length ? (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Your bikes</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[var(--foreground)]">Passports on your account</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {passports.map((passport) => (
                <PassportCard key={passport.id} passport={passport} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid gap-6 pb-10 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[36px] bg-[var(--accent)] p-8 text-white md:p-10">
        <StatusPill label="Start here" tone="quiet" />
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] md:text-6xl">
          Build your UT Austin bike record before you need it.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[rgba(255,255,255,0.84)]">
          Sign in with your name and email, then create a passport that stores the details riders and campus helpers need when a bike goes missing.
        </p>
        <ul className="mt-8 space-y-3 text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.76)]">
          <li>Serial number, make, model, and lock setup</li>
          <li>Fast reporting to the missing board</li>
          <li>Found-bike alerts routed back to you</li>
        </ul>
      </section>

      <section className="card-surface rounded-[36px] p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">Sign in</p>
        <h2 className="mt-3 font-display text-4xl font-black text-[var(--foreground)]">Create or reopen your rider profile.</h2>
        {params.error === "missing-fields" ? (
          <div className="mt-6 rounded-[24px] border border-[rgba(178,73,51,0.22)] bg-[rgba(178,73,51,0.08)] px-5 py-4 text-sm font-semibold text-[var(--alert-strong)]">
            Enter both your name and your email to continue.
          </div>
        ) : null}
        <form action={signInUser} className="mt-8 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Full name</label>
            <input
              name="name"
              required
              placeholder="Johnny Shen"
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Email</label>
            <input
              name="email"
              required
              type="email"
              placeholder="johnny@utexas.edu"
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
          >
            Sign in and continue
          </button>
        </form>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-[var(--muted-strong)]">
          <Link href="/missing" className="text-[var(--accent-strong)]">
            Browse the missing board
          </Link>
          <Link href="/found" className="text-[var(--accent-strong)]">
            Open the found-bike desk
          </Link>
        </div>
      </section>
    </div>
  );
}
