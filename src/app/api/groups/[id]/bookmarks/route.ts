import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/collections/[id]/bookmarks — add a bookmark to a collection
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify collection ownership
  const collection = await prisma.collection.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  const body = await req.json();
  const { bookmarkId } = body as { bookmarkId: string };

  // Verify bookmark ownership
  const bookmark = await prisma.bookmark.findFirst({
    where: { id: bookmarkId, userId: session.user.id },
  });
  if (!bookmark) {
    return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
  }

  // Check if already in collection
  const existing = await prisma.collectionBookmark.findUnique({
    where: {
      collectionId_bookmarkId: { collectionId: id, bookmarkId },
    },
  });
  if (existing) {
    return NextResponse.json({ error: "Already in collection" }, { status: 409 });
  }

  const maxPos = await prisma.collectionBookmark.aggregate({
    where: { collectionId: id },
    _max: { position: true },
  });
  const nextPosition = (maxPos._max.position ?? -1) + 1;

  await prisma.collectionBookmark.create({
    data: { collectionId: id, bookmarkId, position: nextPosition },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

// DELETE /api/collections/[id]/bookmarks — remove a bookmark from a collection
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const collection = await prisma.collection.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const bookmarkId = searchParams.get("bookmarkId");
  if (!bookmarkId) {
    return NextResponse.json({ error: "bookmarkId is required" }, { status: 400 });
  }

  await prisma.collectionBookmark.deleteMany({
    where: { collectionId: id, bookmarkId },
  });

  return NextResponse.json({ success: true });
}
