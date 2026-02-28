"use client";

import { useState } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface BulkTagModalProps {
  open: boolean;
  onConfirm: (tags: string[]) => void;
  onCancel: () => void;
}

export default function BulkTagModal({ open, onConfirm, onCancel }: BulkTagModalProps) {
  const [input, setInput] = useState("");

  useEscapeKey(open, onCancel);

  if (!open) return null;

  function handleSubmit() {
    const tags = input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 0) {
      onConfirm(tags);
      setInput("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-xl border border-zinc-200/80 bg-white p-6 shadow-2xl animate-[scaleIn_150ms_ease-out] dark:border-zinc-700/80 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Add Tags
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Enter comma-separated tags to add to selected bookmarks.
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="react, javascript, tutorial"
          autoFocus
          className="input-base mt-3"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Add Tags
          </button>
        </div>
      </div>
    </div>
  );
}
