"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BuildingData } from "@/types";
import { SAMPLE_BUILDINGS } from "@/lib/sampleData";
import { TownCanvas } from "@/components/TownCanvas";
import { ProviderStrip } from "@/components/ProviderStrip";
import { SponsorsSection } from "@/components/SponsorsSection";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    num: "01",
    title: "Export from Claude",
    desc: "Go to Settings > Privacy > Export on claude.ai",
  },
  {
    num: "02",
    title: "Pick a username",
    desc: "Claim your spot at aitown.so/yourname",
  },
  {
    num: "03",
    title: "Share your town",
    desc: "Anyone can visit your URL and watch it live",
  },
];

export default function LandingPage() {
  const [buildings, setBuildings] = useState<BuildingData[]>(SAMPLE_BUILDINGS);

  useEffect(() => {
    fetch("/api/towns/alexcloudstar")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.buildings?.length) setBuildings(data.buildings);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[color:var(--color-sky-dark)]">
      {/* Hero — full viewport */}
      <section className="relative h-screen w-full overflow-hidden scanlines">
        {/* Live canvas background */}
        <div className="absolute inset-0 z-0">
          <TownCanvas buildings={buildings} mode="cinematic" />
        </div>

        {/* Dark overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: "rgba(13, 13, 26, 0.72)" }}
        />

        {/* Hero content */}
        <div className="relative z-[3] flex flex-col items-center justify-center h-full px-6 text-center">
          <p
            className="text-[color:var(--color-amber)] mb-6 tracking-widest"
            style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
          >
            AI TOWN BETA
          </p>

          <h1
            className="text-[color:var(--color-amber)] mb-6 leading-relaxed max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(16px, 3.5vw, 32px)",
              lineHeight: "2",
            }}
          >
            Your AI conversations,
            <br />
            brought to life.
          </h1>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl leading-relaxed">
            Upload your Claude history and watch it become a living pixel art
            town. Every conversation a building. Every message a person.
          </p>

          <Link href="/upload" className="pixel-btn text-sm mb-4">
            Claim your username &rarr;
          </Link>

          <p className="text-xs text-muted-foreground/60">
            Free &middot; No account needed &middot; Just your Claude export
          </p>
        </div>
      </section>

      {/* Providers */}
      <ProviderStrip />

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="text-[10px] text-[color:var(--color-amber)] mb-10 tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            HOW IT WORKS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <Card key={step.num} className="pixel-card bg-[color:var(--color-surface)]">
                <CardContent className="py-8 px-6">
                  <span
                    className="text-[color:var(--color-amber)] block mb-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "24px",
                    }}
                  >
                    {step.num}
                  </span>
                  <h3
                    className="text-foreground mb-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "11px",
                      lineHeight: "1.8",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <SponsorsSection />

      {/* Footer */}
      <footer className="border-t border-[color:var(--border)] py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <span
            className="text-[color:var(--color-amber)]"
            style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
          >
            AI Town
          </span>
          <a
            href="https://github.com/alexcloudstar/aitown"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/alexcloudstar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Built by @alexcloudstar
          </a>
        </div>
      </footer>
    </main>
  );
}
