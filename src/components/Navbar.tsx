import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import LinkmarkIcon from "./LinkmarkIcon";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex h-14 items-center justify-between bg-white/80 px-6 backdrop-blur-md dark:bg-zinc-950/80">
      <Link href="/dashboard" className="flex items-center gap-2.5 text-lg font-semibold text-accent">
        <LinkmarkIcon size={26} className="shrink-0" />
        Linkmark
      </Link>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <UserDropdown
            name={session.user.name ?? null}
            email={session.user.email ?? null}
            image={session.user.image ?? null}
          />
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="btn-primary !py-1.5 !px-3 !text-xs gap-1.5"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
