"use client"
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [monsterName, setMonsterName] = useState("");
  interface ArmorClassEntry {
    value: number;
    type?: string;
    armor?: string;
  }
  interface MonsterData {
    name?: string;
    image?: string;
    armor_class?: number | ArmorClassEntry[];
  }

  const [monsterData, setMonsterData] = useState<MonsterData | null>(null);
  const [allMonsters, setAllMonsters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedName, setLastFetchedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMonsters = async () => {
      try {
        const response = await fetch(`/api/monsterManual`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const names: string[] = Array.isArray(data?.results)
          ? data.results
              .map((m: { name?: string }) => m?.name)
              .filter((n: unknown): n is string => typeof n === "string")
          : [];
        setAllMonsters(names);
      } catch (error) {
        console.error("Failed to fetch monsters list:", error);
      }
    };
    fetchAllMonsters();
  }, []);

  const fetchMonsterByName = async () => {
    try {
      const nameToFetch = monsterName.trim();
      if (!nameToFetch) return;
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/monsterManual?name=${encodeURIComponent(monsterName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMonsterData(data as MonsterData);
      setLastFetchedName(nameToFetch);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch monster data:", error);
      setError("Failed to fetch monster. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monsterName.trim()) {
      fetchMonsterByName();
    }
  };

  const getArmorClassDisplay = (): string | null => {
    const ac = monsterData?.armor_class;
    if (ac === undefined || ac === null) return null;
    if (typeof ac === "number") return String(ac);
    if (Array.isArray(ac)) {
      const parts = ac
        .map((entry) => {
          if (typeof entry?.value !== "number") return "";
          const suffix = entry.type ? ` (${entry.type})` : "";
          return `${entry.value}${suffix}`;
        })
        .filter((s) => s.length > 0);
      return parts.length ? parts.join(", ") : null;
    }
    return null;
  };

  // When a new image URL is set, show loading until the image finishes
  useEffect(() => {
    if (monsterData?.image) {
      setIsLoading(true);
    }
  }, [monsterData?.image]);

  // Auto-fetch when the user has entered a full, exact monster name
  useEffect(() => {
    const name = monsterName.trim();
    if (!name) return;
    const match = allMonsters.find((m) => m.toLowerCase() === name.toLowerCase());
    if (match && lastFetchedName?.toLowerCase() !== match.toLowerCase() && !isLoading) {
      fetchMonsterByName();
    }
  }, [monsterName, allMonsters, lastFetchedName]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={monsterName}
          onChange={(e) => setMonsterName(e.target.value)}
          placeholder="Enter monster name"
          list="monster-options"
          className="border p-2 rounded"
        />
        <datalist id="monster-options">
          {allMonsters.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className={`ml-2 px-4 py-2 rounded font-medium shadow-sm transition focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-blue-400
                     ${isLoading ? "bg-blue-400 text-white opacity-60 cursor-not-allowed" : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700 hover:shadow-md active:bg-blue-800 active:shadow-none"}`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      {isLoading ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-300">Loading monster...</div>
      ) : null}
      {error ? (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      ) : null}
      {monsterData && (
        <>
          {monsterData?.image ? (
            <div className="my-4 flex items-start gap-4">
              <Image
                src={
                  monsterData.image.startsWith("http")
                    ? monsterData.image
                    : `https://www.dnd5eapi.co${monsterData.image}`
                }
                alt={monsterData.name ?? monsterName}
                width={500}
                height={500}
                className="mx-auto max-h-96 object-contain rounded"
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
              {getArmorClassDisplay() ? (
                <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Armor Class</div>
                  <div className="text-2xl font-semibold">{getArmorClassDisplay()}</div>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}