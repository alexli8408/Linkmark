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
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>

      <section className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          API Keys
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Generate API keys for the Chrome extension or other integrations.
        </p>

        <button
          onClick={generateKey}
          className="btn-primary mt-4"
        >
          Generate New Key
        </button>

        {newKey && (
          <div className="mt-4 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/50">
            <p className="mb-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Copy this key now — it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded-lg bg-white px-3 py-1.5 text-xs text-emerald-900 dark:bg-zinc-900 dark:text-emerald-300">
                {newKey}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newKey);
                  toast.success("Copied to clipboard");
                }}
                className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <div className="mt-5">
          {loading ? (
            <p className="text-sm text-zinc-400">Loading...</p>
          ) : keys.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No API keys yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200/80 p-4 dark:border-zinc-800/80"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {k.name}{" "}
                      <span className="text-zinc-400">({k.keyHint})</span>
                    </p>
                    <p className="text-xs text-zinc-400">
                      Created {new Date(k.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteKey(k.id)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
