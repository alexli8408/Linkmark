import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Linkmark
        </h1>
        <p className="mb-8 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Save, organize, and share your bookmarks. Tag them, group them into
          collections, and access them from anywhere.
        </p>
        <Link
          href="/login"
          className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
