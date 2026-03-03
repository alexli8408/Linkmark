import { auth, signIn } from "@/lib/auth";
import { Suspense } from "react";
import Link from "next/link";
import LinkmarkIcon from "@/components/LinkmarkIcon";
import Navbar from "@/components/Navbar";
import DashboardShell from "@/components/DashboardShell";
import BookmarkList from "@/components/BookmarkList";
import { BookmarkListSkeleton } from "@/components/Skeleton";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
      <DashboardShell navbar={<Navbar />}>
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Bookmarks
            </h1>
            <Link
              href="/new"
              className="btn-primary w-fit gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Bookmark
            </Link>
          </div>

          <Suspense fallback={<BookmarkListSkeleton />}>
            <BookmarkList />
          </Suspense>
        </div>
      </DashboardShell>
    );
  }

  async function handleSignIn() {
    "use server";
    await signIn("github", { redirectTo: "/" });
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="flex h-[66px] items-center justify-between border-b border-zinc-200/60 bg-white/80 px-8 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="flex items-center gap-2.5">
          <LinkmarkIcon size={28} className="shrink-0" />
          <span className="text-xl font-semibold text-accent">
            Linkmark
          </span>
        </div>
        <form action={handleSignIn}>
          <button
            type="submit"
            className="btn-primary !px-5 !py-2 !text-sm gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
            </svg>
            Sign In
          </button>
        </form>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-56 flex-col border-r border-zinc-200/80 bg-zinc-50/80 p-3 md:flex dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <nav className="flex flex-col gap-0.5">
            {[
              {
                label: "Bookmarks", active: true, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )
              },
              {
                label: "Collections", active: false, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                )
              },
              {
                label: "Analytics", active: false, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                label: "Import / Export", active: false, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )
              },
              {
                label: "Settings", active: false, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
            ].map(({ label, active, icon }) => (
              <span
                key={label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                    ? "bg-accent/10 text-accent"
                    : "text-zinc-500 dark:text-zinc-400"
                  }`}
              >
                {icon}
                {label}
              </span>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Bookmarks
              </h1>
              <span className="w-fit rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                + Add Bookmark
              </span>
            </div>

            {/* Branding */}
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex items-center gap-2">
                <LinkmarkIcon size={28} />
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Linkmark</span>
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Save, organize, and find your bookmarks.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-zinc-200/60 bg-white/80 px-8 py-4 dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">Linkmark</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">Powered by AWS &amp; PostgreSQL</span>
      </footer>
    </div>
  );
}
