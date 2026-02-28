"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface Tag {
  id: string;
  name: string;
  _count: { bookmarks: number };
}

const navItems = [
  {
    href: "/dashboard",
    label: "Bookmarks",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/collections",
    label: "Collections",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/import-export",
    label: "Import / Export",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard" && !activeTag;
    }
    return pathname.startsWith(href);
  }

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
      } finally {
        setTagsLoading(false);
      }
    }
    loadTags();
  }, []);

  return (
    <aside className="flex h-full w-56 flex-col border-r border-zinc-200/80 bg-zinc-50/80 p-3 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <nav aria-label="Main navigation" className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${isActive(item.href)
              ? "bg-accent/10 text-accent shadow-sm dark:bg-accent/15 dark:text-accent"
              : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
              }`}
          >
            <span className={isActive(item.href) ? "text-accent" : "text-zinc-400 dark:text-zinc-500"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Tags loading skeleton */}
      {tagsLoading && (
        <div className="mt-6">
          <div className="mb-2 px-3">
            <div className="h-3 w-10 rounded skeleton-shimmer" />
          </div>
          <div className="flex flex-col gap-1 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 rounded skeleton-shimmer" />
            ))}
          </div>
        </div>
      )}

      {!tagsLoading && tags.length > 0 && (
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
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all duration-150 ${activeTag === tag.name
                  ? "bg-accent/10 font-medium text-accent dark:bg-accent/15"
                  : "text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-300"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">#</span>
                  {tag.name}
                </span>
                <span className="rounded-full bg-zinc-200/60 px-1.5 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800/60">{tag._count.bookmarks}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}
