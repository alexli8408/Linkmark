import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, collectionId } = (await req.json()) as {
    ids: string[];
    collectionId: string;
  };
  if (!ids?.length || !collectionId) {
    return NextResponse.json({ error: "IDs and collectionId are required" }, { status: 400 });
  }

  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId: session.user.id },
  });
  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }

  const maxPos = await prisma.collectionBookmark.aggregate({
    where: { collectionId },
    _max: { position: true },
  });
  let nextPos = (maxPos._max.position ?? -1) + 1;

  const bookmarks = await prisma.bookmark.findMany({
    where: { id: { in: ids }, userId: session.user.id },
    select: { id: true },
  });

  for (const { id: bookmarkId } of bookmarks) {
    await prisma.collectionBookmark.upsert({
      where: {
        collectionId_bookmarkId: { collectionId, bookmarkId },
      },
      update: {},
      create: { collectionId, bookmarkId, position: nextPos++ },
    });
  }

  return NextResponse.json({ success: true });
}
