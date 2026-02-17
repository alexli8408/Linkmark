import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = new URL(req.url).searchParams.get("format") ?? "json";

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  const exportData = bookmarks.map((b) => ({
    url: b.url,
    title: b.title,
    description: b.description,
    note: b.note,
    tags: b.tags.map((bt) => bt.tag.name),
    createdAt: b.createdAt.toISOString(),
  }));

  if (format === "csv") {
    const escapeField = (val: string | null) => {
      if (val === null) return "";
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const header = "url,title,description,note,tags,createdAt";
    const rows = exportData.map(
      (b) =>
        [
          escapeField(b.url),
          escapeField(b.title),
          escapeField(b.description),
          escapeField(b.note),
          escapeField(b.tags.join(";")),
          escapeField(b.createdAt),
        ].join(",")
    );

    return new NextResponse([header, ...rows].join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="linkmark-export.csv"',
      },
    });
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="linkmark-export.json"',
    },
  });
}
