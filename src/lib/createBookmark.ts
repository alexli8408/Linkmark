import { prisma } from "@/lib/prisma";
import { fetchMetadata } from "@/lib/fetchMetadata";
import { invokeMetadataFetcher } from "@/lib/invokeLambda";

interface CreateBookmarkParams {
  url: string;
  title?: string;
  note?: string;
  tags?: string[];
  userId: string;
}

export async function createBookmarkWithMetadata({
  url,
  title,
  note,
  tags,
  userId,
}: CreateBookmarkParams) {
  const bookmark = await prisma.bookmark.create({
    data: {
      url,
      title: title ?? null,
      note: note ?? null,
      metadataStatus: "pending",
      userId,
      tags: tags?.length
        ? {
            create: await Promise.all(
              tags.map(async (name) => {
                const tag = await prisma.tag.upsert({
                  where: {
                    name_userId: { name: name.toLowerCase(), userId },
                  },
                  update: {},
                  create: { name: name.toLowerCase(), userId },
                });
                return { tagId: tag.id };
              })
            ),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  // Try async Lambda invocation; fall back to sync fetch if not configured
  const lambdaInvoked = await invokeMetadataFetcher(bookmark.id, url).catch(
    () => false
  );

  if (!lambdaInvoked) {
    // Local dev fallback: fetch metadata synchronously
    const metadata = await fetchMetadata(url);
    const updated = await prisma.bookmark.update({
      where: { id: bookmark.id },
      data: {
        title: title ?? metadata.title,
        description: metadata.description,
        favicon: metadata.favicon,
        previewImage: metadata.previewImage,
        metadataStatus: "complete",
      },
      include: { tags: { include: { tag: true } } },
    });
    return updated;
  }

  return bookmark;
}
