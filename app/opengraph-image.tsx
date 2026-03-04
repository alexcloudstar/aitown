import { ImageResponse } from "next/og";

export const alt = "AI Town — Your AI conversations, brought to life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const buildings = [
    { h: 120, color: "#4a9eff", x: 80 },
    { h: 180, color: "#ff6b6b", x: 160 },
    { h: 90, color: "#51cf66", x: 240 },
    { h: 220, color: "#ffd700", x: 320 },
    { h: 150, color: "#cc5de8", x: 400 },
    { h: 100, color: "#ff922b", x: 480 },
    { h: 200, color: "#20c997", x: 560 },
    { h: 130, color: "#4a9eff", x: 640 },
    { h: 170, color: "#ff6b6b", x: 720 },
    { h: 110, color: "#ffd700", x: 800 },
    { h: 190, color: "#cc5de8", x: 880 },
    { h: 140, color: "#51cf66", x: 960 },
    { h: 160, color: "#ff922b", x: 1040 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Building silhouettes at bottom */}
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
                width: 60,
                height: b.h,
                backgroundColor: b.color,
                opacity: 0.25,
                borderRadius: "4px 4px 0 0",
              }}
            />
          ))}
          {/* Ground line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              backgroundColor: "#ffd700",
              opacity: 0.3,
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            AI Town
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#ffd700",
              maxWidth: "700px",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Your AI conversations, brought to life
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.5)",
              marginTop: "8px",
            }}
          >
            aitown.so
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
