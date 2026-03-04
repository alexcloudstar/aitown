import type { BuildingData } from "@/types";
import { getBuildingSize } from "./townLayout";
import { type Peep, drawPeep } from "./peepAI";

const TILE = 16;

// Color palette
const COLORS = {
  sky: "#0d0d1a",
  road: "#2a2a3a",
  roadDash: "#3a3a4a",
  grass: "#1a3a1a",
  treeTrunk: "#5c3d1e",
  treeLeaves: "#2d7a2d",
  windowLit: "#ffd700",
  windowDark: "#1a1a2a",
  door: "#3d1a00",
  lampPost: "#888888",
  lampGlow: "rgba(255, 220, 100, 0.3)",
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export interface RenderState {
  buildings: BuildingData[];
  peeps: Peep[];
  cameraX: number;
  cameraY: number;
  zoom: number;
  visibleBuildingCount: number; // For animation: how many buildings to show
  time: number; // Frame counter
  selectedBuilding: BuildingData | null;
  gridSize: number;
}

export function createInitialRenderState(
  buildings: BuildingData[]
): RenderState {
  // Calculate grid bounds from buildings
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const b of buildings) {
    const size = getBuildingSize(b.buildingType);
    minX = Math.min(minX, b.positionX);
    minY = Math.min(minY, b.positionY);
    maxX = Math.max(maxX, b.positionX + size.w);
    maxY = Math.max(maxY, b.positionY + size.h);
  }

  const gridSize = Math.max(maxX - minX + 20, maxY - minY + 20, 40);
  const centerX = ((minX + maxX) / 2) * TILE;
  const centerY = ((minY + maxY) / 2) * TILE;

  return {
    buildings,
    peeps: [],
    cameraX: centerX,
    cameraY: centerY,
    zoom: 2,
    visibleBuildingCount: buildings.length,
    time: 0,
    selectedBuilding: null,
    gridSize,
  };
}

