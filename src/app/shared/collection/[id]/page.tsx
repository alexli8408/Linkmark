import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicBookmarkCard from "@/components/PublicBookmarkCard";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const collection = await prisma.collection.findFirst({
    where: { id, isPublic: true },
    select: { name: true, description: true },
  });
  if (!collection) return { title: "Not Found" };
  return {
    title: `${collection.name} — Linkmark`,
    description: collection.description ?? "A shared collection on Linkmark",
  };
}

export default async function SharedCollectionPage({ params }: Props) {
  const { id } = await params;
  const collection = await prisma.collection.findFirst({
    where: { id, isPublic: true },
    include: {
      user: { select: { name: true, image: true } },
      bookmarks: {
        include: {
          bookmark: {
            include: { tags: { include: { tag: true } } },
          },
        },
      },
    },
  });

  if (!collection) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {collection.description}
          </p>
        )}
        <p className="mt-1 text-xs text-zinc-400">
          {collection.bookmarks.length} bookmark
          {collection.bookmarks.length !== 1 ? "s" : ""} &middot; by{" "}
          {collection.user.name ?? "Anonymous"}
        </p>

        <div className="mt-8 flex flex-col gap-2">
          {collection.bookmarks.map(({ bookmark }) => (
            <PublicBookmarkCard
              key={bookmark.id}
              url={bookmark.url}
              title={bookmark.title}
              description={bookmark.description}
              favicon={bookmark.favicon}
              previewImage={bookmark.previewImage}
              note={bookmark.note}
              createdAt={bookmark.createdAt.toISOString()}
              tags={bookmark.tags}
            />
          ))}
        </div>

        <footer className="mt-12 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          Shared via{" "}
          <Link href="/" className="underline hover:text-zinc-600">
            Linkmark
          </Link>
        </footer>
      </div>
    </div>
  );
}
