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

    // Favicon: try <link rel="icon">, then alternates, then /favicon.ico
    const faviconHref =
      extractLinkHref(html, "icon") ??
      extractLinkHref(html, "shortcut icon") ??
      extractLinkHref(html, "alternate icon") ??
      "/favicon.ico";
    const faviconUrl = new URL(faviconHref, origin).href;

    // Preview image: extract og:image
    const ogImage = extractMeta(html, "og:image");
    const previewImageUrl = ogImage ? new URL(ogImage, origin).href : null;

    // Upload to S3 if configured (returns null when S3 is not set up)
    const urlHash = simpleHash(url);
    const s3Favicon = await uploadImageToS3(faviconUrl, `favicons/${urlHash}.ico`, 16);
    const s3Preview = previewImageUrl
      ? await uploadImageToS3(previewImageUrl, `previews/${urlHash}.jpg`)
      : null;

    return {
      title: title?.trim() ? decodeHtmlEntities(title.trim()) : null,
      description: description ? decodeHtmlEntities(description) : null,
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
  // Match <link> tags whose rel attribute exactly matches (word-boundary check
  // avoids matching "alternate icon" when searching for "icon").
  const tagRegex = new RegExp(
    `<link[^>]*rel=["']${rel}["'][^>]*>`,
    "gi"
  );
  const tagRegex2 = new RegExp(
    `<link[^>]*>`,
    "gi"
  );
  // Strategy: find all <link> tags, filter to those with matching rel, then
  // extract the first standalone href attribute (not data-base-href etc.)
  const hrefFrom = (tag: string): string | null => {
    const m = tag.match(/(?:^|[\s"'])href=["']([^"']*)["']/i);
    return m ? m[1] : null;
  };

  // First pass: tags with rel="<rel>" in any attribute position
  let m;
  while ((m = tagRegex.exec(html)) !== null) {
    const href = hrefFrom(m[0]);
    if (href) return href;
  }

  // Second pass: scan all link tags for rel appearing after href
  while ((m = tagRegex2.exec(html)) !== null) {
    const tag = m[0];
    const relMatch = tag.match(/rel=["']([^"']*)["']/i);
    if (relMatch && relMatch[1].toLowerCase() === rel.toLowerCase()) {
      const href = hrefFrom(tag);
      if (href) return href;
    }
  }

  return null;
}

const NAMED_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&rsquo;": "\u2019",
  "&lsquo;": "\u2018",
  "&rdquo;": "\u201D",
  "&ldquo;": "\u201C",
  "&ndash;": "\u2013",
  "&mdash;": "\u2014",
  "&hellip;": "\u2026",
  "&nbsp;": " ",
};

function decodeHtmlEntities(str: string): string {
  // Decode numeric entities: &#39; &#x27;
  let result = str.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code))
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // Decode named entities
  for (const [entity, char] of Object.entries(NAMED_ENTITIES)) {
    result = result.replaceAll(entity, char);
  }
  return result;
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
