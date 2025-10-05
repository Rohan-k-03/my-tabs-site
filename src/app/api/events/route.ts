import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import log from "@/lib/log";

async function ensureTable() {
  // Create a lightweight events table if it doesn't exist (SQLite only).
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      type TEXT NOT NULL,
      payload TEXT
    );
  `);
}

export async function GET() {
  const done = log.start("/api/events", "GET");
  try {
    await ensureTable();
    const rows = await prisma.$queryRawUnsafe<any[]>(
      "SELECT id, createdAt, type, payload FROM events ORDER BY id DESC LIMIT 50"
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    done();
  }
}

export async function POST(req: Request) {
  const done = log.start("/api/events", "POST");
  try {
    await ensureTable();
    const json = await req.json().catch(() => ({}));
    const type = typeof json?.type === "string" && json.type.length > 0 ? json.type : "unknown";
    const payload = JSON.stringify(json?.payload ?? {});
    const result = await prisma.$executeRawUnsafe(
      "INSERT INTO events (type, payload) VALUES (?, ?)",
      type,
      payload
    );
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON or server error" }, { status: 400 });
  } finally {
    done();
  }
}

