import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 sm:px-12">
        <div className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            className="shrink-0"
          >
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
        <Link
          href="/login"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Save, organize, and find your bookmarks.
        </h1>
        <p className="mt-4 max-w-lg text-base text-zinc-500 sm:text-lg dark:text-zinc-400">
          A modern bookmark manager with tags, collections, and instant search.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Learn more &darr;
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto grid max-w-4xl gap-6 px-6 pb-24 sm:grid-cols-3 sm:px-12"
      >
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <svg
              className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            One-click save
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Save any page instantly with the Chrome extension.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <svg
              className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Tags & Collections
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Organize bookmarks with tags and curated collections.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <svg
              className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Search & Filter
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Find any bookmark in seconds with full-text search.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-6 dark:border-zinc-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            Linkmark
          </span>
          <Link
            href="/privacy"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
