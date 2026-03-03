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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Analytics</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl border border-zinc-200/80 skeleton-shimmer dark:border-zinc-800/80" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Analytics</h1>
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
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Analytics</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Bookmarks" value={data.totalBookmarks} />
        <StatCard label="Collections" value={data.totalCollections} />
        <StatCard label="Tags" value={data.totalTags} />
      </div>

      {/* Bookmarks over time chart */}
      {data.bookmarksOverTime.length > 0 && (
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
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
                  <span className="text-[10px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    {d.count}
                  </span>
                  <div
                    className="w-full min-w-[4px] rounded-t-md bg-gradient-to-t from-indigo-500 to-violet-400 transition-all duration-200 hover:from-indigo-400 hover:to-violet-300 dark:from-indigo-600 dark:to-violet-500"
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
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Top Tags
            </h2>
            <div className="space-y-2.5">
              {data.topTags.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2.5">
                  <span className="w-20 truncate text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {tag.name}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-4 rounded-md bg-gradient-to-r from-indigo-400/30 to-violet-400/30 dark:from-indigo-500/20 dark:to-violet-500/20"
                      style={{ width: `${(tag.count / maxTagCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-accent">
                    {tag.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent bookmarks */}
        {data.recentBookmarks.length > 0 && (
          <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Recent Activity
            </h2>
            <div className="space-y-2.5">
              {data.recentBookmarks.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-zinc-700 transition-colors hover:text-accent dark:text-zinc-300 dark:hover:text-accent"
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
    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-accent">{value}</p>
    </div>
  );
}
