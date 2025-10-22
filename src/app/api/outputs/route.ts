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

export async function PATCH(req: Request) {
  const data = await req.json().catch(() => ({}));
  const id = typeof data?.id === "string" && data.id.trim().length > 0 ? data.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const updates: { title?: string; html?: string } = {};
  if (typeof data?.title === "string" && data.title.trim().length > 0) {
    updates.title = data.title.trim();
  }
  if (typeof data?.html === "string") {
    updates.html = data.html;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no changes supplied" }, { status: 400 });
  }

  try {
    const updated = await prisma.output.update({ where: { id }, data: updates });
    return NextResponse.json(updated);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
