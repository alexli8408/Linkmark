import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/bookmarks/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const bookmark = await prisma.bookmark.findFirst({
    where: { id, userId: session.user.id },
    include: { tags: { include: { tag: true } } },
  });

  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(bookmark);
}

// PATCH /api/bookmarks/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.bookmark.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { url, title, note } = body as {
    url?: string;
    title?: string;
    note?: string;
  };

  const bookmark = await prisma.bookmark.update({
    where: { id },
    data: {
      ...(url !== undefined && { url }),
      ...(title !== undefined && { title }),
      ...(note !== undefined && { note }),
    },
  });

  return NextResponse.json(bookmark);
}

// DELETE /api/bookmarks/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.bookmark.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.bookmark.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
