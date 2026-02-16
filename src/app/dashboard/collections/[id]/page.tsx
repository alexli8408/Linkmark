"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookmarkCard from "@/components/BookmarkCard";
import { useToast } from "@/components/Toast";
import { BookmarkListSkeleton } from "@/components/Skeleton";

interface BookmarkTag {
  tag: { id: string; name: string };
}

interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
  note: string | null;
  createdAt: string;
  tags: BookmarkTag[];
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  bookmarks: { bookmark: Bookmark }[];
}

interface AvailableBookmark {
  id: string;
  title: string | null;
  url: string;
}

export default function CollectionDetailPage() {
  const toast = useToast();
  const { id } = useParams<{ id: string }>();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Add bookmark state
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [allBookmarks, setAllBookmarks] = useState<AvailableBookmark[]>([]);

  async function loadCollection() {
    const res = await fetch(`/api/collections/${id}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCollection(data);
    setEditName(data.name);
    setEditDescription(data.description ?? "");
    setLoading(false);
  }

  useEffect(() => {
    loadCollection();
  }, [id]);

  async function handleSaveEdit() {
    try {
      await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      toast.success("Collection updated");
      setEditing(false);
      loadCollection();
    } catch {
      toast.error("Failed to update collection");
    }
  }

  async function handleAddBookmark(bookmarkId: string) {
    try {
      await fetch(`/api/collections/${id}/bookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarkId }),
      });
      toast.success("Bookmark added to collection");
      setShowAddPicker(false);
      loadCollection();
    } catch {
      toast.error("Failed to add bookmark");
    }
  }

  async function handleRemoveBookmark(bookmarkId: string) {
    try {
      await fetch(`/api/collections/${id}/bookmarks?bookmarkId=${bookmarkId}`, {
        method: "DELETE",
      });
      toast.success("Bookmark removed from collection");
      loadCollection();
    } catch {
      toast.error("Failed to remove bookmark");
    }
  }

  async function openAddPicker() {
    const res = await fetch("/api/bookmarks?sort=newest");
    const data = await res.json();
    const existingIds = new Set(
      collection?.bookmarks.map((b) => b.bookmark.id) ?? []
    );
    setAllBookmarks(data.filter((b: AvailableBookmark) => !existingIds.has(b.id)));
    setShowAddPicker(true);
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <BookmarkListSkeleton />
      </div>
    );
  }

  if (!collection) {
    return <p className="text-sm text-red-500">Collection not found.</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        {editing ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-lg font-semibold text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {collection.description}
                </p>
              )}
              <p className="mt-1 text-xs text-zinc-400">
                {collection.bookmarks.length} bookmark
                {collection.bookmarks.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Edit
              </button>
              <button
                onClick={openAddPicker}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                + Add Bookmark
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add bookmark picker */}
      {showAddPicker && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select a bookmark to add
            </h3>
            <button
              onClick={() => setShowAddPicker(false)}
              className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
          {allBookmarks.length === 0 ? (
            <p className="text-xs text-zinc-500">
              All your bookmarks are already in this collection.
            </p>
          ) : (
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
              {allBookmarks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleAddBookmark(b.id)}
                  className="rounded px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {b.title || b.url}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookmarks in collection */}
      {collection.bookmarks.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This collection is empty. Add some bookmarks to it.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {collection.bookmarks.map(({ bookmark }) => (
            <div key={bookmark.id} className="relative">
              <BookmarkCard {...bookmark} onDelete={() => loadCollection()} />
              <button
                onClick={() => handleRemoveBookmark(bookmark.id)}
                aria-label="Remove from collection"
                className="absolute right-12 top-4 rounded p-1 text-zinc-400 opacity-100 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:hover:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
