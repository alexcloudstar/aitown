"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { UsernameInput } from "@/components/UsernameInput";
import { UploadZone } from "@/components/UploadZone";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { parseClaudeZip, toMonthString, uuidToColorSeed } from "@/lib/parseClaudeExport";
import { layoutTown } from "@/lib/townLayout";
import type { ConversationMeta, LocalTownMeta, TownData } from "@/types";

export default function UploadPage() {
  const router = useRouter();
  const { username, setUsername, status } = useUsernameCheck();

  const [step, setStep] = useState<1 | 2>(1);
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [building, setBuilding] = useState(false);

  const canProceedToStep2 = status === "available" && username.length >= 2;

  const handleFile = async (file: File) => {
    setError(null);
    setParsing(true);
    setProgress(20);

    try {
      setProgress(40);
      const convos = await parseClaudeZip(file);
      setProgress(80);

      if (convos.length === 0) {
        throw new Error("No conversations found in this export.");
      }

      setConversations(convos);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse ZIP file.");
    } finally {
      setParsing(false);
    }
  };

  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);

  const earliestDate = conversations.length
    ? new Date(conversations[0].firstMessageAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const handleBuild = async () => {
    setError(null);
    setBuilding(true);

    try {
      // Layout
      const buildings = layoutTown(conversations);

      // Store titles locally
      const localMeta: LocalTownMeta = {
        username,
        buildings: conversations.map((c, i) => ({
          index: i + 1,
          title: c.title,
        })),
      };
      localStorage.setItem(
        `aitown_owner_${username}`,
        JSON.stringify(localMeta)
      );

      // Build server payload (no titles, no UUIDs)
      const townData: TownData = {
        username,
        createdAt: new Date().toISOString(),
        totalConversations: conversations.length,
        totalMessages,
        buildings,
      };

      const res = await fetch(`/api/towns/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(townData),
      });

      if (res.status === 409) {
        setError("Username was just taken — go back and choose another.");
        setStep(1);
        return;
      }

      if (res.status === 429) {
        setError("Too many requests. Please try again later.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create town.");
      }

      router.push(`/${username}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBuilding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[color:var(--color-sky-dark)] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[color:var(--color-amber)] inline-block mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
          >
            AI TOWN
          </Link>
          <h1
            className="text-[color:var(--color-amber)] mb-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              lineHeight: "2",
            }}
          >
            Build your town
          </h1>
          <p className="text-sm text-muted-foreground">
            Two steps. No account needed.
          </p>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Username */}
        <Card className={`pixel-card bg-[color:var(--color-surface)] transition-opacity ${step === 2 ? "opacity-50" : ""}`}>
          <CardContent className="py-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[color:var(--color-amber)]"
                style={{ fontFamily: "var(--font-display)", fontSize: "16px" }}
              >
                01
              </span>
              <span
                className="text-foreground"
                style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
              >
                Pick a username
              </span>
            </div>

            <UsernameInput
              username={username}
              status={status}
              onChange={setUsername}
            />

            {step === 1 && (
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full pixel-btn"
              >
                Continue
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Upload */}
        {step === 2 && (
          <Card className="pixel-card bg-[color:var(--color-surface)]">
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[color:var(--color-amber)]"
                  style={{ fontFamily: "var(--font-display)", fontSize: "16px" }}
                >
                  02
                </span>
                <span
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
                >
                  Upload your export
                </span>
              </div>

              <UploadZone onFile={handleFile} disabled={parsing || building} />

              {parsing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Parsing your conversations...
                  </p>
                </div>
              )}

              {conversations.length > 0 && !parsing && (
                <>
                  <Card className="bg-[color:var(--color-sky-dark)] border-[color:var(--color-amber)]/20">
                    <CardContent className="py-4">
                      <p className="text-sm text-foreground">
                        Found{" "}
                        <span className="text-[color:var(--color-amber)] font-bold">
                          {conversations.length.toLocaleString()}
                        </span>{" "}
                        conversations &middot;{" "}
                        <span className="text-[color:var(--color-amber)] font-bold">
                          {totalMessages.toLocaleString()}
                        </span>{" "}
                        messages
                        {earliestDate && (
                          <>
                            {" "}
                            &middot; Since{" "}
                            <span className="text-[color:var(--color-amber)]">
                              {earliestDate}
                            </span>
                          </>
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleBuild}
                    disabled={building}
                    className="w-full pixel-btn"
                  >
                    {building ? "Building your town..." : "Build my town"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground/60">
          Your conversations never leave your browser.{" "}
          <span className="text-muted-foreground/80">
            Only message counts and dates are stored.
          </span>
        </p>
      </div>
    </main>
  );
}
