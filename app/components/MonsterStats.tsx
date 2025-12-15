import React from "react";

type StatValue = number | undefined | null;

interface MonsterStatsProps {
  strength?: StatValue;
  dexterity?: StatValue;
  constitution?: StatValue;
  intelligence?: StatValue;
  wisdom?: StatValue;
  charisma?: StatValue;
}

export default function MonsterStats({
  strength,
  dexterity,
  constitution,
  intelligence,
  wisdom,
  charisma,
}: MonsterStatsProps) {
  const entries = [
    { label: "Strength", value: strength },
    { label: "Dexterity", value: dexterity },
    { label: "Constitution", value: constitution },
    { label: "Intelligence", value: intelligence },
    { label: "Wisdom", value: wisdom },
    { label: "Charisma", value: charisma },
  ];

  const hasAny = entries.some((e) => typeof e.value === "number");
  if (!hasAny) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left min-w-[180px]">
      <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Stats</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {entries.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">{label}</span>
            <span className={`text-base font-semibold${label === "Constitution" ? " ml-4" : ""}`}>
              {typeof value === "number" ? value : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


