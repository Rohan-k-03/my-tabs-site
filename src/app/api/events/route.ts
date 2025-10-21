import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.event.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const type = typeof json?.type === "string" && json.type.length > 0 ? json.type : "unknown";
  const payload = JSON.stringify(json?.payload ?? {});
  await prisma.event.create({ data: { type, payload } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const json = await req.json().catch(() => ({}));
  const id = typeof json?.id === "number" ? json.id : undefined;
  if (typeof id !== "number") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  await prisma.event.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

// ensure this runs on the node.js runtime n is never statically optimized
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
