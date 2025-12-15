import { NextResponse } from "next/server";

const DND5E_API_BASE = "https://www.dnd5eapi.co/api/2014";

export const dynamic = "force-dynamic";

interface DndIndexResult {
  index: string;
  name: string;
  url: string;
}

interface DndIndexResponse {
  count: number;
  results: DndIndexResult[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    // If no name is provided, return the full monsters list (as before)
    if (!name) {
      const listResponse = await fetch(`${DND5E_API_BASE}/monsters`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!listResponse.ok) {
        return NextResponse.json(
          { error: `Upstream error: ${listResponse.status} ${listResponse.statusText}` },
          { status: 502 }
        );
      }
      const listData = await listResponse.json();
      return NextResponse.json(listData);
    }

    // If name is provided, find the monster by name and return its details
    const listResponse = await fetch(`${DND5E_API_BASE}/monsters`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!listResponse.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${listResponse.status} ${listResponse.statusText}` },
        { status: 502 }
      );
    }
    const listData = (await listResponse.json()) as DndIndexResponse;
    const results: Array<{ name: string; index: string; url: string }> =
      Array.isArray(listData?.results) ? listData.results : [];

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const inputLower = name.toLowerCase();
    const inputSlug = normalize(name);

    // Try several matching strategies: exact by name, exact by slug == index, partial name includes
    let match =
      results.find((m) => m.name.toLowerCase() === inputLower) ??
      results.find((m) => m.index === inputSlug) ??
      results.find((m) => m.name.toLowerCase().includes(inputLower));

    if (!match) {
      return NextResponse.json(
        { error: `Monster "${name}" not found` },
        { status: 404 }
      );
    }

    const detailUrl = `${DND5E_API_BASE}/monsters/${match.index}`;
    const detailResponse = await fetch(detailUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!detailResponse.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${detailResponse.status} ${detailResponse.statusText}` },
        { status: 502 }
      );
    }
    const detailData = await detailResponse.json();
    return NextResponse.json(detailData);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch monsters" },
      { status: 500 }
    );
  }
}

// app/api/monsterManual/route.ts
// Removed duplicate GET function implementation