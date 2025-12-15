"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import ArmorClassPanel from "./components/ArmorClassPanel";
import MonsterCarousel from "./components/MonsterCarousel";
import MonsterStats from "./components/MonsterStats";
import MonsterVitals from "./components/MonsterVitals";
import MonsterDamage from "./components/MonsterDamage";

import MonsterProficiencies from "./components/MonsterProficiencies";
import MonsterOther from "./components/MonsterOther";

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
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    hit_points?: number;
    hit_dice?: string;
    hit_points_roll?: string;
    speed?: { walk?: string; fly?: string; swim?: string; [k: string]: string | undefined };
    actions?: Array<{
      name?: string;
      desc?: string;
      attack_bonus?: number;
      damage?: Array<{
        damage_type?: { index?: string; name?: string; url?: string };
        damage_dice?: string;
      }>;
      actions?: Array<{ action_name?: string; count?: string; type?: string }>;
    }>;
    legendary_actions?: Array<{
      name?: string;
      desc?: string;
      attack_bonus?: number;
      damage?: Array<{
        damage_type?: { index?: string; name?: string; url?: string };
        damage_dice?: string;
      }>;
      actions?: Array<{ action_name?: string; count?: string; type?: string }>;
    }>;
    special_abilities?: Array<{
      name?: string;
      desc?: string;
      damage?: Array<{
        damage_type?: { index?: string; name?: string; url?: string };
        damage_dice?: string;
      }>;
    }>;
    proficiencies?: Array<{ value?: number; proficiency?: { index?: string; name?: string; url?: string } }>;
    damage_vulnerabilities?: string[];
    damage_resistances?: string[];
    damage_immunities?: string[];
    condition_immunities?: Array<{ index?: string; name?: string; url?: string } | string>;
    senses?: {
      blindsight?: string;
      darkvision?: string;
      tremorsense?: string;
      truesight?: string;
      passive_perception?: number;
      [k: string]: unknown;
    };
    languages?: string;
    challenge_rating?: number;
    proficiency_bonus?: number;
  }

  const [monsterData, setMonsterData] = useState<MonsterData | null>(null);
  const [allMonsters, setAllMonsters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedName, setLastFetchedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log(monsterData, 'monsterData')
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
      <form onSubmit={handleSubmit} className="mb-4 ml-6 flex items-start gap-2">
        <div className="flex flex-col">
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
          {isLoading ? (
            <div className="mt-10 m text-sm text-zinc-600 dark:text-zinc-300">Loading monster...</div>
          ) : null}
          {error ? (
            <div className="mt-1 text-sm text-red-600">{error}</div>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className={`px-4 py-2 rounded font-medium shadow-sm transition focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-blue-400
                     ${isLoading ? "bg-blue-400 text-white opacity-60 cursor-not-allowed" : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700 hover:shadow-md active:bg-blue-800 active:shadow-none"}`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      <MonsterCarousel visible={!monsterData && !isLoading} />
      {monsterData && (
        <>
          {monsterData?.image ? (
            <div className="my-4 flex items-start gap-4">
              <div className="flex flex-col gap-3">
                <MonsterStats
                  strength={monsterData?.strength}
                  dexterity={monsterData?.dexterity}
                  constitution={monsterData?.constitution}
                  intelligence={monsterData?.intelligence}
                  wisdom={monsterData?.wisdom}
                  charisma={monsterData?.charisma}
                />
                <MonsterProficiencies proficiencies={monsterData?.proficiencies} />
                <MonsterOther
                  damageVulnerabilities={monsterData?.damage_vulnerabilities ?? []}
                  damageResistances={monsterData?.damage_resistances ?? []}
                  damageImmunities={monsterData?.damage_immunities ?? []}
                  conditionImmunities={monsterData?.condition_immunities ?? []}
                  senses={monsterData?.senses}
                  languages={monsterData?.languages}
                  challengeRating={monsterData?.challenge_rating ?? null}
                  proficiencyBonus={monsterData?.proficiency_bonus ?? null}
                />
              </div>
              <div className="relative w-[400px] h-[400px]">
                <Image
                  src={
                    monsterData.image.startsWith("http")
                      ? monsterData.image
                      : `https://www.dnd5eapi.co${monsterData.image}`
                  }
                  alt={monsterData.name ?? monsterName}
                  fill
                  sizes="400px"
                  className="object-contain rounded"
                  onLoadingComplete={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <ArmorClassPanel armorClass={monsterData?.armor_class} />
                <MonsterVitals
                  hitPoints={monsterData?.hit_points}
                  hitDice={monsterData?.hit_dice}
                  hitPointsRoll={monsterData?.hit_points_roll}
                  speed={monsterData?.speed}
                  onHitPointsChange={(next) =>
                    setMonsterData((prev) => (prev ? { ...prev, hit_points: next } : prev))
                  }
                />
                <MonsterDamage
                  actions={monsterData?.actions ?? []}
                  legendaryActions={monsterData?.legendary_actions ?? []}
                  specialAbilities={monsterData?.special_abilities ?? []}
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}