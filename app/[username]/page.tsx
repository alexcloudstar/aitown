"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TownCanvas } from "@/components/TownCanvas";
import { TownStats } from "@/components/TownStats";
import { ShareBar } from "@/components/ShareBar";
import type { TownData, LocalTownMeta } from "@/types";

export default function TownPage() {
  const params = useParams();
  const username = params.username as string;

  const [town, setTown] = useState<TownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [animate, setAnimate] = useState(false);

  const titles = useMemo(() => {
    if (typeof window === "undefined") return new Map<number, string>();
    try {
      const raw = localStorage.getItem(`aitown_owner_${username}`);
      if (!raw) return new Map<number, string>();
      const meta: LocalTownMeta = JSON.parse(raw);
      return new Map(meta.buildings.map((b) => [b.index, b.title]));
    } catch {
      return new Map<number, string>();
    }
  }, [username]);

  useEffect(() => {
    // Check ownership
    try {
      const raw = localStorage.getItem(`aitown_owner_${username}`);
      if (raw) {
        setIsOwner(true);
        // If owner just created, animate
        const justCreated = sessionStorage.getItem(`aitown_animate_${username}`);
        setAnimate(true);
        sessionStorage.removeItem(`aitown_animate_${username}`);
      }
    } catch {}

    // Fetch town data
    fetch(`/api/towns/${username}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setTown(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[color:var(--color-sky-dark)] flex items-center justify-center">
        <p
          className="text-[color:var(--color-amber)] animate-pulse"
          style={{ fontFamily: "var(--font-display)", fontSize: "12px" }}
        >
          Loading town...
        </p>
      </main>
    );
  }

  if (notFound || !town) {
    return (
      <main className="min-h-screen bg-[color:var(--color-sky-dark)] flex items-center justify-center px-6">
        <Card className="pixel-card bg-[color:var(--color-surface)] max-w-md w-full">
          <CardContent className="py-10 text-center space-y-4">
            <p
              className="text-[color:var(--color-amber)]"
              style={{ fontFamily: "var(--font-display)", fontSize: "14px", lineHeight: "2" }}
            >
              Town not found
            </p>
            <p className="text-sm text-muted-foreground">
              Nobody has claimed <span className="text-foreground font-bold">{username}</span> yet.
            </p>
            <Link href="/upload" className="pixel-btn inline-block mt-4">
              Build your town &rarr;
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen bg-[color:var(--color-sky-dark)] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[color:var(--color-surface)] border-b border-[color:var(--border)] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[color:var(--color-amber)]"
            style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
          >
            AI TOWN
          </Link>
          <span className="text-muted-foreground">/</span>
          <span
            className="text-foreground"
            style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
          >
            {username}
          </span>
          {isOwner && (
            <Badge className="bg-[color:var(--color-amber)] text-[color:var(--color-sky-dark)] text-[10px]">
              You
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <TownStats town={town} />
          <ShareBar username={username} />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <TownCanvas
          buildings={town.buildings}
          mode="interactive"
          animate={animate}
          titles={isOwner ? titles : undefined}
        />
      </div>
    </main>
  );
}
