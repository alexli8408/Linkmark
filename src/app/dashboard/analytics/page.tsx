"use client";

import { useEffect, useState } from "react";

interface Analytics {
  totalBookmarks: number;
  totalCollections: number;
  totalTags: number;
  topTags: { name: string; count: number }[];
  recentBookmarks: { id: string; title: string | null; url: string; createdAt: string }[];
  bookmarksOverTime: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Unable to load analytics data. Try refreshing the page.
        </p>
      </div>
    );
  }

  const maxBarCount = Math.max(...data.bookmarksOverTime.map((d) => d.count), 1);
  const maxTagCount = Math.max(...data.topTags.map((t) => t.count), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Bookmarks" value={data.totalBookmarks} />
        <StatCard label="Collections" value={data.totalCollections} />
        <StatCard label="Tags" value={data.totalTags} />
      </div>

      {/* Bookmarks over time chart */}
      {data.bookmarksOverTime.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Bookmarks Added (Last 30 Days)
          </h2>
          <div className="flex items-end gap-1" style={{ height: 160 }}>
            {data.bookmarksOverTime.map((d) => {
              const height = (d.count / maxBarCount) * 140;
              const date = new Date(d.date);
              const label = `${date.getMonth() + 1}/${date.getDate()}`;
              return (
                <div key={d.date} className="group flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100">
                    {d.count}
                  </span>
                  <div
                    className="w-full min-w-[4px] rounded-t bg-zinc-600 transition-colors hover:bg-zinc-400 dark:bg-zinc-500 dark:hover:bg-zinc-300"
                    style={{ height: Math.max(height, 2) }}
                  />
                  <span className="text-[9px] text-zinc-400">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top tags */}
        {data.topTags.length > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Top Tags
            </h2>
            <div className="space-y-2">
              {data.topTags.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2">
                  <span className="w-20 truncate text-xs text-zinc-600 dark:text-zinc-400">
                    {tag.name}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"
                      style={{ width: `${(tag.count / maxTagCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent bookmarks */}
        {data.recentBookmarks.length > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Recent Activity
            </h2>
            <div className="space-y-2">
              {data.recentBookmarks.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    {b.title || b.url}
                  </a>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}
