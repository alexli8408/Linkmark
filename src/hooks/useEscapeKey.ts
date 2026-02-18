"use client";

import { useEffect } from "react";

export function useEscapeKey(enabled: boolean, callback: () => void) {
  useEffect(() => {
    if (!enabled) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") callback();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, callback]);
}
