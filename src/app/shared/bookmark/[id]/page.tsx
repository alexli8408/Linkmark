import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicBookmarkCard from "@/components/PublicBookmarkCard";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const bookmark = await prisma.bookmark.findFirst({
    where: { id, isPublic: true },
    select: { title: true, url: true, description: true },
  });
  if (!bookmark) return { title: "Not Found" };
  return {
    title: `${bookmark.title ?? bookmark.url} — Linkmark`,
    description: bookmark.description ?? "A shared bookmark on Linkmark",
  };
}

export default async function SharedBookmarkPage({ params }: Props) {
  const { id } = await params;
  const bookmark = await prisma.bookmark.findFirst({
    where: { id, isPublic: true },
    include: {
      user: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!bookmark) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <PublicBookmarkCard
          url={bookmark.url}
          title={bookmark.title}
          description={bookmark.description}
          favicon={bookmark.favicon}
          previewImage={bookmark.previewImage}
          note={bookmark.note}
          createdAt={bookmark.createdAt.toISOString()}
          tags={bookmark.tags}
        />
        <p className="mt-4 text-center text-xs text-zinc-400">
          Shared by {bookmark.user.name ?? "Anonymous"}
        </p>
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
