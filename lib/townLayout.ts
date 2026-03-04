import type { BuildingData, ConversationMeta } from "@/types";
import { toMonthString, uuidToColorSeed } from "./parseClaudeExport";

export type BuildingType = "small" | "medium" | "large" | "tower";

export function getBuildingType(messageCount: number): BuildingType {
  if (messageCount <= 10) return "small";
  if (messageCount <= 50) return "medium";
  if (messageCount <= 200) return "large";
  return "tower";
}

export function getBuildingSize(type: BuildingType): { w: number; h: number } {
  switch (type) {
    case "small":
      return { w: 2, h: 2 };
    case "medium":
      return { w: 3, h: 3 };
    case "large":
      return { w: 4, h: 4 };
    case "tower":
      return { w: 3, h: 5 };
  }
}

// Spiral placement: yields positions outward from center
function* spiralPositions(
  centerX: number,
  centerY: number
): Generator<{ x: number; y: number }> {
  yield { x: centerX, y: centerY };
  let layer = 1;
  while (true) {
    // Top edge: left to right
    for (let x = centerX - layer; x <= centerX + layer; x++) {
      yield { x, y: centerY - layer };
    }
    // Right edge: top+1 to bottom
    for (let y = centerY - layer + 1; y <= centerY + layer; y++) {
      yield { x: centerX + layer, y };
    }
    // Bottom edge: right-1 to left
    for (let x = centerX + layer - 1; x >= centerX - layer; x--) {
      yield { x, y: centerY + layer };
    }
    // Left edge: bottom-1 to top+1
    for (let y = centerY + layer - 1; y > centerY - layer; y--) {
      yield { x: centerX - layer, y };
    }
    layer++;
  }
}

export function layoutTown(conversations: ConversationMeta[]): BuildingData[] {
  const gridSize = Math.max(
    60,
    Math.ceil(Math.sqrt(conversations.length)) * 8
  );
  const center = Math.floor(gridSize / 2);
  const occupied = new Set<string>();

  const tileKey = (x: number, y: number) => `${x},${y}`;

  function canPlace(x: number, y: number, w: number, h: number): boolean {
    // Leave 1-tile gap between buildings (for roads)
    for (let dx = -1; dx <= w; dx++) {
      for (let dy = -1; dy <= h; dy++) {
        if (occupied.has(tileKey(x + dx, y + dy))) return false;
      }
    }
    return true;
  }

  function placeBuilding(x: number, y: number, w: number, h: number): void {
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        occupied.add(tileKey(x + dx, y + dy));
      }
    }
  }

  const buildings: BuildingData[] = [];
  const spiral = spiralPositions(center, center);

  for (let i = 0; i < conversations.length; i++) {
    const conv = conversations[i];
    const type = getBuildingType(conv.messageCount);
    const size = getBuildingSize(type);

    // Find next available position via spiral
    const positions = spiralPositions(center, center);
    let placed = false;

    for (let attempt = 0; attempt < 10000; attempt++) {
      const pos = positions.next().value;
      if (!pos) break;

      if (canPlace(pos.x, pos.y, size.w, size.h)) {
        placeBuilding(pos.x, pos.y, size.w, size.h);
        buildings.push({
          index: i + 1,
          messageCount: conv.messageCount,
          humanMessageCount: conv.humanMessageCount,
          assistantMessageCount: conv.assistantMessageCount,
          firstActive: toMonthString(conv.firstMessageAt),
          lastActive: toMonthString(conv.lastMessageAt),
          buildingType: type,
          positionX: pos.x,
          positionY: pos.y,
          colorSeed: uuidToColorSeed(conv.uuid),
        });
        placed = true;
        break;
      }
    }

    if (!placed) {
      // Fallback: place at spiral edge
      const pos = spiral.next().value;
      if (pos) {
        buildings.push({
          index: i + 1,
          messageCount: conv.messageCount,
          humanMessageCount: conv.humanMessageCount,
          assistantMessageCount: conv.assistantMessageCount,
          firstActive: toMonthString(conv.firstMessageAt),
          lastActive: toMonthString(conv.lastMessageAt),
          buildingType: type,
          positionX: pos.x,
          positionY: pos.y,
          colorSeed: uuidToColorSeed(conv.uuid),
        });
      }
    }
  }

  return buildings;
}
