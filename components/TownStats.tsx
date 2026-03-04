"use client";

import type { TownData } from "@/types";

interface TownStatsProps {
  town: TownData;
}

export function TownStats({ town }: TownStatsProps) {
  const earliest = town.buildings.reduce(
    (min, b) => (b.firstActive < min ? b.firstActive : min),
    town.buildings[0]?.firstActive ?? ""
  );

  const monthToDisplay = (m: string) => {
    const [year, month] = m.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <p className="text-xs text-muted-foreground">
      {town.totalConversations} conversations &middot;{" "}
      {town.totalMessages.toLocaleString()} messages
      {earliest && <> &middot; Since {monthToDisplay(earliest)}</>}
    </p>
  );
}
