"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { BuildingData } from "@/types";
import type { TownSummary } from "@/lib/r2";
import { SAMPLE_BUILDINGS } from "@/lib/sampleData";
import { TownCanvas } from "@/components/TownCanvas";
import { ProviderStrip } from "@/components/ProviderStrip";
import { SponsorsSection } from "@/components/SponsorsSection";
import { Card, CardContent } from "@/components/ui/card";

/* ─── pixel art SVG icons for each step ─── */
const StepIconExport = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-4">
    <rect x="6" y="4" width="20" height="24" fill="#16162a" stroke="#ffd700" strokeWidth="2"/>
    <rect x="10" y="9" width="12" height="2" fill="#ffd700" opacity="0.5"/>
    <rect x="10" y="13" width="8" height="2" fill="#ffd700" opacity="0.5"/>
    <rect x="10" y="17" width="10" height="2" fill="#ffd700" opacity="0.5"/>
    <path d="M16 21L16 27" stroke="#ffd700" strokeWidth="2"/>
    <path d="M13 24L16 27L19 24" stroke="#ffd700" strokeWidth="2"/>
  </svg>
);

const StepIconUsername = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-4">
    <rect x="2" y="8" width="28" height="16" fill="#16162a" stroke="#ffd700" strokeWidth="2"/>
    <rect x="6" y="14" width="4" height="6" fill="#ffd700"/>
    <rect x="12" y="12" width="4" height="8" fill="#ffd700" opacity="0.7"/>
    <rect x="18" y="14" width="4" height="6" fill="#ffd700" opacity="0.4"/>
    <rect x="25" y="15" width="2" height="4" fill="#ffd700">
      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
    </rect>
  </svg>
);

const StepIconShare = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-4">
    <circle cx="8" cy="16" r="4" fill="#16162a" stroke="#ffd700" strokeWidth="2"/>
    <circle cx="24" cy="8" r="4" fill="#16162a" stroke="#ffd700" strokeWidth="2"/>
    <circle cx="24" cy="24" r="4" fill="#16162a" stroke="#ffd700" strokeWidth="2"/>
    <line x1="12" y1="14" x2="20" y2="10" stroke="#ffd700" strokeWidth="2"/>
    <line x1="12" y1="18" x2="20" y2="22" stroke="#ffd700" strokeWidth="2"/>
  </svg>
);

const steps = [
  {
    num: "01",
    title: "Export from Claude",
    desc: "Go to Settings > Privacy > Export on claude.ai. You'll get a ZIP file with your full history.",
    icon: <StepIconExport />,
  },
  {
    num: "02",
    title: "Pick a username",
    desc: "Claim your unique URL at aitown.so/yourname. First come, first served.",
    icon: <StepIconUsername />,
  },
  {
    num: "03",
    title: "Share your town",
    desc: "Your town is live. Anyone with the link sees it. Buildings, peeps, all of it.",
    icon: <StepIconShare />,
  },
];

/* ─── floating pixel particles config ─── */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  size: `${2 + Math.random() * 3}px`,
  duration: `${8 + Math.random() * 14}s`,
  delay: `${Math.random() * 10}s`,
  drift: `${(Math.random() - 0.5) * 60}px`,
  color: i % 3 === 0 ? "rgba(255,215,0,0.6)" : i % 3 === 1 ? "rgba(124,184,232,0.4)" : "rgba(232,168,124,0.3)",
}));

