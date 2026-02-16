import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tags — list all tags for the current user (with optional ?q= autocomplete)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.id,
      ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
    },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { bookmarks: true } },
    },
  });

  return NextResponse.json(tags);
}
