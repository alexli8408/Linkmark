import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "All Bookmarks" },
  { href: "/dashboard/collections", label: "Collections" },
  { href: "/dashboard/tags", label: "Tags" },
];

export default function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
