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
      <div className="sticky top-0 z-10 flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-sm font-semibold text-accent">
          {selectedCount} selected
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={onAddTag}
            aria-label="Add tags to selected bookmarks"
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            Add Tags
          </button>
          <button
            onClick={onMoveToCollection}
            aria-label="Add selected bookmarks to collection"
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            Add to Collection
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete selected bookmarks"
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-[0.97]"
          >
            Delete
          </button>
          <button
            onClick={onDeselectAll}
            className="rounded-lg px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
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
