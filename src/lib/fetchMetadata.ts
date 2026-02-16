import { uploadImageToS3 } from "./s3";

export interface LinkMetadata {
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
}

export async function fetchMetadata(url: string): Promise<LinkMetadata> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Linkmark/1.0" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return { title: null, description: null, favicon: null, previewImage: null };
    }

    const html = await res.text();
    const origin = new URL(url).origin;

    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description =
      extractMeta(html, "description") ??
      extractMeta(html, "og:description");

    // Favicon: try <link rel="icon">, then <link rel="shortcut icon">, then /favicon.ico
    const faviconHref =
      extractLinkHref(html, "icon") ??
      extractLinkHref(html, "shortcut icon") ??
      "/favicon.ico";
    const faviconUrl = new URL(faviconHref, origin).href;

    // Preview image: extract og:image
    const ogImage = extractMeta(html, "og:image");
    const previewImageUrl = ogImage ? new URL(ogImage, origin).href : null;

    // Upload to S3 if configured (returns null when S3 is not set up)
    const urlHash = simpleHash(url);
    const s3Favicon = await uploadImageToS3(faviconUrl, `favicons/${urlHash}.ico`);
    const s3Preview = previewImageUrl
      ? await uploadImageToS3(previewImageUrl, `previews/${urlHash}.jpg`)
      : null;

    return {
      title: title?.trim() ?? null,
      description,
      favicon: s3Favicon ?? faviconUrl,
      previewImage: s3Preview ?? previewImageUrl,
    };
  } catch {
    return { title: null, description: null, favicon: null, previewImage: null };
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

  const regex2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    "i"
  );
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}

function extractLinkHref(html: string, rel: string): string | null {
  const regex = new RegExp(
    `<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return match[1];

  const regex2 = new RegExp(
    `<link[^>]*href=["']([^"']*)["'][^>]*rel=["']${rel}["']`,
    "i"
  );
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
