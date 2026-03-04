"use client";

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
  return (
    <section className="w-full py-16">
      <div className="max-w-4xl mx-auto px-6">
        <p
          className="text-[10px] text-[color:var(--color-amber)] mb-6 tracking-widest"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SPONSORS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sponsors.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="pixel-card h-full">
                <CardContent className="py-6 px-6">
                  <p
                    className="text-[color:var(--color-amber)] mb-1"
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
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
