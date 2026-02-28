import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import LinkmarkIcon from "./LinkmarkIcon";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex h-[66px] items-center justify-between bg-white/80 px-8 backdrop-blur-md dark:bg-zinc-950/80">
      <Link href="/dashboard" className="flex items-center gap-2.5 text-xl font-semibold text-accent">
        <LinkmarkIcon size={28} className="shrink-0" />
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
              className="btn-primary !px-5 !py-2 !text-sm gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
              Sign In
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
