"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface DashboardShellProps {
  navbar: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({ navbar, children }: DashboardShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const shortcuts = useMemo(
    () => ({
      "mod+n": () => router.push("/dashboard/new"),
      "?": () => setShortcutsOpen((prev) => !prev),
      escape: () => {
        setShortcutsOpen(false);
        setSidebarOpen(false);
      },
    }),
    [router]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Navbar row with hamburger */}
      <div className="sticky top-0 z-20 flex items-center border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-3 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <div className="flex-1">{navbar}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-14 left-0 z-40 w-56 transform transition-transform duration-200 md:relative md:inset-auto md:z-auto md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 md:p-8 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-5xl animate-slide-up">
            {children}
          </div>
        </main>
      </div>

      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
