import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/collections — list all collections for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collections = await prisma.collection.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookmarks: true } },
    },
  });

  return NextResponse.json(collections);
}

// POST /api/collections — create a new collection
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description } = body as {
    name: string;
    description?: string;
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const collection = await prisma.collection.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(collection, { status: 201 });
}
