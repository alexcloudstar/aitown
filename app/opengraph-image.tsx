import { ImageResponse } from "next/og";

export const alt = "AI Town — Your AI conversations, brought to life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  // Skyline buildings - varied heights and colors for a vibrant pixel city
  const buildings = [
    { h: 100, w: 50, color: "#3b82f6", x: 40, windows: 3 },
    { h: 160, w: 55, color: "#ef4444", x: 100, windows: 5 },
    { h: 80, w: 45, color: "#22c55e", x: 165, windows: 2 },
    { h: 200, w: 50, color: "#ffd700", x: 220, windows: 7 },
    { h: 130, w: 60, color: "#a855f7", x: 280, windows: 4 },
    { h: 90, w: 45, color: "#f97316", x: 350, windows: 3 },
    { h: 170, w: 55, color: "#06b6d4", x: 405, windows: 6 },
    { h: 110, w: 50, color: "#ec4899", x: 470, windows: 3 },
    { h: 220, w: 55, color: "#ffd700", x: 530, windows: 8 },
    { h: 140, w: 50, color: "#3b82f6", x: 595, windows: 4 },
    { h: 95, w: 45, color: "#22c55e", x: 655, windows: 3 },
    { h: 185, w: 55, color: "#ef4444", x: 710, windows: 6 },
    { h: 120, w: 50, color: "#a855f7", x: 775, windows: 4 },
    { h: 150, w: 60, color: "#06b6d4", x: 835, windows: 5 },
    { h: 75, w: 45, color: "#f97316", x: 905, windows: 2 },
    { h: 195, w: 55, color: "#ec4899", x: 960, windows: 7 },
    { h: 105, w: 50, color: "#3b82f6", x: 1025, windows: 3 },
    { h: 165, w: 55, color: "#ffd700", x: 1085, windows: 5 },
  ];

  // Stars for night sky
  const stars = [
    { x: 100, y: 40, s: 3 },
    { x: 250, y: 80, s: 2 },
    { x: 400, y: 30, s: 4 },
    { x: 550, y: 70, s: 2 },
    { x: 700, y: 45, s: 3 },
    { x: 850, y: 90, s: 2 },
    { x: 1000, y: 55, s: 3 },
    { x: 1100, y: 35, s: 2 },
    { x: 180, y: 110, s: 2 },
    { x: 620, y: 100, s: 2 },
    { x: 950, y: 80, s: 3 },
    { x: 350, y: 60, s: 2 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0d0d1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient sky overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, #0a0a18 0%, #0d0d1a 40%, #141428 100%)",
            display: "flex",
          }}
        />

        {/* Stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          />
        ))}

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            paddingTop: "120px",
            gap: "20px",
          }}
        >
          {/* Logo / Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontSize: "80px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              AI Town
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              color: "#ffd700",
              maxWidth: "700px",
              textAlign: "center",
              lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            Your AI conversations, brought to life
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.45)",
              maxWidth: "600px",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Upload your Claude history and watch it become a living pixel art
            town
          </div>

          {/* URL badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
              padding: "8px 24px",
              borderRadius: "999px",
              border: "1px solid rgba(255,215,0,0.3)",
              backgroundColor: "rgba(255,215,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "#ffd700",
                fontWeight: 600,
              }}
            >
              aitown.so
            </div>
          </div>
        </div>

        {/* Buildings skyline at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "250px",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {buildings.map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: b.x,
                width: b.w,
                height: b.h,
                display: "flex",
                flexDirection: "column",
                borderRadius: "3px 3px 0 0",
                overflow: "hidden",
              }}
            >
              {/* Building body */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: b.color,
                  opacity: 0.35,
                  display: "flex",
                }}
              />
              {/* Window glow overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "8px",
                  paddingTop: "10px",
                }}
              >
                {Array.from({ length: b.windows }).map((_, wi) => (
                  <div
                    key={wi}
                    style={{
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor:
                          wi % 3 === 0
                            ? "rgba(255,215,0,0.7)"
                            : "rgba(255,255,255,0.3)",
                        borderRadius: "1px",
                      }}
                    />
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor:
                          wi % 2 === 0
                            ? "rgba(255,215,0,0.5)"
                            : "rgba(255,255,255,0.2)",
                        borderRadius: "1px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Ground line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              backgroundColor: "#ffd700",
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
