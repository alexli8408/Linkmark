import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

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
      <nav className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="#18181b" />
            <path
              d="M9 6h14a1 1 0 0 1 1 1v20.2a0.8 0.8 0 0 1-1.2.7L16 24l-6.8 3.9A0.8 0.8 0 0 1 8 27.2V7a1 1 0 0 1 1-1z"
              fill="#fafafa"
            />
          </svg>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Linkmark
          </span>
        </div>
        <form action={handleSignIn}>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign in
          </button>
        </form>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-56 flex-col border-r border-zinc-200 bg-zinc-50 p-4 md:flex dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="flex flex-col gap-1">
            {["All Bookmarks", "Collections", "Analytics", "Import / Export", "Settings"].map(
              (label, i) => (
                <span
                  key={label}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    i === 0
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {label}
                </span>
              )
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              All Bookmarks
            </h1>
            <span className="w-fit rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
              + Add Bookmark
            </span>
          </div>

          {/* Search bar */}
          <div className="mb-4 flex gap-2">
            <div className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
              Search bookmarks...
            </div>
            <span className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              Search
            </span>
          </div>

          {/* Sort controls */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Sort by:
            </span>
            {["Newest", "Oldest", "Title"].map((s, i) => (
              <span
                key={s}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  i === 0
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {s}
              </span>
            ))}
            <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
              Select
            </span>
          </div>

          {/* Sign in CTA */}
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              className="mb-4 opacity-20"
            >
              <rect width="32" height="32" rx="8" fill="#18181b" />
              <path
                d="M9 6h14a1 1 0 0 1 1 1v20.2a0.8 0.8 0 0 1-1.2.7L16 24l-6.8 3.9A0.8 0.8 0 0 1 8 27.2V7a1 1 0 0 1 1-1z"
                fill="#fafafa"
              />
            </svg>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Save, organize, and find your bookmarks.
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to get started.
            </p>
            <form action={handleSignIn}>
              <button
                type="submit"
                className="mt-6 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign in with GitHub
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
