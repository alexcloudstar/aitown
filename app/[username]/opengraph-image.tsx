import { ImageResponse } from "next/og";
import { getTown } from "@/lib/r2";

export const alt = "AI Town";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let town;
  try {
    town = await getTown(username);
  } catch {
    town = null;
  }

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
          <div
            style={{
              fontSize: "48px",
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            AI Town
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#ffd700",
              marginTop: "16px",
            }}
          >
            Town not found
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Calculate stats
  const totalBuildings = town.buildings.length;
  const avgMessages = totalBuildings > 0
    ? Math.round(town.totalMessages / totalBuildings)
    : 0;

  // Find date range
  const earliestMonth = town.buildings.reduce(
    (min, b) => (b.firstActive < min ? b.firstActive : min),
    town.buildings[0]?.firstActive ?? ""
  );
  const latestMonth = town.buildings.reduce(
    (max, b) => (b.lastActive > max ? b.lastActive : max),
    town.buildings[0]?.lastActive ?? ""
  );

  const formatMonth = (m: string) => {
    if (!m) return "";
    const [year, month] = m.split("-");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const dateRange =
    earliestMonth && latestMonth
      ? `${formatMonth(earliestMonth)} - ${formatMonth(latestMonth)}`
      : "";

  // Building type counts
  const typeCounts = { small: 0, medium: 0, large: 0, tower: 0 };
  for (const b of town.buildings) {
    typeCounts[b.buildingType] = (typeCounts[b.buildingType] || 0) + 1;
  }

  // Take up to 20 buildings for display
  const displayBuildings = town.buildings.slice(0, 20);
  const buildingWidth = 44;
  const gap = 8;
  const totalWidth = displayBuildings.length * (buildingWidth + gap) - gap;
  const startX = (1200 - totalWidth) / 2;

  const typeHeights: Record<string, number> = {
    small: 60,
    medium: 100,
    large: 140,
    tower: 190,
  };

  const hueToColor = (hue: number) => `hsl(${hue}, 70%, 55%)`;

  // Stats to display
  const stats = [
    { value: town.totalConversations.toString(), label: "Conversations" },
    { value: town.totalMessages.toLocaleString(), label: "Messages" },
    { value: totalBuildings.toString(), label: "Buildings" },
    { value: avgMessages.toString(), label: "Avg msgs/conv" },
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
        {/* Subtle gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, #0a0a18 0%, #0d0d1a 50%, #141428 100%)",
            display: "flex",
          }}
        />

        {/* Stars */}
        {[
          { x: 80, y: 30, s: 3 },
          { x: 200, y: 70, s: 2 },
          { x: 380, y: 25, s: 3 },
          { x: 550, y: 55, s: 2 },
          { x: 750, y: 40, s: 3 },
          { x: 900, y: 65, s: 2 },
          { x: 1050, y: 35, s: 3 },
          { x: 1130, y: 75, s: 2 },
        ].map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          />
        ))}

        {/* Header section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "48px",
            gap: "12px",
            zIndex: 2,
          }}
        >
          {/* aitown.so branding */}
          <div
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
            }}
          >
            aitown.so
          </div>

          {/* Username */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffd700",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            {username}
          </div>

          {/* Date range */}
          {dateRange && (
            <div
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.35)",
                marginTop: "2px",
              }}
            >
              {dateRange}
            </div>
          )}

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "16px",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    color: "#ffffff",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buildings skyline at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {displayBuildings.map((b, i) => {
            const h = typeHeights[b.buildingType] ?? 80;
            const color = hueToColor(b.colorSeed);
            const windowCount = Math.floor(h / 28);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: startX + i * (buildingWidth + gap),
                  width: buildingWidth,
                  height: h,
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
                    backgroundColor: color,
                    opacity: 0.4,
                    display: "flex",
                  }}
                />
                {/* Windows */}
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
                    gap: "6px",
                    paddingTop: "8px",
                  }}
                >
                  {Array.from({ length: windowCount }).map((_, wi) => (
                    <div
                      key={wi}
                      style={{
                        display: "flex",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "7px",
                          height: "7px",
                          backgroundColor:
                            wi % 3 === 0
                              ? "rgba(255,215,0,0.7)"
                              : "rgba(255,255,255,0.25)",
                          borderRadius: "1px",
                        }}
                      />
                      <div
                        style={{
                          width: "7px",
                          height: "7px",
                          backgroundColor:
                            wi % 2 === 0
                              ? "rgba(255,215,0,0.5)"
                              : "rgba(255,255,255,0.15)",
                          borderRadius: "1px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
