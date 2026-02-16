"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookmarkTag {
  tag: { id: string; name: string };
}

interface BookmarkCardProps {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  note: string | null;
  createdAt: string;
  tags?: BookmarkTag[];
  onTagClick?: (tag: string) => void;
}

export default function BookmarkCard({
  id,
  url,
  title,
  description,
  favicon,
  note,
  createdAt,
  tags,
  onTagClick,
}: BookmarkCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const displayTitle = title || url;
  const hostname = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  async function handleDelete() {
    if (!confirm("Delete this bookmark?")) return;

    setDeleting(true);
    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* Favicon */}
      {favicon && (
        <img
          src={favicon}
          alt=""
          className="mt-0.5 h-5 w-5 shrink-0 rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
        >
          {displayTitle}
        </a>
        <p className="mt-0.5 truncate text-xs text-zinc-400">{hostname}</p>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
        {note && (
          <p className="mt-1 line-clamp-2 text-xs italic text-zinc-500 dark:text-zinc-400">
            {note}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map(({ tag }) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagClick?.(tag.name)}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-zinc-400">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          href={`/dashboard/edit/${id}`}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
