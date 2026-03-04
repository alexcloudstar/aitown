"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const providers = [
  { name: "Claude", supported: true, accent: "#ffd700" },
  { name: "ChatGPT", supported: false, accent: "#888" },
  { name: "Gemini", supported: false, accent: "#888" },
  { name: "Grok", supported: false, accent: "#888" },
];

export function ProviderStrip() {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[color:var(--color-surface)] border-y border-[color:var(--border)] py-12 relative overflow-hidden">
      {/* Subtle ambient glow at the top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,215,0,0.04) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-5xl mx-auto px-6 scroll-reveal">
        <div className="flex items-center gap-3 mb-8">
          <p
            className="text-[10px] text-[color:var(--color-amber)] tracking-[0.3em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            SUPPORTED PROVIDERS
          </p>
          <div className="flex-1 h-px bg-[color:var(--border)]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {providers.map((p, i) => (
            <Card
              key={p.name}
              className={`pixel-card relative overflow-hidden ${
                p.supported
                  ? "provider-active bg-[color:var(--color-amber)]/[0.03]"
                  : "opacity-40"
              }`}
              style={{
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <CardContent className="flex flex-col items-center gap-3 py-6 relative">
                {/* Live dot for supported */}
                {p.supported && (
                  <div className="absolute top-3 right-3 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 relative live-pulse" />
                  </div>
                )}

                <span
                  className={`font-bold ${
                    p.supported ? "text-[color:var(--color-amber)]" : "text-muted-foreground"
                  }`}
                  style={{ fontFamily: "var(--font-display)", fontSize: "12px" }}
                >
                  {p.name}
                </span>

                <Badge
                  variant={p.supported ? "default" : "secondary"}
                  className={
                    p.supported
                      ? "bg-[color:var(--color-amber)] text-[color:var(--color-sky-dark)] font-semibold"
                      : "text-muted-foreground/60"
                  }
                >
                  {p.supported ? "Supported" : "Coming soon"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
