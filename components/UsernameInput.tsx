"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { UsernameStatus } from "@/hooks/useUsernameCheck";

interface UsernameInputProps {
  username: string;
  status: UsernameStatus;
  onChange: (value: string) => void;
}

export function UsernameInput({ username, status, onChange }: UsernameInputProps) {
  return (
    <div className="space-y-2">
      <label
        className="text-xs text-[color:var(--color-amber)]"
        style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
      >
        Pick a username
      </label>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0 flex-1">
          <span className="text-muted-foreground text-sm px-3 py-2 bg-[color:var(--color-surface)] border border-r-0 border-[color:var(--border)]">
            aitown.so/
          </span>
          <Input
            value={username}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            placeholder="yourname"
            maxLength={30}
            className="border-l-0 focus-visible:ring-[color:var(--color-amber)]"
          />
        </div>
        <StatusBadge status={status} />
      </div>
      {status === "invalid" && (
        <p className="text-xs text-destructive">
          Letters, numbers, and dashes only. Must start and end with a letter or number.
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: UsernameStatus }) {
  switch (status) {
    case "checking":
      return (
        <Badge variant="outline" className="border-[color:var(--color-amber)] text-[color:var(--color-amber)]">
          <span className="animate-pulse mr-1 inline-block w-2 h-2 rounded-full bg-[color:var(--color-amber)]" />
          Checking
        </Badge>
      );
    case "available":
      return (
        <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/40">
          Available
        </Badge>
      );
    case "taken":
      return (
        <Badge variant="destructive">
          Taken
        </Badge>
      );
    case "invalid":
      return (
        <Badge variant="destructive">
          Invalid
        </Badge>
      );
    default:
      return null;
  }
}
