import { NextResponse } from "next/server";

// In-memory fallback event store so the route works without a DB in preview builds.
// This resets on server restarts and is not persistent.
type Row = { id: number; createdAt: string; type: string; payload: string };
const EVENTS: Row[] = [];
let nextId = 1;

export async function GET() {
  const rows = EVENTS.slice(-50).reverse();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const type = typeof json?.type === "string" && json.type.length > 0 ? json.type : "unknown";
  const payload = JSON.stringify(json?.payload ?? {});
  EVENTS.push({ id: nextId++, createdAt: new Date().toISOString(), type, payload });
  return NextResponse.json({ ok: true });
}

// Ensure this runs on the Node.js runtime and is never statically optimized.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
