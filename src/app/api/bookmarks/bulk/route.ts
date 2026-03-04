import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteOrphanedTags } from "@/lib/deleteOrphanedTags";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = (await req.json()) as { ids: string[] };
  if (!ids?.length) {
    return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
  }

  const result = await prisma.bookmark.deleteMany({
    where: { id: { in: ids }, userId: session.user.id },
  });

  // Clean up orphaned tags
  await deleteOrphanedTags(session.user.id);

  return NextResponse.json({ deleted: result.count });
}
