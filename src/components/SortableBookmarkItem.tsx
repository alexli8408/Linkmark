"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BookmarkCard from "./BookmarkCard";
import type { Bookmark } from "@/types/bookmark";

interface SortableBookmarkItemProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
  onDelete: () => void;
}

export default function SortableBookmarkItem({
  bookmark,
  onRemove,
  onDelete,
}: SortableBookmarkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group/sort relative flex">
      <button
        {...attributes}
        {...listeners}
        className="flex w-8 shrink-0 cursor-grab items-center justify-center text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:hover:text-zinc-300"
        aria-label="Drag to reorder"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>
      <div className="flex-1">
        <BookmarkCard {...bookmark} onDelete={onDelete} />
      </div>
      <button
        onClick={() => onRemove(bookmark.id)}
        aria-label="Remove from collection"
        className="absolute right-12 top-4 rounded p-1 text-zinc-400 opacity-100 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover/sort:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
