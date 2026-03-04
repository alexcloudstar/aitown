"use client";

import { useCallback, useState } from "react";
import type { BuildingData } from "@/types";
import { useTownCanvas } from "@/hooks/useTownCanvas";
import { BuildingInfoPanel } from "./BuildingInfoPanel";

interface TownCanvasProps {
  buildings: BuildingData[];
  mode: "interactive" | "cinematic";
  animate?: boolean;
  titles?: Map<number, string>; // index -> title (owner only)
  className?: string;
}

export function TownCanvas({
  buildings,
  mode,
  animate = false,
  titles,
  className = "",
}: TownCanvasProps) {
  const [panelBuilding, setPanelBuilding] = useState<BuildingData | null>(null);

  const handleBuildingClick = useCallback(
    (building: BuildingData | null) => {
      if (mode === "interactive") {
        setPanelBuilding(building);
      }
    },
    [mode]
  );

  const { canvasRef } = useTownCanvas({
    buildings,
    mode,
    animate,
    onBuildingClick: handleBuildingClick,
  });

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ cursor: mode === "interactive" ? "grab" : "default" }}
      />
      {mode === "interactive" && panelBuilding && (
        <BuildingInfoPanel
          building={panelBuilding}
          title={titles?.get(panelBuilding.index)}
          onClose={() => setPanelBuilding(null)}
        />
      )}
    </div>
  );
}
