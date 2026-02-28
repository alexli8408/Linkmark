function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg skeleton-shimmer ${className ?? ""}`} />
  );
}

function BookmarkCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <Skeleton className="h-36 w-full !rounded-none" />
      <div className="flex items-start gap-3 p-4">
        <Skeleton className="mt-0.5 h-5 w-5 shrink-0 !rounded" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/3" />
          <Skeleton className="mt-2.5 h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-2/3" />
          <div className="mt-3 flex gap-1.5">
            <Skeleton className="h-5 w-14 !rounded-md" />
            <Skeleton className="h-5 w-18 !rounded-md" />
          </div>
          <Skeleton className="mt-2.5 h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function BookmarkListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <BookmarkCardSkeleton key={i} />
      ))}
    </div>
  );
}

function CollectionGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2.5 h-3 w-full" />
          <Skeleton className="mt-3 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="mx-auto max-w-lg">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="flex flex-col gap-5">
        <div>
          <Skeleton className="mb-2 h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-2 h-4 w-12" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, BookmarkCardSkeleton, BookmarkListSkeleton, CollectionGridSkeleton, FormSkeleton };
