"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TagInput from "@/components/TagInput";
import { useToast } from "@/components/Toast";
import { FormSkeleton } from "@/components/Skeleton";

export default function EditBookmarkPage() {
  const router = useRouter();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [bookmarkId, setBookmarkId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/bookmarks/${id}`);
      if (!res.ok) {
        setError("Bookmark not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUrl(data.url);
      setTitle(data.title ?? "");
      setNote(data.note ?? "");
      setTags(
        data.tags?.map((bt: { tag: { name: string } }) => bt.tag.name) ?? []
      );
      setIsPublic(data.isPublic ?? false);
      setBookmarkId(data.id);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, note, tags, isPublic }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update bookmark");
      }

      toast.success("Bookmark updated");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Edit Bookmark
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="url" className="label-base">
            URL
          </label>
          <input
            id="url"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="title" className="label-base">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="note" className="label-base">
            Note
          </label>
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">
            Tags
          </label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-zinc-300"
          />
          <span className="text-zinc-700 dark:text-zinc-300">
            Make this bookmark public
          </span>
        </label>

        {isPublic && bookmarkId && (
          <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="truncate text-xs text-zinc-500">
              {typeof window !== "undefined" && window.location.origin}/shared/bookmark/{bookmarkId}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/shared/bookmark/${bookmarkId}`
                );
                toast.success("Link copied");
              }}
              className="shrink-0 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Copy
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
