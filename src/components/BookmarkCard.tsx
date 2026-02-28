"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "./Toast";
import ConfirmModal from "./ConfirmModal";
import type { BookmarkTag } from "@/types/bookmark";
import { getHostname } from "@/lib/utils";

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
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const displayTitle = title || url;
  const hostname = getHostname(url);

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
      <div className={`group overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md ${selected
          ? "border-accent/50 bg-accent-light ring-1 ring-accent/20 dark:border-accent/40 dark:bg-accent/5"
          : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
        }`}>
        {selectable && (
          <div className="flex items-center px-4 pt-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(id)}
              className="h-4 w-4 rounded border-zinc-300 accent-accent dark:border-zinc-600"
              aria-label={`Select bookmark: ${title || url}`}
            />
          </div>
        )}
        {/* Preview image */}
        {metadataStatus === "pending" && !previewImage ? (
          <div className="h-36 w-full skeleton-shimmer" />
        ) : previewImage ? (
          <div className="relative">
            <img
              src={previewImage}
              alt=""
              className="h-36 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        ) : null}

        <div className="flex items-start gap-3 p-4">
          {/* Favicon */}
          {metadataStatus === "pending" && !favicon ? (
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded skeleton-shimmer" />
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
              className="block truncate text-sm font-semibold text-zinc-900 transition-colors hover:text-accent dark:text-zinc-50 dark:hover:text-accent"
            >
              {displayTitle}
            </a>
            <p className="mt-0.5 truncate text-xs text-zinc-400">{hostname}</p>
            {description && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            )}
            {note && (
              <p className="mt-1.5 line-clamp-2 text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400">
                {note}
              </p>
            )}
            {tags && tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {tags.map(({ tag }) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onTagClick?.(tag.name)}
                    aria-label={`Filter by tag: ${tag.name}`}
                    className="rounded-md bg-accent-light px-2 py-0.5 text-xs font-medium text-accent transition-colors hover:bg-accent-subtle dark:bg-accent/10 dark:text-accent dark:hover:bg-accent/20"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2.5 text-xs text-zinc-400">
              {new Date(createdAt).toLocaleDateString()}
            </p>
            {metadataStatus === "failed" && (
              <p className="mt-1 text-xs text-zinc-400 italic">
                Metadata unavailable
              </p>
            )}
          </div>

          {/* Actions — always visible on mobile, hover on desktop */}
          <div className="flex shrink-0 gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <Link
              href={`/dashboard/edit/${id}`}
              aria-label="Edit bookmark"
              className="rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              aria-label="Delete bookmark"
              className="rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-950 dark:hover:text-red-400"
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
