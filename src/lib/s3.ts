import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 client — conditionally initialized. When credentials are missing,
// all exported functions become no-ops that return null.
const s3Client: S3Client | null =
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.S3_BUCKET_NAME
    ? new S3Client({
        region: process.env.AWS_REGION ?? "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

const BUCKET = process.env.S3_BUCKET_NAME ?? "";

/**
 * Build the public URL for an S3 object.
 * Uses CloudFront if configured, otherwise direct S3.
 */
function getPublicUrl(key: string): string {
  const cfDomain = process.env.CLOUDFRONT_DOMAIN;
  if (cfDomain) {
    return `https://${cfDomain}/${key}`;
  }
  return `https://${BUCKET}.s3.${process.env.AWS_REGION ?? "us-east-1"}.amazonaws.com/${key}`;
}

/**
 * Download an image from a URL and upload it to S3.
 * Returns the public URL (CloudFront or S3) or null on failure / no config.
 */
export async function uploadImageToS3(
  imageUrl: string,
  key: string
): Promise<string | null> {
  if (!s3Client) return null;

  try {
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": "Linkmark/1.0" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/x-icon";
    const arrayBuffer = await response.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // Skip tiny responses (likely error pages, not real images)
    if (body.length < 100) return null;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=2592000", // 30 days
      })
    );

    return getPublicUrl(key);
  } catch {
    return null;
  }
}

/** Returns true if S3 is properly configured. */
export function isS3Configured(): boolean {
  return s3Client !== null;
}
