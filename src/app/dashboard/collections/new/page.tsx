"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCollectionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create collection");
      }

      const collection = await res.json();
      router.push(`/dashboard/collections/${collection.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        New Collection
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="label-base">
            Name *
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="e.g. Frontend Resources"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="description" className="label-base">
            Description
          </label>
          <textarea
            id="description"
            rows={2}
            placeholder="What's this collection about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-base"
          />
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
            {loading ? "Creating..." : "Create Collection"}
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
