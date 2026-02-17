interface BookmarkTag {
  tag: { id: string; name: string };
}

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
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = url;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {previewImage && (
        <img src={previewImage} alt="" className="h-32 w-full object-cover" />
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
            className="block truncate text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
          >
            {displayTitle}
          </a>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{hostname}</p>
          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
          {note && (
            <p className="mt-1 line-clamp-2 text-xs italic text-zinc-500 dark:text-zinc-400">
              {note}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-zinc-400">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
