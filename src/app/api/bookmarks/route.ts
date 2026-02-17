import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchMetadata } from "@/lib/fetchMetadata";
import { searchBookmarks } from "@/lib/searchBookmarks";

// GET /api/bookmarks — list all bookmarks for the current user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") ?? "newest";
  const search = searchParams.get("q") ?? "";
  const tagFilter = searchParams.get("tag") ?? "";

  // Use full-text search for queries with 2+ characters
  if (search && search.length >= 2) {
    const bookmarks = await searchBookmarks(
      session.user.id,
      search,
      sort,
      tagFilter || undefined
    );
    return NextResponse.json(bookmarks);
  }

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "title"
        ? { title: "asc" as const }
        : { createdAt: "desc" as const };

  const where: Record<string, unknown> = { userId: session.user.id };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { url: { contains: search, mode: "insensitive" } },
      { note: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (tagFilter) {
    where.tags = {
      some: { tag: { name: tagFilter } },
    };
  }

  const bookmarks = await prisma.bookmark.findMany({
    where,
    orderBy,
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(bookmarks);
}

// POST /api/bookmarks — create a new bookmark
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, title, note, tags } = body as {
    url: string;
    title?: string;
    note?: string;
    tags?: string[];
  };

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Always fetch metadata for images; use provided title if given
  const metadata = await fetchMetadata(url);
  const finalTitle = title ?? metadata.title;
  const description = metadata.description;
  const favicon = metadata.favicon;
  const previewImage = metadata.previewImage;

  const bookmark = await prisma.bookmark.create({
    data: {
      url,
      title: finalTitle,
      description,
      favicon,
      previewImage,
      note: note ?? null,
      userId: session.user.id,
      tags: tags?.length
        ? {
            create: await Promise.all(
              tags.map(async (name) => {
                const tag = await prisma.tag.upsert({
                  where: {
                    name_userId: { name: name.toLowerCase(), userId: session.user!.id! },
                  },
                  update: {},
                  create: { name: name.toLowerCase(), userId: session.user!.id! },
                });
                return { tagId: tag.id };
              })
            ),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(bookmark, { status: 201 });
}
