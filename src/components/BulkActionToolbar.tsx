"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface BulkActionToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  onAddTag: () => void;
  onMoveToCollection: () => void;
  onDeselectAll: () => void;
}

export default function BulkActionToolbar({
  selectedCount,
  onDelete,
  onAddTag,
  onMoveToCollection,
  onDeselectAll,
}: BulkActionToolbarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-10 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {selectedCount} selected
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={onAddTag}
            aria-label="Add tags to selected bookmarks"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Add Tags
          </button>
          <button
            onClick={onMoveToCollection}
            aria-label="Add selected bookmarks to collection"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Add to Collection
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete selected bookmarks"
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onDeselectAll}
            className="rounded-md px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Cancel
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete bookmarks"
        message={`Are you sure you want to delete ${selectedCount} bookmark${selectedCount !== 1 ? "s" : ""}? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
