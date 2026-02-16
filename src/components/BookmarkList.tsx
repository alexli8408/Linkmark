"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookmarkCard from "./BookmarkCard";

interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  note: string | null;
  createdAt: string;
}

export default function BookmarkList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/bookmarks?sort=${sort}`);
      const data = await res.json();
      setBookmarks(data);
      setLoading(false);
    }
    load();
  }, [sort]);

  function handleSortChange(newSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/dashboard?${params.toString()}`);
  }

  if (loading) {
    return <p className="text-sm text-zinc-400">Loading bookmarks...</p>;
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Sort by:</span>
        {(["newest", "oldest", "title"] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleSortChange(s)}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              sort === s
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookmark list */}
      {bookmarks.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No bookmarks yet. Add your first bookmark to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} {...bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
