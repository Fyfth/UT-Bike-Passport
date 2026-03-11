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
        <section className="card-surface rounded-[34px] p-8 md:p-10">
          <StatusPill label="Signed in" tone="success" />
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
            {currentUser.name}, you are ready to create, report, and recover bike passports.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
            This is now the account hub: your bikes, your missing reports, and any found-bike leads the matching system has generated for you.
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
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
            >
              Open missing board
            </Link>
            <Link
              href="/found"
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-white"
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
                  <Link href={`/bikes/${notification.bikeSlug}`} className="mt-4 inline-block text-sm font-bold text-[var(--accent-strong)]">
                    Open {notification.bikeNickname}
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <article className="card-surface rounded-[28px] p-5 text-sm leading-7 text-[var(--muted)]">
              No leads yet. Once a found-bike post overlaps with one of your missing passports, the alert will show up here.
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
    <div className="grid gap-6 pb-10 lg:grid-cols-[1fr_0.95fr]">
      <section className="card-surface rounded-[34px] p-8 md:p-10">
        <StatusPill label="Step 1: user sign in" tone="accent" />
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] text-[var(--foreground)] md:text-6xl">
          Create your user profile before you create your bike passport.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-strong)]">
          For this MVP, sign-in is lightweight: name and email create or reopen your local account so
          every bike passport can be tied to a real user record.
        </p>
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
              placeholder="Maya Chen"
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Email</label>
            <input
              name="email"
              required
              type="email"
              placeholder="maya@utexas.edu"
              className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)]"
          >
            Sign in and continue
          </button>
        </form>
      </section>

      <aside className="space-y-6">
        <article className="card-surface rounded-[32px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">Why sign in first</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
              The bike gets associated to a user account immediately.
            </div>
            <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
              Returning riders can see all passports already tied to their email.
            </div>
            <div className="rounded-[22px] bg-[rgba(35,22,15,0.05)] p-4 text-sm leading-6 text-[var(--muted)]">
              Notifications for found-bike matches have a user to land on.
            </div>
          </div>
        </article>
        <article className="card-surface rounded-[32px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">CSV files</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <p><code>web/data/users.csv</code> stores signed-in users.</p>
            <p><code>web/data/bikes.csv</code> stores bike passports linked by <code>ownerId</code>.</p>
            <p><code>web/data/notifications.csv</code> stores found-bike alerts.</p>
          </div>
        </article>
        <article className="card-surface rounded-[32px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">You can still browse</p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            The missing-board map and found-bike desk stay open to everyone, but creating a passport now requires sign-in.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/missing" className="text-sm font-bold text-[var(--accent-strong)]">
              View the missing board
            </Link>
            <Link href="/found" className="text-sm font-bold text-[var(--accent-strong)]">
              Open the found-bike desk
            </Link>
          </div>
        </article>
      </aside>
    </div>
  );
}