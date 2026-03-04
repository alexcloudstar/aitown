"use client";

import { toast } from "sonner";

interface ShareBarProps {
  username: string;
}

export function ShareBar({ username }: ShareBarProps) {
  const url = `${typeof window !== "undefined" ? window.location.origin : "https://aitown.so"}/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast("Copied!", {
      description: url,
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="pixel-btn text-[10px] px-4 py-2"
    >
      Share
    </button>
  );
}
