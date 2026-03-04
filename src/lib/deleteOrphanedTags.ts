import { prisma } from "@/lib/prisma";

/**
 * Delete all tags owned by a user that have zero bookmark associations.
 * Call this after removing bookmarks or modifying tag associations.
 */
export async function deleteOrphanedTags(userId: string) {
    await prisma.tag.deleteMany({
        where: {
            userId,
            bookmarks: { none: {} },
        },
    });
}
