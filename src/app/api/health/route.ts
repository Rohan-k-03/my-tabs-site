import { NextResponse } from "next/server";

export async function GET() {
  const uptime = process.uptime();
  return NextResponse.json({ status: "ok", uptime, now: new Date().toISOString() });
}

export const runtime = "nodejs";
