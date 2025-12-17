import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monsterName = searchParams.get("monsterName")?.trim();
    const logs = await prisma.log.findMany({
      where: monsterName ? { monsterName } : undefined,
      orderBy: { createdAt: "desc" },
      select: { id: true, text: true, monsterName: true, createdAt: true },
    });
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const monsterName = typeof body?.monsterName === "string" ? body.monsterName.trim() : "";
    if (!monsterName) {
      return NextResponse.json({ error: "monsterName is required" }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    const log = await prisma.log.create({
      data: { text, monsterName },
      select: { id: true, text: true, monsterName: true, createdAt: true },
    });
    return NextResponse.json({ log }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
  }
}

