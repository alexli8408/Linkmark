import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { orderedBookmarkIds } = (await req.json()) as {
    orderedBookmarkIds: string[];
  };

  await prisma.$transaction(
    orderedBookmarkIds.map((bookmarkId, index) =>
      prisma.collectionBookmark.update({
        where: {
          collectionId_bookmarkId: { collectionId: id, bookmarkId },
        },
        data: { position: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
