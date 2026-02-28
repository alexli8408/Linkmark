import type { BookmarkTag } from "@/types/bookmark";
import { getHostname } from "@/lib/utils";

interface PublicBookmarkCardProps {
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
  note: string | null;
  createdAt: string;
  tags?: BookmarkTag[];
}

export default function PublicBookmarkCard({
  url,
  title,
  description,
  favicon,
  previewImage,
  note,
  createdAt,
  tags,
}: PublicBookmarkCardProps) {
  const displayTitle = title || url;
  const hostname = getHostname(url);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900">
      {previewImage && (
        <div className="relative">
          <img src={previewImage} alt="" className="h-36 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}
      <div className="flex items-start gap-3 p-4">
        {favicon && (
          <img src={favicon} alt="" className="mt-0.5 h-5 w-5 shrink-0 rounded" />
        )}
        <div className="min-w-0 flex-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm font-semibold text-zinc-900 transition-colors hover:text-accent dark:text-zinc-50 dark:hover:text-accent"
          >
            {displayTitle}
          </a>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{hostname}</p>
          {description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
          {note && (
            <p className="mt-1.5 line-clamp-2 text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400">
              {note}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-md bg-accent-light px-2 py-0.5 text-xs font-medium text-accent dark:bg-accent/10 dark:text-accent"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-xs text-zinc-400">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
