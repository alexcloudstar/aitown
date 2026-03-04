"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const sponsors = [
  {
    name: "makers.page",
    description: "The verified maker directory",
    url: "https://makers.page",
  },
  {
    name: "xpilot.so",
    description: "AI personal brand copilot for founders on X",
    url: "https://xpilot.so",
  },
];

export function SponsorsSection() {
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
    <section className="w-full py-20 grid-bg">
      <div ref={ref} className="max-w-5xl mx-auto px-6 scroll-reveal">
        <div className="flex items-center gap-3 mb-8">
          <p
            className="text-[10px] text-[color:var(--color-amber)] tracking-[0.3em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            SPONSORS
          </p>
          <div className="flex-1 h-px bg-[color:var(--border)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sponsors.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block sponsor-card group"
            >
              <Card className="pixel-card h-full relative overflow-hidden">
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(255,215,0,0.04) 0%, transparent 70%)",
                  }}
                />
                <CardContent className="py-7 px-7 relative flex items-center justify-between">
                  <div>
                    <p
                      className="text-[color:var(--color-amber)] mb-1.5"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "12px",
                      }}
                    >
                      {s.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                  <span className="sponsor-arrow text-muted-foreground/40 group-hover:text-[color:var(--color-amber)] transition-colors text-lg ml-4">
                    &rarr;
                  </span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
