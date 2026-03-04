import type { BuildingData } from "@/types";
import { getBuildingSize } from "./townLayout";

export interface Peep {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  color: string;
  homeX: number;
  homeY: number;
  radius: number; // wander radius in tiles
  state: "walking" | "idle";
  stateTimer: number;
  speechTimer: number;
  direction: number; // 0=down, 1=left, 2=right, 3=up
  buildingIndex: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function createPeeps(
  buildings: BuildingData[],
  tileSize: number
): Peep[] {
  const peeps: Peep[] = [];
  const MAX_PEEPS = 200;

  for (const building of buildings) {
    const count = Math.min(Math.floor(building.messageCount / 5), 20);
    const size = getBuildingSize(building.buildingType);
    const rand = seededRandom(building.colorSeed + building.index);

    for (let i = 0; i < count && peeps.length < MAX_PEEPS; i++) {
      const isHuman = i % 2 === 0;
      const homeX = (building.positionX + size.w / 2) * tileSize;
      const homeY = (building.positionY + size.h + 1) * tileSize;
      const wanderRadius = 3 * tileSize;

      const offsetX = (rand() - 0.5) * wanderRadius * 2;
      const offsetY = rand() * wanderRadius;

      peeps.push({
        x: homeX + offsetX,
        y: homeY + offsetY,
        targetX: homeX,
        targetY: homeY,
        speed: 0.3 + rand() * 0.4,
        color: isHuman ? "#e8a87c" : "#7cb8e8",
        homeX,
        homeY,
        radius: wanderRadius,
        state: "idle",
        stateTimer: rand() * 120,
        speechTimer: 0,
        direction: 0,
        buildingIndex: building.index,
      });
    }
  }

  return peeps;
}

export function updatePeep(peep: Peep, dt: number): void {
  peep.stateTimer -= dt;
  if (peep.speechTimer > 0) peep.speechTimer -= dt;

  if (peep.stateTimer <= 0) {
    if (peep.state === "idle") {
      // Start walking to a new target
      peep.state = "walking";
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * peep.radius;
      peep.targetX = peep.homeX + Math.cos(angle) * dist;
      peep.targetY = peep.homeY + Math.abs(Math.sin(angle)) * dist;
      peep.stateTimer = 60 + Math.random() * 180;

      // Random speech bubble
      if (Math.random() < 0.05) {
        peep.speechTimer = 90; // ~1.5 seconds at 60fps
      }
    } else {
      peep.state = "idle";
      peep.stateTimer = 30 + Math.random() * 120;
    }
  }

  if (peep.state === "walking") {
    const dx = peep.targetX - peep.x;
    const dy = peep.targetY - peep.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const moveX = (dx / dist) * peep.speed * dt;
      const moveY = (dy / dist) * peep.speed * dt;
      peep.x += moveX;
      peep.y += moveY;

      // Set direction based on movement
      if (Math.abs(dx) > Math.abs(dy)) {
        peep.direction = dx > 0 ? 2 : 1; // right : left
      } else {
        peep.direction = dy > 0 ? 0 : 3; // down : up
      }
    } else {
      peep.state = "idle";
      peep.stateTimer = 30 + Math.random() * 120;
    }
  }
}

export function drawPeep(
  ctx: CanvasRenderingContext2D,
  peep: Peep,
  cameraX: number,
  cameraY: number,
  zoom: number,
  offsetX: number = 0,
  offsetY: number = 0
): void {
  const screenX = (peep.x - cameraX) * zoom + offsetX;
  const screenY = (peep.y - cameraY) * zoom + offsetY;
  const w = 4 * zoom;
  const h = 8 * zoom;

  // Body
  ctx.fillStyle = peep.color;
  ctx.fillRect(screenX - w / 2, screenY - h, w, h);

  // Head (slightly lighter)
  ctx.fillStyle =
    peep.color === "#e8a87c" ? "#f0c0a0" : "#a0d0f0";
  ctx.fillRect(
    screenX - w / 2,
    screenY - h,
    w,
    w
  );

  // Eyes
  ctx.fillStyle = "#000";
  const eyeSize = Math.max(1, zoom * 0.8);
  if (peep.direction !== 3) {
    // Not facing up
    ctx.fillRect(
      screenX - w / 4 - eyeSize / 2,
      screenY - h + w * 0.3,
      eyeSize,
      eyeSize
    );
    ctx.fillRect(
      screenX + w / 4 - eyeSize / 2,
      screenY - h + w * 0.3,
      eyeSize,
      eyeSize
    );
  }

  // Walking animation - leg movement
  if (peep.state === "walking") {
    const legOffset = Math.sin(Date.now() * 0.01 * peep.speed) * zoom;
    ctx.fillStyle = peep.color === "#e8a87c" ? "#c08060" : "#5098c8";
    ctx.fillRect(screenX - w / 2, screenY - zoom, w / 2 - 0.5, zoom + legOffset);
    ctx.fillRect(screenX + 0.5, screenY - zoom, w / 2 - 0.5, zoom - legOffset);
  }

  // Speech bubble
  if (peep.speechTimer > 0) {
    const bubbleW = 12 * zoom;
    const bubbleH = 8 * zoom;
    const bx = screenX - bubbleW / 2;
    const by = screenY - h - bubbleH - 4 * zoom;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(bx, by, bubbleW, bubbleH);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = zoom * 0.5;
    ctx.strokeRect(bx, by, bubbleW, bubbleH);

    // Dots
    ctx.fillStyle = "#000";
    const dotSize = zoom * 0.8;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(
        bx + bubbleW * 0.25 + i * bubbleW * 0.2,
        by + bubbleH / 2 - dotSize / 2,
        dotSize,
        dotSize
      );
    }

    // Tail
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(screenX - zoom, by + bubbleH, zoom * 2, zoom * 2);
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(screenX - zoom, by + bubbleH);
    ctx.lineTo(screenX, by + bubbleH + zoom * 3);
    ctx.lineTo(screenX + zoom, by + bubbleH);
    ctx.stroke();
    ctx.fill();
  }
}
