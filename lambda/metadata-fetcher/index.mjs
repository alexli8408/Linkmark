import pg from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" });
const BUCKET = process.env.S3_BUCKET_NAME;
const CF_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

export async function handler(event) {
  const { bookmarkId, url } = event;

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const metadata = await fetchMetadata(url);

    const urlHash = simpleHash(url);
    const s3Favicon = metadata.faviconUrl
      ? await uploadToS3(metadata.faviconUrl, `favicons/${urlHash}.ico`, 16)
      : null;
    const s3Preview = metadata.previewImageUrl
      ? await uploadToS3(metadata.previewImageUrl, `previews/${urlHash}.jpg`, 100)
      : null;

    await client.query(
      `UPDATE "Bookmark"
       SET "title" = COALESCE($1, "title"),
           "description" = $2,
           "favicon" = $3,
           "previewImage" = $4,
           "metadataStatus" = 'complete',
           "updatedAt" = NOW()
       WHERE "id" = $5`,
      [
        metadata.title,
        metadata.description,
        s3Favicon ?? metadata.faviconUrl,
        s3Preview ?? metadata.previewImageUrl,
        bookmarkId,
      ]
    );

    return { statusCode: 200, body: "OK" };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    await client.query(
      `UPDATE "Bookmark" SET "metadataStatus" = 'failed', "updatedAt" = NOW() WHERE "id" = $1`,
      [bookmarkId]
    );
    throw error;
  } finally {
    await client.end();
  }
}

async function fetchMetadata(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Linkmark/1.0" },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    return { title: null, description: null, faviconUrl: null, previewImageUrl: null };
  }

  const html = await res.text();
  const origin = new URL(url).origin;

  const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    extractMeta(html, "description") ?? extractMeta(html, "og:description");

  const faviconHref =
    extractLinkHref(html, "icon") ??
    extractLinkHref(html, "shortcut icon") ??
    extractLinkHref(html, "alternate icon") ??
    "/favicon.ico";
  const faviconUrl = new URL(faviconHref, origin).href;

  const ogImage = extractMeta(html, "og:image");
  const previewImageUrl = ogImage ? new URL(ogImage, origin).href : null;

  return {
    title: title?.trim() ? decodeHtmlEntities(title.trim()) : null,
    description: description ? decodeHtmlEntities(description) : null,
    faviconUrl,
    previewImageUrl,
  };
}

async function uploadToS3(imageUrl, key, minSize = 100) {
  if (!BUCKET) return null;
  try {
    const res = await fetch(imageUrl, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < minSize) return null;

    const contentType = res.headers.get("content-type") || "image/png";
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=2592000",
      })
    );

    return CF_DOMAIN
      ? `https://${CF_DOMAIN}/${key}`
      : `https://${BUCKET}.s3.amazonaws.com/${key}`;
  } catch {
    return null;
  }
}

function extractTag(html, regex) {
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractMeta(html, name) {
  const r1 = new RegExp(
    `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const m1 = html.match(r1);
  if (m1) return m1[1];

  const r2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    "i"
  );
  const m2 = html.match(r2);
  return m2 ? m2[1] : null;
}

function extractLinkHref(html, rel) {
  const tagRegex = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*>`, "gi");
  const hrefFrom = (tag) => {
    const m = tag.match(/(?:^|[\s"'])href=["']([^"']*)["']/i);
    return m ? m[1] : null;
  };
  let m;
  while ((m = tagRegex.exec(html)) !== null) {
    const href = hrefFrom(m[0]);
    if (href) return href;
  }
  return null;
}

const NAMED_ENTITIES = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  "&rsquo;": "\u2019", "&lsquo;": "\u2018", "&rdquo;": "\u201D",
  "&ldquo;": "\u201C", "&ndash;": "\u2013", "&mdash;": "\u2014",
  "&hellip;": "\u2026", "&nbsp;": " ",
};

function decodeHtmlEntities(str) {
  let result = str.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code))
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  for (const [entity, char] of Object.entries(NAMED_ENTITIES)) {
    result = result.replaceAll(entity, char);
  }
  return result;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
