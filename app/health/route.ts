import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "urban-codetionary",
    checkedAt: new Date().toISOString(),
  });
}
