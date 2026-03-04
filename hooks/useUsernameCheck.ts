"use client";

import { useState, useEffect, useRef } from "react";

export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/;

export function useUsernameCheck() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!username) {
      setStatus("idle");
      return;
    }

    const normalized = username.toLowerCase();
    if (!USERNAME_REGEX.test(normalized) && normalized.length > 1) {
      setStatus("invalid");
      return;
    }

    if (normalized.length <= 1) {
      setStatus("idle");
      return;
    }

    setStatus("checking");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/towns/${normalized}/exists`);
        const data = await res.json();
        setStatus(data.exists ? "taken" : "available");
      } catch {
        setStatus("available"); // Assume available on error
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [username]);

  return { username, setUsername, status };
}
