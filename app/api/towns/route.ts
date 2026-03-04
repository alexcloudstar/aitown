import { NextResponse } from "next/server";
import { listTowns } from "@/lib/r2";

export async function GET() {
  try {
    const towns = await listTowns();
    return NextResponse.json(towns, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }
}
