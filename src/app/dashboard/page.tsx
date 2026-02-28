import { Suspense } from "react";
import Link from "next/link";
import BookmarkList from "@/components/BookmarkList";
import { BookmarkListSkeleton } from "@/components/Skeleton";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Bookmarks
        </h1>
        <Link
          href="/dashboard/new"
          className="btn-primary w-fit gap-1.5"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Bookmark
        </Link>
      </div>

      <Suspense fallback={<BookmarkListSkeleton />}>
        <BookmarkList />
      </Suspense>
    </div>
  );
}
