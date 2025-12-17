import { NextResponse } from "next/server";

const DND5E_API_BASE = "https://www.dnd5eapi.co/api/2014";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.trim();

    // No name: return full index list
    if (!name) {
      const response = await fetch(`${DND5E_API_BASE}/monsters`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        return NextResponse.json(
          { error: `Upstream error: ${response.status} ${response.statusText}` },
          { status: 502 }
        );
      }
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Name provided: find matching monster, then return its details
    const listRes = await fetch(`${DND5E_API_BASE}/monsters`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!listRes.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${listRes.status} ${listRes.statusText}` },
        { status: 502 }
      );
    }
    const list = await listRes.json();
    const results: Array<{ name: string; index: string; url: string }> = Array.isArray(list?.results)
      ? list.results
      : [];

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const lower = name.toLowerCase();
    const slug = normalize(name);

    const match =
      results.find((m) => m.name.toLowerCase() === lower) ??
      results.find((m) => m.index === slug) ??
      results.find((m) => m.name.toLowerCase().includes(lower));

    if (!match) {
      return NextResponse.json({ error: `Monster "${name}" not found` }, { status: 404 });
    }

    const detailRes = await fetch(`${DND5E_API_BASE}/monsters/${match.index}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!detailRes.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${detailRes.status} ${detailRes.statusText}` },
        { status: 502 }
      );
    }
    const detail = await detailRes.json();
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to fetch monsters" }, { status: 500 });
  }
}

// app/api/monsterManual/route.ts
// GET supports optional ?name= to return detail