"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";

export default function ImportExportPage() {
  const toast = useToast();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    total: number;
  } | null>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/bookmarks/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Import failed");
        return;
      }

      const data = await res.json();
      setResult(data);
      toast.success(`Imported ${data.imported} bookmarks`);
      form.reset();
    } catch {
      toast.error("Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Import / Export
      </h1>

      {/* Export */}
      <section className="mb-6 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Export Bookmarks
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Download all your bookmarks as a file.
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="/api/bookmarks/export?format=json"
            className="btn-primary"
          >
            Export JSON
          </a>
          <a
            href="/api/bookmarks/export?format=csv"
            className="btn-secondary"
          >
            Export CSV
          </a>
        </div>
      </section>

      {/* Import */}
      <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Import Bookmarks
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Upload a JSON, CSV, or HTML bookmark export file. Duplicate URLs will
          be skipped.
        </p>
        <form onSubmit={handleImport} className="mt-4 flex flex-col gap-3">
          <input
            type="file"
            name="file"
            accept=".json,.csv,.html,.htm"
            className="text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700 file:transition-colors hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300 dark:hover:file:bg-zinc-700"
          />
          <button
            type="submit"
            disabled={importing}
            className="btn-primary w-fit disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import"}
          </button>
        </form>

        {result && (
          <div className="mt-4 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 text-sm dark:border-zinc-800/80 dark:bg-zinc-800/50">
            <p className="text-zinc-700 dark:text-zinc-300">
              Imported <strong>{result.imported}</strong> bookmarks
              {result.skipped > 0 && (
                <>, skipped <strong>{result.skipped}</strong> duplicates</>
              )}
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
