import { Suspense } from "react";
import Link from "next/link";
import BookmarkList from "@/components/BookmarkList";
import { BookmarkListSkeleton } from "@/components/Skeleton";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          All Bookmarks
        </h1>
        <Link
          href="/dashboard/new"
          className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Add Bookmark
        </Link>
      </div>

      <Suspense fallback={<BookmarkListSkeleton />}>
        <BookmarkList />
      </Suspense>
    </div>
  );
}
