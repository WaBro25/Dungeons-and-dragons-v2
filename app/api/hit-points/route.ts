import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monsterName = searchParams.get("monsterName")?.trim();
    if (!monsterName) {
      return NextResponse.json({ error: "monsterName is required" }, { status: 400 });
    }
    const hitPoints = await prisma.hitPoints.findUnique({
      where: { monsterName },
      select: { id: true, monsterName: true, hitPoints: true },
    });
    return NextResponse.json({ hitPoints });
  } catch (err) {
    console.error("GET /api/hit-points failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Failed to fetch hit points", details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const monsterName =
      typeof body?.monsterName === "string" ? body.monsterName.trim() : "";
    const hitPointsRaw = body?.hitPoints;
    const hitPoints =
      typeof hitPointsRaw === "number" && Number.isFinite(hitPointsRaw)
        ? Math.max(0, Math.floor(hitPointsRaw))
        : NaN;

    if (!monsterName) {
      return NextResponse.json({ error: "monsterName is required" }, { status: 400 });
    }
    if (!Number.isFinite(hitPoints)) {
      return NextResponse.json({ error: "hitPoints must be a number" }, { status: 400 });
    }

    const saved = await prisma.hitPoints.upsert({
      where: { monsterName },
      update: { hitPoints },
      create: { monsterName, hitPoints },
      select: { id: true, monsterName: true, hitPoints: true },
    });
    return NextResponse.json({ hitPoints: saved }, { status: 200 });
  } catch (err) {
    console.error("POST /api/hit-points failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Failed to save hit points", details: message }, { status: 500 });
  }
}


