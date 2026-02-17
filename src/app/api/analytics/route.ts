import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [totalBookmarks, totalCollections, totalTags, topTags, recentBookmarks, bookmarksOverTime] =
    await Promise.all([
      prisma.bookmark.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.tag.count({ where: { userId } }),
      prisma.tag.findMany({
        where: { userId },
        include: { _count: { select: { bookmarks: true } } },
        orderBy: { bookmarks: { _count: "desc" } },
        take: 10,
      }),
      prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, url: true, createdAt: true },
      }),
      prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT date_trunc('day', "createdAt")::date AS date, COUNT(*)::bigint AS count
        FROM "Bookmark"
        WHERE "userId" = ${userId} AND "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY date
        ORDER BY date ASC
      `,
    ]);

  return NextResponse.json({
    totalBookmarks,
    totalCollections,
    totalTags,
    topTags: topTags.map((t) => ({ name: t.name, count: t._count.bookmarks })),
    recentBookmarks,
    bookmarksOverTime: bookmarksOverTime.map((row) => ({
      date: row.date,
      count: Number(row.count),
    })),
  });
}
