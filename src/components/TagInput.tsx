"use client";

import { useEffect, useRef, useState } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input.length === 0) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tags?q=${encodeURIComponent(input)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        const names: string[] = data.map((t: { name: string }) => t.name);
        setSuggestions(names.filter((n) => !tags.includes(n)));
      } catch {
        // aborted or failed
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input, tags]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setSuggestions([]);
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 shadow-sm transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25 dark:border-zinc-700 dark:bg-zinc-800/50">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-md bg-accent-light px-2 py-0.5 text-xs font-medium text-accent dark:bg-accent/10 dark:text-accent"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className="rounded-full p-0.5 transition-colors hover:bg-accent/20"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="min-w-[80px] flex-1 bg-transparent py-0.5 text-sm text-zinc-900 outline-none placeholder-zinc-400 dark:text-zinc-50 dark:placeholder-zinc-500"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul role="listbox" className="absolute z-10 mt-1.5 max-h-40 w-full overflow-y-auto rounded-xl border border-zinc-200/80 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {suggestions.map((s) => (
            <li key={s} role="option">
              <button
                type="button"
                onClick={() => addTag(s)}
                className="w-full px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-accent-light hover:text-accent dark:text-zinc-300 dark:hover:bg-accent/10 dark:hover:text-accent"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
