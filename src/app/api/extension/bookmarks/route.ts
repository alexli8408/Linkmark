import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authApiKey } from "@/lib/authApiKey";
import { fetchMetadata } from "@/lib/fetchMetadata";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/extension/bookmarks?url=... — check if URL is already saved
export async function GET(req: NextRequest) {
  const user = await authApiKey(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "URL required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const bookmark = await prisma.bookmark.findFirst({
    where: { url, userId: user.id },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(
    { exists: !!bookmark, bookmark },
    { headers: corsHeaders }
  );
}

// POST /api/extension/bookmarks — create a bookmark
export async function POST(req: NextRequest) {
  const user = await authApiKey(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  const body = await req.json();
  const { url, title, note, tags } = body as {
    url: string;
    title?: string;
    note?: string;
    tags?: string[];
  };

  if (!url) {
    return NextResponse.json(
      { error: "URL is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  // Check for duplicate
  const existing = await prisma.bookmark.findFirst({
    where: { url, userId: user.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Bookmark already exists", bookmark: existing },
      { status: 409, headers: corsHeaders }
    );
  }

  const metadata = await fetchMetadata(url);
  const finalTitle = title || metadata.title;

  const bookmark = await prisma.bookmark.create({
    data: {
      url,
      title: finalTitle,
      description: metadata.description,
      favicon: metadata.favicon,
      previewImage: metadata.previewImage,
      note: note ?? null,
      userId: user.id,
      tags: tags?.length
        ? {
            create: await Promise.all(
              tags.map(async (name) => {
                const tag = await prisma.tag.upsert({
                  where: {
                    name_userId: { name: name.toLowerCase(), userId: user.id },
                  },
                  update: {},
                  create: { name: name.toLowerCase(), userId: user.id },
                });
                return { tagId: tag.id };
              })
            ),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(bookmark, { status: 201, headers: corsHeaders });
}
