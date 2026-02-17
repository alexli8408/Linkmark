"use client";

import { useEffect, useState } from "react";

interface CollectionItem {
  id: string;
  name: string;
}

interface BulkCollectionModalProps {
  open: boolean;
  onConfirm: (collectionId: string) => void;
  onCancel: () => void;
}

export default function BulkCollectionModal({
  open,
  onConfirm,
  onCancel,
}: BulkCollectionModalProps) {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-[fadeIn_150ms_ease-out]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-xl animate-[scaleIn_150ms_ease-out] dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Add to Collection
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choose a collection for the selected bookmarks.
        </p>
        <div className="mt-3 flex max-h-48 flex-col gap-1 overflow-y-auto">
          {loading ? (
            <p className="py-2 text-sm text-zinc-400">Loading...</p>
          ) : collections.length === 0 ? (
            <p className="py-2 text-sm text-zinc-400">No collections yet.</p>
          ) : (
            collections.map((c) => (
              <button
                key={c.id}
                onClick={() => onConfirm(c.id)}
                className="rounded px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {c.name}
              </button>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
