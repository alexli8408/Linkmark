import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";
import LinkmarkIcon from "./LinkmarkIcon";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex h-14 items-center justify-between bg-white/80 px-6 backdrop-blur-md dark:bg-zinc-950/80">
      <Link href="/dashboard" className="flex items-center gap-2.5 text-lg font-semibold text-zinc-900 transition-opacity hover:opacity-80 dark:text-zinc-50">
        <LinkmarkIcon size={26} className="shrink-0" />
        Linkmark
      </Link>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span className="hidden text-sm text-zinc-500 sm:inline dark:text-zinc-400">
              {session.user.name ?? session.user.email}
            </span>
            {session.user.image && (
              <img
                src={session.user.image}
                alt="User avatar"
                className="h-8 w-8 rounded-full ring-2 ring-zinc-100 transition-all hover:ring-accent/40 dark:ring-zinc-800 dark:hover:ring-accent/40"
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
                className="btn-secondary !py-1.5 !px-3 !text-xs"
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
              className="btn-primary !py-1.5 !px-3 !text-xs"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
