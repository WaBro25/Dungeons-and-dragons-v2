import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monsterName = searchParams.get("monsterName")?.trim();
    if (!monsterName) {
      return NextResponse.json({ error: "monsterName is required" }, { status: 400 });
    }
    const note = await prisma.note.findUnique({
      where: { monsterName },
      select: { id: true, text: true, monsterName: true },
    });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
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
    const note = await prisma.note.upsert({
      where: { monsterName },
      update: { text },
      create: { monsterName, text },
      select: { id: true, text: true, monsterName: true },
    });
    return NextResponse.json({ note }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}


