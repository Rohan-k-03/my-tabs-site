import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const outputs = await prisma.output.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(outputs);
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const title = typeof data?.title === "string" && data.title.trim().length > 0 ? data.title.trim() : "Untitled";
  const html = typeof data?.html === "string" ? data.html : "";
  if (!html) return NextResponse.json({ error: "html required" }, { status: 400 });

  const created = await prisma.output.create({ data: { title, html } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
  const data = await req.json().catch(() => ({}));
  const id = typeof data?.id === "string" ? data.id : "";
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.output.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
