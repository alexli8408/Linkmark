"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookmarkCard from "./BookmarkCard";
import { BookmarkListSkeleton } from "./Skeleton";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import BulkActionToolbar from "./BulkActionToolbar";
import BulkTagModal from "./BulkTagModal";
import BulkCollectionModal from "./BulkCollectionModal";
import { useToast } from "./Toast";

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
  metadataStatus?: string;
}

export default function BookmarkList() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";
  const tagFilter = searchParams.get("tag") ?? "";
  const searchQuery = searchParams.get("q") ?? "";

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery);
  const searchRef = useRef<HTMLInputElement>(null);

  // Bulk selection state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [showBulkCollectionModal, setShowBulkCollectionModal] = useState(false);

  const shortcuts = useMemo(
    () => ({
      "mod+k": () => searchRef.current?.focus(),
      escape: () => {
        if (selectMode) {
          setSelectMode(false);
          setSelectedIds(new Set());
        }
      },
    }),
    [selectMode]
  );
  useKeyboardShortcuts(shortcuts);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    await fetch("/api/bookmarks/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    setBookmarks((prev) => prev.filter((b) => !selectedIds.has(b.id)));
    toast.success(`Deleted ${ids.length} bookmark${ids.length !== 1 ? "s" : ""}`);
    exitSelectMode();
  }

  async function handleBulkAddTags(tags: string[]) {
    const ids = Array.from(selectedIds);
    await fetch("/api/bookmarks/bulk/tags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, tags }),
    });
    toast.success(`Added tags to ${ids.length} bookmark${ids.length !== 1 ? "s" : ""}`);
    setShowBulkTagModal(false);
    exitSelectMode();
    // Reload to show updated tags
    router.refresh();
  }

  async function handleBulkAddToCollection(collectionId: string) {
    const ids = Array.from(selectedIds);
    await fetch("/api/bookmarks/bulk/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, collectionId }),
    });
    toast.success(`Added ${ids.length} bookmark${ids.length !== 1 ? "s" : ""} to collection`);
    setShowBulkCollectionModal(false);
    exitSelectMode();
  }

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("sort", sort);
      if (tagFilter) params.set("tag", tagFilter);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      const data = await res.json();
      setBookmarks(data);
      setLoading(false);
    }
    load();
  }, [sort, tagFilter, searchQuery]);

  // Poll for pending metadata updates
  useEffect(() => {
    const hasPending = bookmarks.some((b) => b.metadataStatus === "pending");
    if (!hasPending) return;

    const interval = setInterval(async () => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      if (tagFilter) params.set("tag", tagFilter);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      const data = await res.json();
      setBookmarks(data);

      if (!data.some((b: Bookmark) => b.metadataStatus === "pending")) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bookmarks, sort, tagFilter, searchQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: search || null });
  }

  function handleTagClick(tag: string) {
    updateParams({ tag: tagFilter === tag ? null : tag });
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search bookmarks..."
            aria-label="Search bookmarks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateParams({ q: null });
              }}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Active tag filter */}
      {tagFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Filtered by tag:
          </span>
          <span className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {tagFilter}
            <button
              onClick={() => updateParams({ tag: null })}
              aria-label="Clear tag filter"
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              &times;
            </button>
          </span>
        </div>
      )}

      {/* Sort controls + Select toggle */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Sort by:</span>
        {(["newest", "oldest", "title"] as const).map((s) => (
          <button
            key={s}
            onClick={() => updateParams({ sort: s })}
            aria-pressed={sort === s}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              sort === s
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {selectMode && bookmarks.length > 0 && (
            <button
              onClick={() => {
                if (selectedIds.size === bookmarks.length) {
                  setSelectedIds(new Set());
                } else {
                  setSelectedIds(new Set(bookmarks.map((b) => b.id)));
                }
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              {selectedIds.size === bookmarks.length ? "Deselect All" : "Select All"}
            </button>
          )}
          <button
            onClick={() => {
              if (selectMode) exitSelectMode();
              else setSelectMode(true);
            }}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              selectMode
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {selectMode ? "Cancel" : "Select"}
          </button>
        </div>
      </div>

      {/* Bulk action toolbar */}
      {selectMode && selectedIds.size > 0 && (
        <div className="mb-4">
          <BulkActionToolbar
            selectedCount={selectedIds.size}
            onDelete={handleBulkDelete}
            onAddTag={() => setShowBulkTagModal(true)}
            onMoveToCollection={() => setShowBulkCollectionModal(true)}
            onDeselectAll={exitSelectMode}
          />
        </div>
      )}

      {/* Bookmark list */}
      {loading ? (
        <BookmarkListSkeleton />
      ) : bookmarks.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {searchQuery || tagFilter
            ? "No bookmarks match your search."
            : "No bookmarks yet. Add your first bookmark to get started."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              {...bookmark}
              onTagClick={handleTagClick}
              onDelete={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
              selectable={selectMode}
              selected={selectedIds.has(bookmark.id)}
              onSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      <BulkTagModal
        open={showBulkTagModal}
        onConfirm={handleBulkAddTags}
        onCancel={() => setShowBulkTagModal(false)}
      />
      <BulkCollectionModal
        open={showBulkCollectionModal}
        onConfirm={handleBulkAddToCollection}
        onCancel={() => setShowBulkCollectionModal(false)}
      />
    </div>
  );
}
