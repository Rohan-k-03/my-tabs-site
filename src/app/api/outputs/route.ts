import { NextResponse } from "next/server";

type Output = { id: string; createdAt: string; title: string; html: string };
const OUTPUTS: Output[] = [];

function id() {
  // Simple random id (not crypto-strong), fine for demo purposes
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function GET() {
  return NextResponse.json(OUTPUTS.slice().reverse());
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const title = typeof data?.title === "string" && data.title.trim().length > 0 ? data.title.trim() : "Untitled";
  const html = typeof data?.html === "string" ? data.html : "";
  if (!html) return NextResponse.json({ error: "html required" }, { status: 400 });
  const created: Output = { id: id(), createdAt: new Date().toISOString(), title, html };
  OUTPUTS.push(created);
  return NextResponse.json(created, { status: 201 });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

