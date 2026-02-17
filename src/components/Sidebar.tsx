"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Tag {
  id: string;
  name: string;
  _count: { bookmarks: number };
}

const navItems = [
  { href: "/dashboard", label: "All Bookmarks" },
  { href: "/dashboard/collections", label: "Collections" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/import-export", label: "Import / Export" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data);
        }
      } catch {
        // ignore
      }
    }
    loadTags();
  }, []);

  return (
    <aside className="flex h-full w-56 flex-col border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {tags.length > 0 && (
        <div className="mt-6">
          <h3 id="tags-heading" className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Tags
          </h3>
          <nav aria-labelledby="tags-heading" className="flex flex-col gap-0.5">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={
                  activeTag === tag.name
                    ? "/dashboard"
                    : `/dashboard?tag=${encodeURIComponent(tag.name)}`
                }
                onClick={onNavigate}
                className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm ${
                  activeTag === tag.name
                    ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{tag.name}</span>
                <span className="text-xs text-zinc-400">{tag._count.bookmarks}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}