export function getTownBounds(buildings: BuildingData[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  centerX: number;
  centerY: number;
} {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const b of buildings) {
    const size = getBuildingSize(b.buildingType);
    minX = Math.min(minX, b.positionX);
    minY = Math.min(minY, b.positionY);
    maxX = Math.max(maxX, b.positionX + size.w);
    maxY = Math.max(maxY, b.positionY + size.h);
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    centerX: ((minX + maxX) / 2) * TILE,
    centerY: ((minY + maxY) / 2) * TILE,
  };
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { cameraX, cameraY, zoom, buildings, peeps, time } = state;

  // Clear
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Calculate visible tile range
  const startTileX = Math.floor(cameraX / TILE - canvasWidth / (2 * TILE * zoom)) - 2;
  const endTileX = Math.ceil(cameraX / TILE + canvasWidth / (2 * TILE * zoom)) + 2;
  const startTileY = Math.floor(cameraY / TILE - canvasHeight / (2 * TILE * zoom)) - 2;
  const endTileY = Math.ceil(cameraY / TILE + canvasHeight / (2 * TILE * zoom)) + 2;

  const offsetX = canvasWidth / 2;
  const offsetY = canvasHeight / 2;

  // Build occupied set
  const occupiedTiles = new Set<string>();
  const visibleBuildings = buildings.slice(0, state.visibleBuildingCount);
  for (const b of visibleBuildings) {
    const size = getBuildingSize(b.buildingType);
    for (let dx = 0; dx < size.w; dx++) {
      for (let dy = 0; dy < size.h; dy++) {
        occupiedTiles.add(`${b.positionX + dx},${b.positionY + dy}`);
      }
    }
  }

  // Road tiles: tiles adjacent to buildings that aren't buildings
  const roadTiles = new Set<string>();
  for (const b of visibleBuildings) {
    const size = getBuildingSize(b.buildingType);
    for (let dx = -1; dx <= size.w; dx++) {
      for (let dy = -1; dy <= size.h; dy++) {
        const key = `${b.positionX + dx},${b.positionY + dy}`;
        if (!occupiedTiles.has(key)) {
          roadTiles.add(key);
        }
      }
    }
  }

  // Draw ground tiles
  for (let tx = startTileX; tx <= endTileX; tx++) {
    for (let ty = startTileY; ty <= endTileY; ty++) {
      const sx = (tx * TILE - cameraX) * zoom + offsetX;
      const sy = (ty * TILE - cameraY) * zoom + offsetY;
      const sw = TILE * zoom;
      const sh = TILE * zoom;

      const key = `${tx},${ty}`;
      if (occupiedTiles.has(key)) continue; // Building drawn later

      if (roadTiles.has(key)) {
        ctx.fillStyle = COLORS.road;
        ctx.fillRect(sx, sy, sw + 1, sh + 1);

        // Road dashes
        if ((tx + ty) % 3 === 0) {
          ctx.fillStyle = COLORS.roadDash;
          ctx.fillRect(sx + sw * 0.4, sy + sh * 0.4, sw * 0.2, sh * 0.2);
        }
      } else {
        // Grass
        ctx.fillStyle = COLORS.grass;
        ctx.fillRect(sx, sy, sw + 1, sh + 1);

        // Grass variation
        const rng = seededRandom(tx * 1000 + ty);
        if (rng() > 0.8) {
          ctx.fillStyle = "#1e4e1e";
          ctx.fillRect(
            sx + rng() * sw * 0.6,
            sy + rng() * sh * 0.6,
            sw * 0.15,
            sh * 0.15
          );
        }
      }
    }
  }

  // Draw trees on grass (deterministic)
  for (let tx = startTileX; tx <= endTileX; tx++) {
    for (let ty = startTileY; ty <= endTileY; ty++) {
      const key = `${tx},${ty}`;
      if (occupiedTiles.has(key) || roadTiles.has(key)) continue;

      const rng = seededRandom(tx * 7919 + ty * 104729);
      if (rng() > 0.92) {
        const sx = (tx * TILE - cameraX) * zoom + offsetX;
        const sy = (ty * TILE - cameraY) * zoom + offsetY;
        const sw = TILE * zoom;

        // Trunk
        ctx.fillStyle = COLORS.treeTrunk;
        ctx.fillRect(
          sx + sw * 0.35,
          sy + sw * 0.4,
          sw * 0.3,
          sw * 0.6
        );

        // Leaves (circle approximation with rects)
        ctx.fillStyle = COLORS.treeLeaves;
        ctx.fillRect(sx + sw * 0.1, sy, sw * 0.8, sw * 0.5);
        ctx.fillRect(sx + sw * 0.2, sy - sw * 0.2, sw * 0.6, sw * 0.3);
      }
    }
  }

  // Draw street lamps on road tiles
  for (let tx = startTileX; tx <= endTileX; tx++) {
    for (let ty = startTileY; ty <= endTileY; ty++) {
      const key = `${tx},${ty}`;
      if (!roadTiles.has(key)) continue;

      const rng = seededRandom(tx * 3571 + ty * 7727);
      if (rng() > 0.95) {
        const sx = (tx * TILE - cameraX) * zoom + offsetX;
        const sy = (ty * TILE - cameraY) * zoom + offsetY;
        const sw = TILE * zoom;

        // Post
        ctx.fillStyle = COLORS.lampPost;
        ctx.fillRect(sx + sw * 0.45, sy + sw * 0.2, sw * 0.1, sw * 0.8);

        // Lamp head
        ctx.fillStyle = COLORS.windowLit;
        ctx.fillRect(sx + sw * 0.35, sy + sw * 0.1, sw * 0.3, sw * 0.15);

        // Glow
        const gradient = ctx.createRadialGradient(
          sx + sw * 0.5,
          sy + sw * 0.15,
          0,
          sx + sw * 0.5,
          sy + sw * 0.15,
          sw * 1.5
        );
        gradient.addColorStop(0, "rgba(255, 220, 100, 0.2)");
        gradient.addColorStop(1, "rgba(255, 220, 100, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(
          sx - sw * 0.5,
          sy - sw * 0.5,
          sw * 2,
          sw * 2
        );
      }
    }
  }

  // Draw buildings
  for (let i = 0; i < state.visibleBuildingCount && i < buildings.length; i++) {
    const b = buildings[i];
    drawBuilding(ctx, b, cameraX, cameraY, zoom, offsetX, offsetY, time, state);
  }

  // Draw peeps
  for (const peep of peeps) {
    drawPeep(ctx, peep, cameraX, cameraY, zoom, offsetX, offsetY);
  }
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  b: BuildingData,
  cameraX: number,
  cameraY: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
  time: number,
  state: RenderState
): void {
  const size = getBuildingSize(b.buildingType);
  const sx = (b.positionX * TILE - cameraX) * zoom + offsetX;
  const sy = (b.positionY * TILE - cameraY) * zoom + offsetY;
  const sw = size.w * TILE * zoom;
  const sh = size.h * TILE * zoom;

  // Animation scale (for generation animation)
  const animIndex = b.index - 1;
  const animProgress = Math.min(
    1,
    Math.max(0, (state.visibleBuildingCount - animIndex) * 0.3)
  );
  if (animProgress <= 0) return;

  const scale = bounceEase(animProgress);
  const scaledW = sw * scale;
  const scaledH = sh * scale;
  const scaledX = sx + (sw - scaledW) / 2;
  const scaledY = sy + (sh - scaledH);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(
    scaledX + 2 * zoom,
    scaledY + 2 * zoom,
    scaledW,
    scaledH
  );

  // Walls
  const hue = b.colorSeed;
  ctx.fillStyle = `hsl(${hue}, 55%, 35%)`;
  ctx.fillRect(scaledX, scaledY, scaledW, scaledH);

  // Roof (top 20%)
  ctx.fillStyle = `hsl(${hue}, 55%, 25%)`;
  const roofH = scaledH * 0.15;
  ctx.fillRect(scaledX - zoom, scaledY - zoom, scaledW + 2 * zoom, roofH + zoom);

  // Roof peak for towers
  if (b.buildingType === "tower") {
    ctx.fillStyle = `hsl(${hue}, 55%, 20%)`;
    const peakW = scaledW * 0.4;
    ctx.fillRect(
      scaledX + (scaledW - peakW) / 2,
      scaledY - roofH - zoom * 2,
      peakW,
      roofH
    );
  }

  // Windows
  const windowSize = 3 * zoom;
  const windowPadding = 4 * zoom;
  const wallStartY = scaledY + roofH + windowPadding;
  const wallEndY = scaledY + scaledH - windowPadding * 2;
  const wallStartX = scaledX + windowPadding;
  const wallEndX = scaledX + scaledW - windowPadding;

  const cols = Math.max(1, Math.floor((wallEndX - wallStartX) / (windowSize + windowPadding)));
  const rows = Math.max(
    1,
    Math.floor((wallEndY - wallStartY) / (windowSize + windowPadding))
  );

  const rng = seededRandom(b.colorSeed);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const wx =
        wallStartX +
        col * ((wallEndX - wallStartX) / cols) +
        ((wallEndX - wallStartX) / cols - windowSize) / 2;
      const wy =
        wallStartY +
        row * ((wallEndY - wallStartY) / rows) +
        ((wallEndY - wallStartY) / rows - windowSize) / 2;

      // Flicker
      const flickerSeed = rng();
      const isLit =
        flickerSeed > 0.3 ||
        Math.sin(time * 0.02 + flickerSeed * 100 + row * 3 + col * 7) > -0.3;

      ctx.fillStyle = isLit ? COLORS.windowLit : COLORS.windowDark;
      ctx.fillRect(wx, wy, windowSize, windowSize);

      // Window glow when lit
      if (isLit) {
        ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
        ctx.fillRect(
          wx - zoom * 0.5,
          wy - zoom * 0.5,
          windowSize + zoom,
          windowSize + zoom
        );
      }
    }
  }

  // Door
  const doorW = Math.min(4 * zoom, scaledW * 0.2);
  const doorH = Math.min(6 * zoom, scaledH * 0.15);
  ctx.fillStyle = COLORS.door;
  ctx.fillRect(
    scaledX + (scaledW - doorW) / 2,
    scaledY + scaledH - doorH,
    doorW,
    doorH
  );

  // Door knob
  ctx.fillStyle = COLORS.windowLit;
  ctx.fillRect(
    scaledX + (scaledW - doorW) / 2 + doorW * 0.7,
    scaledY + scaledH - doorH * 0.5,
    zoom,
    zoom
  );

  // Selected highlight
  if (
    state.selectedBuilding &&
    state.selectedBuilding.index === b.index
  ) {
    ctx.strokeStyle = COLORS.windowLit;
    ctx.lineWidth = 2 * zoom;
    ctx.strokeRect(
      scaledX - zoom,
      scaledY - zoom,
      scaledW + 2 * zoom,
      scaledH + 2 * zoom
    );
  }
}

function bounceEase(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    const t2 = t - 1.5 / 2.75;
    return 7.5625 * t2 * t2 + 0.75;
  } else if (t < 2.5 / 2.75) {
    const t2 = t - 2.25 / 2.75;
    return 7.5625 * t2 * t2 + 0.9375;
  } else {
    const t2 = t - 2.625 / 2.75;
    return 7.5625 * t2 * t2 + 0.984375;
  }
}

export function screenToWorld(
  screenX: number,
  screenY: number,
  cameraX: number,
  cameraY: number,
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  return {
    x: (screenX - canvasWidth / 2) / zoom + cameraX,
    y: (screenY - canvasHeight / 2) / zoom + cameraY,
  };
}

export function findBuildingAt(
  worldX: number,
  worldY: number,
  buildings: BuildingData[]
): BuildingData | null {
  for (const b of buildings) {
    const size = getBuildingSize(b.buildingType);
    const bx = b.positionX * TILE;
    const by = b.positionY * TILE;
    const bw = size.w * TILE;
    const bh = size.h * TILE;

    if (
      worldX >= bx &&
      worldX <= bx + bw &&
      worldY >= by &&
      worldY <= by + bh
    ) {
      return b;
    }
  }
  return null;
}
