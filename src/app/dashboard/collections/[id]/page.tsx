"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableBookmarkItem from "@/components/SortableBookmarkItem";
import { useToast } from "@/components/Toast";
import { BookmarkListSkeleton } from "@/components/Skeleton";
import type { Bookmark } from "@/types/bookmark";

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
  const [orderedBookmarks, setOrderedBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);

  // Add bookmark state
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [allBookmarks, setAllBookmarks] = useState<AvailableBookmark[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function loadCollection() {
    const res = await fetch(`/api/collections/${id}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCollection(data);
    setOrderedBookmarks(data.bookmarks.map((b: { bookmark: Bookmark }) => b.bookmark));
    setEditName(data.name);
    setEditDescription(data.description ?? "");
    setEditIsPublic(data.isPublic ?? false);
    setLoading(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedBookmarks.findIndex((b) => b.id === active.id);
    const newIndex = orderedBookmarks.findIndex((b) => b.id === over.id);
    const newOrder = arrayMove(orderedBookmarks, oldIndex, newIndex);
    setOrderedBookmarks(newOrder);

    fetch(`/api/collections/${id}/bookmarks/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedBookmarkIds: newOrder.map((b) => b.id) }),
    }).catch(() => toast.error("Failed to save order"));
  }

  useEffect(() => {
    loadCollection();
  }, [id]);

  async function handleSaveEdit() {
    try {
      await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription, isPublic: editIsPublic }),
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
          <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
          <div className="mt-2 h-4 w-32 rounded-lg skeleton-shimmer" />
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
              className="input-base !text-lg !font-bold"
            />
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="input-base"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editIsPublic}
                onChange={(e) => setEditIsPublic(e.target.checked)}
                className="rounded border-zinc-300 accent-accent"
              />
              <span className="text-zinc-700 dark:text-zinc-300">
                Make this collection public
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="btn-primary"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {collection.description}
                </p>
              )}
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-zinc-400">
                  {collection.bookmarks.length} bookmark
                  {collection.bookmarks.length !== 1 ? "s" : ""}
                </span>
                {collection.isPublic && (
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Public
                  </span>
                )}
              </div>
              {collection.isPublic && (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="truncate text-xs text-zinc-400">
                    {window.location.origin}/shared/collection/{collection.id}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/shared/collection/${collection.id}`
                      );
                      toast.success("Link copied");
                    }}
                    className="shrink-0 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary"
              >
                Edit
              </button>
              <button
                onClick={openAddPicker}
                className="btn-primary gap-1.5"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Bookmark
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add bookmark picker */}
      {showAddPicker && (
        <div className="mb-4 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Select a bookmark to add
            </h3>
            <button
              onClick={() => setShowAddPicker(false)}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
          {allBookmarks.length === 0 ? (
            <p className="text-xs text-zinc-500">
              All your bookmarks are already in this collection.
            </p>
          ) : (
            <div className="flex max-h-48 flex-col gap-0.5 overflow-y-auto">
              {allBookmarks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleAddBookmark(b.id)}
                  className="rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-accent-light hover:text-accent dark:text-zinc-300 dark:hover:bg-accent/10 dark:hover:text-accent"
                >
                  {b.title || b.url}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookmarks in collection */}
      {orderedBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This collection is empty. Add some bookmarks to it.
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedBookmarks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {orderedBookmarks.map((bookmark) => (
                <SortableBookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onRemove={handleRemoveBookmark}
                  onDelete={() => loadCollection()}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
