import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET /api/api-keys — list all API keys for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      key: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Mask keys — only show last 4 characters
  const masked = keys.map((k) => ({
    id: k.id,
    name: k.name,
    createdAt: k.createdAt.toISOString(),
    keyHint: `...${k.key.slice(-4)}`,
  }));

  return NextResponse.json(masked);
}

// POST /api/api-keys — generate a new API key
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = crypto.randomBytes(32).toString("hex");

  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      userId: session.user.id,
    },
  });

  // Return the full key — this is the only time it's shown
  return NextResponse.json(
    { id: apiKey.id, key, name: apiKey.name, createdAt: apiKey.createdAt.toISOString() },
    { status: 201 }
  );
}

// DELETE /api/api-keys?id=xxx — revoke an API key
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const existing = await prisma.apiKey.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.apiKey.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
