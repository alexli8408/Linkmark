import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseBookmarkHtml } from "@/lib/parseBookmarkHtml";

interface ImportItem {
  url: string;
  title?: string | null;
  description?: string | null;
  note?: string | null;
  tags?: string[];
  createdAt?: string | null;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const text = await file.text();
  const fileName = file.name.toLowerCase();
  let items: ImportItem[] = [];

  if (fileName.endsWith(".json")) {
    try {
      items = JSON.parse(text);
      if (!Array.isArray(items)) {
        return NextResponse.json({ error: "JSON must be an array" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else if (fileName.endsWith(".csv")) {
    const lines = text.split("\n").filter((l) => l.trim());
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCsvLine(lines[i]);
      if (fields.length >= 1 && fields[0]) {
        items.push({
          url: fields[0],
          title: fields[1] || null,
          description: fields[2] || null,
          note: fields[3] || null,
          tags: fields[4] ? fields[4].split(";").filter(Boolean) : [],
          createdAt: fields[5] || null,
        });
      }
    }
  } else if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
    const parsed = parseBookmarkHtml(text);
    items = parsed.map((b) => ({
      url: b.url,
      title: b.title,
      note: b.note,
      tags: b.tags,
      createdAt: b.createdAt,
    }));
  } else {
    return NextResponse.json(
      { error: "Unsupported format. Use .json, .csv, or .html" },
      { status: 400 }
    );
  }

  let imported = 0;
  let skipped = 0;

  for (const item of items) {
    if (!item.url) {
      skipped++;
      continue;
    }

    // Skip duplicates
    const existing = await prisma.bookmark.findFirst({
      where: { url: item.url, userId: session.user.id },
    });
    if (existing) {
      skipped++;
      continue;
    }

    // Create bookmark without fetching metadata (keeps import fast)
    const tagConnections = item.tags?.length
      ? {
          create: await Promise.all(
            item.tags.map(async (name) => {
              const tag = await prisma.tag.upsert({
                where: {
                  name_userId: {
                    name: name.toLowerCase(),
                    userId: session.user!.id!,
                  },
                },
                update: {},
                create: {
                  name: name.toLowerCase(),
                  userId: session.user!.id!,
                },
              });
              return { tagId: tag.id };
            })
          ),
        }
      : undefined;

    await prisma.bookmark.create({
      data: {
        url: item.url,
        title: item.title ?? null,
        description: item.description ?? null,
        note: item.note ?? null,
        userId: session.user.id,
        tags: tagConnections,
        ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
      },
    });
    imported++;
  }

  return NextResponse.json({
    imported,
    skipped,
    total: items.length,
  });
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}
