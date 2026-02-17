import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authApiKey } from "@/lib/authApiKey";
import { createBookmarkWithMetadata } from "@/lib/createBookmark";

function getCorsHeaders(req?: Request) {
  const origin = req?.headers.get("origin") ?? "";
  const allowed =
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("moz-extension://") ||
    origin === (process.env.NEXTAUTH_URL ?? "");

  return {
    "Access-Control-Allow-Origin": allowed ? origin : "",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

// GET /api/extension/bookmarks?url=... — check if URL is already saved
export async function GET(req: NextRequest) {
  const user = await authApiKey(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: getCorsHeaders(req) }
    );
  }

  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "URL required" },
      { status: 400, headers: getCorsHeaders(req) }
    );
  }

  const bookmark = await prisma.bookmark.findFirst({
    where: { url, userId: user.id },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(
    { exists: !!bookmark, bookmark },
    { headers: getCorsHeaders(req) }
  );
}

// POST /api/extension/bookmarks — create a bookmark
export async function POST(req: NextRequest) {
  const user = await authApiKey(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: getCorsHeaders(req) }
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
      { status: 400, headers: getCorsHeaders(req) }
    );
  }

  // Check for duplicate
  const existing = await prisma.bookmark.findFirst({
    where: { url, userId: user.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Bookmark already exists", bookmark: existing },
      { status: 409, headers: getCorsHeaders(req) }
    );
  }

  const bookmark = await createBookmarkWithMetadata({
    url,
    title,
    note,
    tags,
    userId: user.id,
  });

  return NextResponse.json(bookmark, { status: 201, headers: getCorsHeaders(req) });
}
