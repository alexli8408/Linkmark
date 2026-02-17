import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">
        404
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Page not found.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
