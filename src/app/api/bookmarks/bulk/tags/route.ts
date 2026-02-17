import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, tags } = (await req.json()) as { ids: string[]; tags: string[] };
  if (!ids?.length || !tags?.length) {
    return NextResponse.json({ error: "IDs and tags are required" }, { status: 400 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { id: { in: ids }, userId: session.user.id },
    select: { id: true },
  });
  const validIds = bookmarks.map((b) => b.id);

  for (const tagName of tags) {
    const tag = await prisma.tag.upsert({
      where: {
        name_userId: { name: tagName.toLowerCase(), userId: session.user.id },
      },
      update: {},
      create: { name: tagName.toLowerCase(), userId: session.user.id },
    });

    for (const bookmarkId of validIds) {
      await prisma.bookmarkTag.upsert({
        where: {
          bookmarkId_tagId: { bookmarkId, tagId: tag.id },
        },
        update: {},
        create: { bookmarkId, tagId: tag.id },
      });
    }
  }

  return NextResponse.json({ updated: validIds.length });
}
