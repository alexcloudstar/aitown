import { NextRequest, NextResponse } from "next/server";
import { getTown, saveTown, townExists } from "@/lib/r2";
import type { TownData } from "@/types";

const ALLOWED_BUILDING_TYPES = ["small", "medium", "large", "tower"];
const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const town = await getTown(username);
  if (!town) {
    return NextResponse.json({ error: "Town not found" }, { status: 404 });
  }

  return NextResponse.json(town, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  // Check not taken
  const exists = await townExists(username);
  if (exists) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  // Parse and validate body
  const body = await request.json();

  // Validate shape
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Reject unexpected string fields (privacy protection)
  const allowedTopKeys = new Set([
    "username",
    "createdAt",
    "totalConversations",
    "totalMessages",
    "buildings",
  ]);
  for (const key of Object.keys(body)) {
    if (!allowedTopKeys.has(key)) {
      return NextResponse.json(
        { error: `Unexpected field: ${key}` },
        { status: 400 }
      );
    }
  }

  if (body.username !== username) {
    return NextResponse.json(
      { error: "Username mismatch" },
      { status: 400 }
    );
  }

  if (
    typeof body.totalConversations !== "number" ||
    typeof body.totalMessages !== "number" ||
    !Array.isArray(body.buildings)
  ) {
    return NextResponse.json({ error: "Invalid body shape" }, { status: 400 });
  }

  // Validate buildings
  const allowedBuildingKeys = new Set([
    "index",
    "messageCount",
    "humanMessageCount",
    "assistantMessageCount",
    "firstActive",
    "lastActive",
    "buildingType",
    "positionX",
    "positionY",
    "colorSeed",
  ]);

  for (const building of body.buildings) {
    // Reject unexpected fields
    for (const key of Object.keys(building)) {
      if (!allowedBuildingKeys.has(key)) {
        return NextResponse.json(
          { error: `Unexpected building field: ${key}` },
          { status: 400 }
        );
      }
    }

    if (!ALLOWED_BUILDING_TYPES.includes(building.buildingType)) {
      return NextResponse.json(
        { error: "Invalid building type" },
        { status: 400 }
      );
    }

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (
      !monthRegex.test(building.firstActive) ||
      !monthRegex.test(building.lastActive)
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (
      typeof building.messageCount !== "number" ||
      typeof building.positionX !== "number" ||
      typeof building.positionY !== "number" ||
      typeof building.colorSeed !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid building data types" },
        { status: 400 }
      );
    }
  }

  const townData: TownData = {
    username,
    createdAt: new Date().toISOString(),
    totalConversations: body.totalConversations,
    totalMessages: body.totalMessages,
    buildings: body.buildings,
  };

  await saveTown(username, townData);

  return NextResponse.json({ success: true }, { status: 201 });
}
