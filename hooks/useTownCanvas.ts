"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { BuildingData } from "@/types";
import {
  type RenderState,
  createInitialRenderState,
  renderFrame,
  screenToWorld,
  findBuildingAt,
  getTownBounds,
} from "@/lib/canvasRenderer";
import { createPeeps, updatePeep } from "@/lib/peepAI";

const TILE = 16;

export interface UseTownCanvasOptions {
  buildings: BuildingData[];
  mode: "interactive" | "cinematic";
  animate?: boolean; // Play generation animation
  onBuildingClick?: (building: BuildingData | null) => void;
}

export function useTownCanvas({
  buildings,
  mode,
  animate = false,
  onBuildingClick,
}: UseTownCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<RenderState | null>(null);
  const animFrameRef = useRef<number>(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingData | null>(null);

  const initState = useCallback(() => {
    if (buildings.length === 0) return;

    const state = createInitialRenderState(buildings);
    state.peeps = createPeeps(buildings, TILE);

    if (animate) {
      state.visibleBuildingCount = 0;
    }

    stateRef.current = state;
  }, [buildings, animate]);

  useEffect(() => {
    initState();
  }, [initState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let animStartTime = 0;
    const BUILDING_INTERVAL = 100; // ms between each building appearing
    const CINEMATIC_DURATION = 3000; // ms for cinematic pan

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    function gameLoop(timestamp: number) {
      if (!running || !ctx || !canvas || !stateRef.current) return;

      const state = stateRef.current;
      const rect = canvas.getBoundingClientRect();

      if (!animStartTime) animStartTime = timestamp;
      const elapsed = timestamp - animStartTime;

      // Generation animation
      if (animate) {
        const targetCount = Math.min(
          buildings.length,
          Math.floor(elapsed / BUILDING_INTERVAL) + 1
        );
        state.visibleBuildingCount = targetCount;

        // Cinematic pan after all buildings placed
        if (targetCount >= buildings.length && buildings.length > 0) {
          const cinematicElapsed =
            elapsed - buildings.length * BUILDING_INTERVAL;
          if (cinematicElapsed > 0 && cinematicElapsed < CINEMATIC_DURATION) {
            const bounds = getTownBounds(buildings);
            const progress = cinematicElapsed / CINEMATIC_DURATION;
            const eased = easeInOutCubic(progress);

            const panStartX = bounds.minX * TILE - 50;
            const panEndX = bounds.maxX * TILE + 50;
            state.cameraX =
              bounds.centerX +
              (panStartX - bounds.centerX) * (1 - eased) +
              (panEndX - bounds.centerX) * eased * 0.3;
            state.cameraY = bounds.centerY;
          }
        }
      }

      // Cinematic mode: auto-pan
      if (mode === "cinematic" && !animate) {
        const bounds = getTownBounds(buildings);
        const range = (bounds.maxX - bounds.minX) * TILE;
        const speed = 0.015;
        const t = (timestamp * speed) % (range * 2);
        const pingPong = t < range ? t : range * 2 - t;
        state.cameraX = bounds.minX * TILE + pingPong;
        state.cameraY = bounds.centerY + Math.sin(timestamp * 0.0003) * 30;
      }

      // Update peeps
      state.time++;
      for (const peep of state.peeps) {
        updatePeep(peep, 1);
      }

      // Render
      renderFrame(ctx, state, rect.width, rect.height);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    }

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [buildings, mode, animate]);

  // Mouse/touch handlers for interactive mode
  useEffect(() => {
    if (mode !== "interactive") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !stateRef.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      stateRef.current.cameraX -= dx / stateRef.current.zoom;
      stateRef.current.cameraY -= dy / stateRef.current.zoom;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastMouse.current.x);
      const dy = Math.abs(e.clientY - lastMouse.current.y);

      // Click (not drag)
      if (dx < 5 && dy < 5 && stateRef.current) {
        const rect = canvas.getBoundingClientRect();
        const world = screenToWorld(
          e.clientX - rect.left,
          e.clientY - rect.top,
          stateRef.current.cameraX,
          stateRef.current.cameraY,
          stateRef.current.zoom,
          rect.width,
          rect.height
        );
        const building = findBuildingAt(
          world.x,
          world.y,
          stateRef.current.buildings
        );
        stateRef.current.selectedBuilding = building;
        setSelectedBuilding(building);
        onBuildingClick?.(building);
      }

      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!stateRef.current) return;
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      stateRef.current.zoom = Math.max(
        1,
        Math.min(4, stateRef.current.zoom + delta)
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stateRef.current) {
        stateRef.current.selectedBuilding = null;
        setSelectedBuilding(null);
        onBuildingClick?.(null);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, onBuildingClick]);

  return { canvasRef, selectedBuilding, stateRef };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
