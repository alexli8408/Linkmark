export interface LinkMetadata {
  title: string | null;
  description: string | null;
  favicon: string | null;
}

export async function fetchMetadata(url: string): Promise<LinkMetadata> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Linkmark/1.0" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return { title: null, description: null, favicon: null };
    }

    const html = await res.text();

    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description =
      extractMeta(html, "description") ??
      extractMeta(html, "og:description");

    const origin = new URL(url).origin;
    const favicon = `${origin}/favicon.ico`;

    return { title: title?.trim() ?? null, description, favicon };
  } catch {
    return { title: null, description: null, favicon: null };
  }
}

function extractTag(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractMeta(html: string, name: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return match[1];

  // Try reversed attribute order
  const regex2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    "i"
  );
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}
