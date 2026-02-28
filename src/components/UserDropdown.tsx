"use client";

import { useEffect, useRef, useState } from "react";

interface UserDropdownProps {
    name: string | null;
    email: string | null;
    image: string | null;
}

export default function UserDropdown({ name, email, image }: UserDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="group relative rounded-full focus:outline-none"
                aria-label="User menu"
                aria-expanded={open}
            >
                {image ? (
                    <img
                        src={image}
                        alt="User avatar"
                        className="h-9 w-9 rounded-full ring-2 ring-zinc-200 transition-all duration-200 group-hover:ring-[3px] group-hover:ring-accent/50 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] dark:ring-zinc-700 dark:group-hover:ring-accent/50 dark:group-hover:shadow-[0_0_12px_rgba(129,140,248,0.3)]"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent ring-2 ring-zinc-200 transition-all duration-200 group-hover:ring-[3px] group-hover:ring-accent/50 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)] dark:ring-zinc-700 dark:group-hover:ring-accent/50">
                        {(name?.[0] ?? email?.[0] ?? "?").toUpperCase()}
                    </div>
                )}
            </button>

            {/* Dropdown */}
            <div
                className={`absolute right-0 top-full z-50 mt-2 w-64 origin-top-right transition-all duration-200 ${open
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                    }`}
            >
                <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xl dark:border-zinc-700/80 dark:bg-zinc-900">
                    {/* User info */}
                    <div className="border-b border-zinc-100 px-4 py-3.5 dark:border-zinc-800">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {name ?? "User"}
                        </p>
                        {email && (
                            <p className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500">
                                {email}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-1.5">
                        <form
                            action="/api/auth/signout"
                            method="POST"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                // Use next-auth client signout
                                const { signOut } = await import("next-auth/react");
                                await signOut({ callbackUrl: "/" });
                            }}
                        >
                            <button
                                type="submit"
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
