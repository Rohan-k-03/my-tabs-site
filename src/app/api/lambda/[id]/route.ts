import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const output = await prisma.output.findUnique({ where: { id } });
  if (!output) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(output.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}

export const runtime = "edge";

