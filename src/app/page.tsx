import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import LinkmarkIcon from "@/components/LinkmarkIcon";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  async function handleSignIn() {
    "use server";
    await signIn("github", { redirectTo: "/dashboard" });
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="flex h-14 items-center justify-between border-b border-zinc-200/60 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="flex items-center gap-2.5">
          <LinkmarkIcon size={26} className="shrink-0" />
          <span className="text-lg font-semibold text-accent">
            Linkmark
          </span>
        </div>
        <form action={handleSignIn}>
          <button
            type="submit"
            className="btn-primary !py-1.5 !px-3 !text-xs"
          >
            Sign in
          </button>
        </form>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-56 flex-col border-r border-zinc-200/80 bg-zinc-50/80 p-3 md:flex dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <nav className="flex flex-col gap-0.5">
            {[
              {
                label: "All Bookmarks", active: true, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )
              },
              {
                label: "Collections", active: false, icon: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
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
            ].map((item) => (
              <span
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${item.active
                  ? "bg-accent/10 text-accent shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400"
                  }`}
              >
                <span className={item.active ? "text-accent" : "text-zinc-400 dark:text-zinc-500"}>
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 md:p-8 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                All Bookmarks
              </h1>
              <span className="w-fit rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                + Add Bookmark
              </span>
            </div>

            {/* Search bar */}
            <div className="mb-5 flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-400 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500">
                  Search bookmarks...
                </div>
              </div>
              <span className="rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                Search
              </span>
            </div>

            {/* Sort controls */}
            <div className="mb-5 flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Sort by:</span>
              <div className="flex gap-1 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
                {["Newest", "Oldest", "Title"].map((s, i) => (
                  <span
                    key={s}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${i === 0
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400"
                      }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
                Select
              </span>
            </div>

            {/* Sign in CTA */}
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <LinkmarkIcon size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Save, organize, and find your bookmarks.
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to get started.
              </p>
              <form action={handleSignIn}>
                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-[0.97]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign in with GitHub
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
