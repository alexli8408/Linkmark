"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";

interface ApiKeyInfo {
  id: string;
  name: string;
  keyHint: string;
  createdAt: string;
}

export default function SettingsPage() {
  const toast = useToast();
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState<string | null>(null);

  async function loadKeys() {
    const res = await fetch("/api/api-keys");
    if (res.ok) {
      setKeys(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function generateKey() {
    const res = await fetch("/api/api-keys", { method: "POST" });
    if (!res.ok) {
      toast.error("Failed to generate key");
      return;
    }
    const data = await res.json();
    setNewKey(data.key);
    toast.success("API key generated");
    loadKeys();
  }

  async function deleteKey(id: string) {
    const res = await fetch(`/api/api-keys?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("API key revoked");
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } else {
      toast.error("Failed to revoke key");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>

      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          API Keys
        </h2>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          Generate API keys for the Chrome extension or other integrations.
        </p>

        <button
          onClick={generateKey}
          className="mb-4 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Generate New Key
        </button>

        {newKey && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
            <p className="mb-1 text-xs font-medium text-green-800 dark:text-green-300">
              Copy this key now — it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded bg-white px-2 py-1 text-xs text-green-900 dark:bg-zinc-900 dark:text-green-300">
                {newKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newKey);
                  toast.success("Copied to clipboard");
                }}
                className="shrink-0 rounded px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No API keys yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {k.name}{" "}
                    <span className="text-zinc-400">({k.keyHint})</span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    Created {new Date(k.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteKey(k.id)}
                  className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
