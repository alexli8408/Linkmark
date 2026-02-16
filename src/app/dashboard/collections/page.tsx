"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import { CollectionGridSkeleton } from "@/components/Skeleton";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  _count: { bookmarks: number };
}

export default function CollectionsPage() {
  const toast = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/collections/${id}`, { method: "DELETE" });
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success("Collection deleted");
    } catch {
      toast.error("Failed to delete collection");
    }
    setDeleteTarget(null);
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Collections
          </h1>
        </div>
        <CollectionGridSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Collections
        </h1>
        <Link
          href="/dashboard/collections/new"
          className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No collections yet. Create one to organize your bookmarks.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <Link
                href={`/dashboard/collections/${collection.id}`}
                className="block"
              >
                <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {collection.name}
                </h2>
                {collection.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {collection.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-400">
                  {collection._count.bookmarks} bookmark
                  {collection._count.bookmarks !== 1 ? "s" : ""}
                </p>
              </Link>
              <button
                onClick={() => setDeleteTarget(collection.id)}
                aria-label={`Delete collection ${collection.name}`}
                className="absolute right-2 top-2 rounded p-1 text-zinc-400 opacity-100 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete collection"
        message="Are you sure? Bookmarks inside won't be deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
