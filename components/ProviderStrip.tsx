"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const providers = [
  { name: "Claude", supported: true },
  { name: "ChatGPT", supported: false },
  { name: "Gemini", supported: false },
  { name: "Grok", supported: false },
];

export function ProviderStrip() {
  return (
    <section className="w-full bg-[color:var(--color-surface)] border-y border-[color:var(--border)] py-10">
      <div className="max-w-4xl mx-auto px-6">
        <p
          className="text-[10px] text-[color:var(--color-amber)] mb-6 tracking-widest"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SUPPORTED PROVIDERS
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {providers.map((p) => (
            <Card
              key={p.name}
              className={`pixel-card ${
                p.supported
                  ? "border-[color:var(--color-amber)]/40 bg-[color:var(--color-amber)]/5"
                  : "opacity-50 grayscale"
              }`}
            >
              <CardContent className="flex flex-col items-center gap-2 py-5">
                <span
                  className={`text-sm font-bold ${
                    p.supported ? "text-[color:var(--color-amber)]" : "text-muted-foreground"
                  }`}
                  style={{ fontFamily: "var(--font-display)", fontSize: "11px" }}
                >
                  {p.name}
                </span>
                <Badge
                  variant={p.supported ? "default" : "secondary"}
                  className={
                    p.supported
                      ? "bg-[color:var(--color-amber)] text-[color:var(--color-sky-dark)]"
                      : ""
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
