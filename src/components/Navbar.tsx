import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex h-14 items-center justify-between bg-white px-6 dark:bg-zinc-950">
      <Link href="/dashboard" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Linkmark
      </Link>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span className="hidden text-sm text-zinc-600 sm:inline dark:text-zinc-400">
              {session.user.name ?? session.user.email}
            </span>
            {session.user.image && (
              <img
                src={session.user.image}
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
            )}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                aria-label="Sign out"
                className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
