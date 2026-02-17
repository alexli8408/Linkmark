import { NextRequest } from "next/server";
import { prisma } from "./prisma";

interface ApiKeyUser {
  id: string;
  name: string | null;
  email: string | null;
}

export async function authApiKey(req: NextRequest): Promise<ApiKeyUser | null> {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;

  const key = header.slice(7);
  if (!key) return null;

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return apiKey?.user ?? null;
}
