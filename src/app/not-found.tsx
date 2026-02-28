import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <h1 className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-7xl font-bold text-transparent">
        404
      </h1>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Page not found.
      </p>
      <Link
        href="/dashboard"
        className="btn-primary mt-8"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
