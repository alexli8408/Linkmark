import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import LinkmarkIcon from "./LinkmarkIcon";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex h-14 items-center justify-between bg-white/80 px-6 backdrop-blur-md dark:bg-zinc-950/80">
      <Link href="/dashboard" className="flex items-center gap-2.5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
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
