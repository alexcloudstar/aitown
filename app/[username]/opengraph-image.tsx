import { ImageResponse } from "next/og";
import { getTown } from "@/lib/r2";

export const alt = "AI Town";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const typeHeights: Record<string, number> = {
  small: 80,
  medium: 130,
  large: 180,
  tower: 240,
};

const hueToColor = (hue: number) => `hsl(${hue}, 70%, 55%)`;

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const town = await getTown(username);

  if (!town) {
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
          }}
        >
          <div style={{ fontSize: "48px", color: "#ffffff", fontWeight: 700 }}>
            AI Town
          </div>
          <div style={{ fontSize: "24px", color: "#ffd700", marginTop: "16px" }}>
            Town not found
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Take up to 15 buildings for display
  const displayBuildings = town.buildings.slice(0, 15);
  const buildingWidth = 60;
  const gap = 16;
  const totalWidth = displayBuildings.length * (buildingWidth + gap) - gap;
  const startX = (1200 - totalWidth) / 2;

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
        {/* Top section with text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "60px",
            gap: "16px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            aitown.so
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#ffd700",
              letterSpacing: "-1px",
            }}
          >
            {username}
          </div>
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div style={{ fontSize: "36px", color: "#ffffff", fontWeight: 700 }}>
                {town.totalConversations}
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
                conversations
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div style={{ fontSize: "36px", color: "#ffffff", fontWeight: 700 }}>
                {town.totalMessages.toLocaleString()}
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
                messages
              </div>
            </div>
          </div>
        </div>

        {/* Buildings at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "280px",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {displayBuildings.map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: startX + i * (buildingWidth + gap),
                width: buildingWidth,
                height: typeHeights[b.buildingType] ?? 100,
                backgroundColor: hueToColor(b.colorSeed),
                borderRadius: "4px 4px 0 0",
                opacity: 0.7,
              }}
            />
          ))}
          {/* Ground */}
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
      </div>
    ),
    { ...size }
  );
}
