import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/collections/[id] — get a single collection with its bookmarks
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const collection = await prisma.collection.findFirst({
    where: { id, userId: session.user.id },
    include: {
      bookmarks: {
        include: {
          bookmark: {
            include: { tags: { include: { tag: true } } },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!collection) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(collection);
}

// PATCH /api/collections/[id] — update name/description
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.collection.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, description, isPublic } = body as {
    name?: string;
    description?: string;
    isPublic?: boolean;
  };

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() || null }),
      ...(isPublic !== undefined && { isPublic }),
    },
  });

  return NextResponse.json(collection);
}

// DELETE /api/collections/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.collection.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.collection.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
