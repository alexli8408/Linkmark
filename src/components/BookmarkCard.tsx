"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "./Toast";
import ConfirmModal from "./ConfirmModal";

interface BookmarkTag {
  tag: { id: string; name: string };
}

interface BookmarkCardProps {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
  note: string | null;
  createdAt: string;
  tags?: BookmarkTag[];
  onTagClick?: (tag: string) => void;
  onDelete?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  metadataStatus?: string;
}

export default function BookmarkCard({
  id,
  url,
  title,
  description,
  favicon,
  previewImage,
  note,
  createdAt,
  tags,
  onTagClick,
  onDelete,
  selectable,
  selected,
  onSelect,
  metadataStatus,
}: BookmarkCardProps) {
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const displayTitle = title || url;
  const hostname = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  async function confirmDelete() {
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      toast.success("Bookmark deleted");
      onDelete?.(id);
    } catch {
      toast.error("Failed to delete bookmark");
      setDeleting(false);
    }
  }

  return (
    <>
      <div className={`group overflow-hidden rounded-lg border transition-colors ${
        selected
          ? "border-zinc-500 bg-zinc-50 dark:border-zinc-500 dark:bg-zinc-800/50"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      }`}>
        {selectable && (
          <div className="flex items-center px-4 pt-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(id)}
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600"
              aria-label={`Select bookmark: ${title || url}`}
            />
          </div>
        )}
        {/* Preview image */}
        {metadataStatus === "pending" && !previewImage ? (
          <div className="h-32 w-full animate-pulse bg-zinc-100 dark:bg-zinc-800" />
        ) : previewImage ? (
          <img
            src={previewImage}
            alt=""
            className="h-32 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}

        <div className="flex items-start gap-3 p-4">
          {/* Favicon */}
          {metadataStatus === "pending" && !favicon ? (
            <div className="mt-0.5 h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          ) : favicon ? (
            <img
              src={favicon}
              alt=""
              className="mt-0.5 h-5 w-5 shrink-0 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

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
                    aria-label={`Filter by tag: ${tag.name}`}
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

          {/* Actions — always visible on mobile, hover on desktop */}
          <div className="flex shrink-0 gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <Link
              href={`/dashboard/edit/${id}`}
              aria-label="Edit bookmark"
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              aria-label="Delete bookmark"
              className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete bookmark"
        message="Are you sure you want to delete this bookmark? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
