"use client";

import type { BuildingData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BuildingInfoPanelProps {
  building: BuildingData;
  title?: string;
  onClose: () => void;
}

export function BuildingInfoPanel({
  building,
  title,
  onClose,
}: BuildingInfoPanelProps) {
  const displayTitle = title ?? `Building #${building.index}`;
  const typeLabel = building.buildingType.charAt(0).toUpperCase() + building.buildingType.slice(1);

  return (
    <div
      className="absolute inset-0 z-10"
      onClick={onClose}
    >
      <Card
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[360px] border-[color:var(--color-amber)] bg-[rgba(13,13,26,0.95)] backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="text-[color:var(--color-amber)] text-sm truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {displayTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-[color:var(--color-amber)]/40 text-[color:var(--color-amber)]">
              {typeLabel}
            </Badge>
            <Badge variant="secondary">
              {building.messageCount} messages
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="text-[color:var(--color-amber)]/70">Human:</span>{" "}
              {building.humanMessageCount}
            </div>
            <div>
              <span className="text-[color:var(--color-amber)]/70">Assistant:</span>{" "}
              {building.assistantMessageCount}
            </div>
            <div>
              <span className="text-[color:var(--color-amber)]/70">First:</span>{" "}
              {building.firstActive}
            </div>
            <div>
              <span className="text-[color:var(--color-amber)]/70">Last:</span>{" "}
              {building.lastActive}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/60">
            Click outside or press Escape to close
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
