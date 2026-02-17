import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface SearchResult {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
  note: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export async function searchBookmarks(
  userId: string,
  query: string,
  sort: string,
  tagFilter?: string
) {
  const tagJoin = tagFilter
    ? Prisma.sql`AND EXISTS (
        SELECT 1 FROM "BookmarkTag" bt
        JOIN "Tag" t ON t.id = bt."tagId"
        WHERE bt."bookmarkId" = b.id AND t."name" = ${tagFilter}
      )`
    : Prisma.empty;

  const orderClause =
    sort === "oldest"
      ? Prisma.sql`b."createdAt" ASC`
      : sort === "title"
        ? Prisma.sql`b."title" ASC NULLS LAST`
        : Prisma.sql`rank DESC, b."createdAt" DESC`;

  const bookmarks = await prisma.$queryRaw<SearchResult[]>`
    SELECT b.*,
      ts_rank(
        to_tsvector('english',
          coalesce(b."title", '') || ' ' ||
          coalesce(b."description", '') || ' ' ||
          coalesce(b."url", '') || ' ' ||
          coalesce(b."note", '')
        ),
        plainto_tsquery('english', ${query})
      ) AS rank
    FROM "Bookmark" b
    WHERE b."userId" = ${userId}
      AND to_tsvector('english',
        coalesce(b."title", '') || ' ' ||
        coalesce(b."description", '') || ' ' ||
        coalesce(b."url", '') || ' ' ||
        coalesce(b."note", '')
      ) @@ plainto_tsquery('english', ${query})
      ${tagJoin}
    ORDER BY ${orderClause}
  `;

  if (bookmarks.length === 0) return [];

  // Fetch tags for the matched bookmarks
  const ids = bookmarks.map((b) => b.id);
  const bookmarkTags = await prisma.bookmarkTag.findMany({
    where: { bookmarkId: { in: ids } },
    include: { tag: true },
  });

  const tagsByBookmark = new Map<string, typeof bookmarkTags>();
  for (const bt of bookmarkTags) {
    const existing = tagsByBookmark.get(bt.bookmarkId) ?? [];
    existing.push(bt);
    tagsByBookmark.set(bt.bookmarkId, existing);
  }

  return bookmarks.map((b) => ({
    ...b,
    tags: tagsByBookmark.get(b.id) ?? [],
  }));
}
