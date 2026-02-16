function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className ?? ""}`} />
  );
}

function BookmarkCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="flex items-start gap-3 p-4">
        <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-1.5 h-3 w-1/3" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-2/3" />
          <div className="mt-3 flex gap-1">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function BookmarkListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <BookmarkCardSkeleton key={i} />
      ))}
    </div>
  );
}

function CollectionGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-full" />
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
      <div className="flex flex-col gap-4">
        <div>
          <Skeleton className="mb-1 h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="mb-1 h-4 w-12" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, BookmarkCardSkeleton, BookmarkListSkeleton, CollectionGridSkeleton, FormSkeleton };
