import { NextRequest, NextResponse } from "next/server";
import { townExists } from "@/lib/r2";

const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]{0,28}[a-z0-9]$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({ exists: false });
  }

  const exists = await townExists(username);
  return NextResponse.json({ exists });
}