/* ─── scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${delay ? `scroll-reveal-delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── main page ─── */
export default function LandingPage() {
  const [buildings, setBuildings] = useState<BuildingData[]>(SAMPLE_BUILDINGS);
  const [towns, setTowns] = useState<TownSummary[]>([]);

  useEffect(() => {
    fetch("/api/towns/alexcloudstar")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.buildings?.length) setBuildings(data.buildings);
      })
      .catch(() => {});

    fetch("/api/towns")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setTowns(data);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[color:var(--color-sky-dark)] overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO -full viewport, layered atmosphere
          ══════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden scanlines vignette noise-grain">

        {/* Layer 0: Live canvas */}
        <div className="absolute inset-0 z-0">
          <TownCanvas buildings={buildings} mode="cinematic" />
        </div>

        {/* Layer 1: Dark gradient overlay -heavier at top/bottom, lighter at center */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `
              linear-gradient(180deg,
                rgba(13,13,26,0.85) 0%,
                rgba(13,13,26,0.55) 35%,
                rgba(13,13,26,0.55) 65%,
                rgba(13,13,26,0.85) 100%
              )
            `,
          }}
        />

        {/* Layer 2: Floating pixel particles */}
        <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="pixel-particle"
              style={{
                "--x": p.x,
                "--size": p.size,
                "--duration": p.duration,
                "--delay": p.delay,
                "--drift": p.drift,
                "--particle-color": p.color,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Layer 3: Hero content -staggered entrance */}
        <div className="relative z-[4] flex flex-col items-center justify-center h-full px-6 text-center">

          {/* Eyebrow -glitch effect */}
          <p
            className="hero-entrance hero-entrance-1 glitch-text text-[color:var(--color-amber)] mb-8 tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
            data-text="AI TOWN BETA"
          >
            AI TOWN BETA
          </p>

          {/* Headline -glow shimmer */}
          <h1
            className="hero-entrance hero-entrance-2 headline-glow text-[color:var(--color-amber)] mb-8 max-w-4xl"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 4vw, 36px)",
              lineHeight: "2.2",
              letterSpacing: "0.02em",
            }}
          >
            Your AI conversations,
            <br />
            <span className="text-foreground">brought to life.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-entrance hero-entrance-3 text-muted-foreground text-lg mb-12 max-w-lg leading-relaxed">
            Upload your Claude export and watch it become a{" "}
            <span className="text-foreground font-medium">living pixel art town</span>.
            Every conversation a building. Every message a person.
          </p>

          {/* CTA */}
          <div className="hero-entrance hero-entrance-4">
            <Link href="/upload" className="pixel-btn text-xs">
              Claim your username &rarr;
            </Link>
          </div>

          {/* Trust line */}
          <p className="hero-entrance hero-entrance-5 text-[11px] text-muted-foreground/50 mt-6 tracking-wide">
            Free &middot; No account &middot; Your data never leaves your browser
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 10L12 15L17 10" stroke="rgba(255,215,0,0.5)" strokeWidth="2"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROVIDERS -scroll-triggered
          ══════════════════════════════════════ */}
      <ProviderStrip />

      {/* ══════════════════════════════════════
          HOW IT WORKS -pixel art steps
          ══════════════════════════════════════ */}
      <section className="py-24 grid-bg ambient-wash">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <p
              className="text-[10px] text-[color:var(--color-amber)] mb-4 tracking-[0.3em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              HOW IT WORKS
            </p>
            <p className="text-muted-foreground mb-14 max-w-md">
              Three steps. Under a minute. No account, no credit card, no catch.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i + 1}>
                <Card className="pixel-card bg-[color:var(--color-surface)] h-full relative overflow-hidden group">
                  {/* Step number watermark */}
                  <span
                    className="absolute -top-2 -right-2 text-[color:var(--color-amber)]/[0.04] select-none pointer-events-none"
                    style={{ fontFamily: "var(--font-display)", fontSize: "100px", lineHeight: "1" }}
                  >
                    {step.num}
                  </span>
                  <CardContent className="py-8 px-6 relative">
                    {step.icon}
                    <span
                      className="text-[color:var(--color-amber)]/60 block mb-3"
                      style={{ fontFamily: "var(--font-display)", fontSize: "10px" }}
                    >
                      STEP {step.num}
                    </span>
                    <h3
                      className="text-foreground mb-3"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "11px",
                        lineHeight: "1.8",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Connecting line between steps -desktop only */}
          <div className="hidden md:flex items-center justify-center mt-10 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[color:var(--color-amber)]"
                style={{ opacity: 0.1 + (i / 11) * 0.5 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          EXPLORE TOWNS -browse existing towns
          ══════════════════════════════════════ */}
      {towns.length > 0 && (
        <section className="py-24 grid-bg">
          <div className="max-w-5xl mx-auto px-6">
            <ScrollReveal>
              <p
                className="text-[10px] text-[color:var(--color-amber)] mb-4 tracking-[0.3em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                EXPLORE TOWNS
              </p>
              <p className="text-muted-foreground mb-14 max-w-md">
                Check out towns built by the community. Click any town to explore it.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {towns.map((town, i) => (
                <ScrollReveal key={town.username} delay={Math.min(i + 1, 3)}>
                  <Link href={`/${town.username}`} className="block group">
                    <Card className="pixel-card bg-[color:var(--color-surface)] h-full relative overflow-hidden transition-all duration-200 group-hover:border-[color:var(--color-amber)]/50">
                      <CardContent className="py-6 px-5">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Tiny building icon */}
                          <div className="flex items-end gap-[2px] shrink-0">
                            <div className="w-1.5 h-3 bg-[color:var(--color-amber)]/40" />
                            <div className="w-1.5 h-5 bg-[color:var(--color-amber)]/60" />
                            <div className="w-1.5 h-4 bg-[color:var(--color-amber)]/40" />
                          </div>
                          <h3
                            className="text-foreground group-hover:text-[color:var(--color-amber)] transition-colors truncate"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "11px",
                            }}
                          >
                            {town.username}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{town.totalConversations} conversations</span>
                          <span className="text-muted-foreground/30">|</span>
                          <span>{town.totalMessages.toLocaleString()} msgs</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/40 mt-2">
                          aitown.so/{town.username}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          PRIVACY CALLOUT -builds trust
          ══════════════════════════════════════ */}
      <section className="py-20 border-y border-[color:var(--border)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="inline-block mb-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="16" width="24" height="18" fill="#16162a" stroke="#ffd700" strokeWidth="2"/>
                <path d="M14 16V12C14 8.68629 16.6863 6 20 6C23.3137 6 26 8.68629 26 12V16" stroke="#ffd700" strokeWidth="2"/>
                <rect x="18" y="22" width="4" height="6" fill="#ffd700"/>
              </svg>
            </div>
            <h2
              className="text-[color:var(--color-amber)] mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "14px", lineHeight: "2" }}
            >
              Privacy first. Always.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Your conversation content <span className="text-foreground font-medium">never leaves your browser</span>.
              We only store message counts and dates - no titles, no text, no identifiers.
              Even if our storage is breached, there&apos;s nothing personal in it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SPONSORS
          ══════════════════════════════════════ */}
      <SponsorsSection />

      {/* ══════════════════════════════════════
          FOOTER -enhanced
          ══════════════════════════════════════ */}
      <footer className="border-t border-[color:var(--border)] py-12 grid-bg">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Left -brand */}
            <div className="flex flex-col gap-2">
              <span
                className="text-[color:var(--color-amber)]"
                style={{ fontFamily: "var(--font-display)", fontSize: "12px" }}
              >
                AI Town
              </span>
              <span className="text-xs text-muted-foreground/50">
                Your Claude history, visualized.
              </span>
            </div>

            {/* Center -links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/alexcloudstar/aitown"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-[color:var(--color-amber)] transition-colors"
              >
                GitHub
              </a>
              <span className="text-muted-foreground/30">|</span>
              <Link
                href="/upload"
                className="text-xs text-muted-foreground hover:text-[color:var(--color-amber)] transition-colors"
              >
                Build your town
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <a
                href="https://x.com/alexcloudstar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-[color:var(--color-amber)] transition-colors"
              >
                @alexcloudstar
              </a>
            </div>

            {/* Right -pixel art decoration */}
            <div className="flex items-end gap-1">
              {/* Tiny buildings silhouette */}
              <div className="w-2 h-3 bg-muted-foreground/20" />
              <div className="w-2 h-5 bg-muted-foreground/20" />
              <div className="w-2 h-4 bg-muted-foreground/20" />
              <div className="w-2 h-7 bg-[color:var(--color-amber)]/20" />
              <div className="w-2 h-3 bg-muted-foreground/20" />
              <div className="w-2 h-6 bg-muted-foreground/20" />
              <div className="w-2 h-4 bg-muted-foreground/20" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[color:var(--border)] flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/30">
              No data collected. No cookies. No tracking.
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              Built with pixels and love.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
