"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TagInput from "@/components/TagInput";
import { useToast } from "@/components/Toast";

export default function NewBookmarkPage() {
  const router = useRouter();
  const toast = useToast();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          title: title || undefined,
          note: note || undefined,
          tags: tags.length > 0 ? tags : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create bookmark");
      }

      toast.success("Bookmark saved");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Add Bookmark
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="url" className="label-base">
            URL *
          </label>
          <input
            id="url"
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="title" className="label-base">
            Title{" "}
            <span className="font-normal text-zinc-400">(auto-fetched if empty)</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Page title"
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
            placeholder="Why is this link useful?"
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
          <p className="mt-1 text-xs text-zinc-400">Press Enter or comma to add a tag</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Bookmark"}
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
