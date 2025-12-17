import React from "react";

interface ProficiencyRef {
  index?: string;
  name?: string;
  url?: string;
}

interface ProficiencyEntry {
  value?: number;
  proficiency?: ProficiencyRef;
}

interface MonsterProficienciesProps {
  proficiencies?: ProficiencyEntry[] | null;
}

export default function MonsterProficiencies({ proficiencies }: MonsterProficienciesProps) {
  const items = Array.isArray(proficiencies) ? proficiencies : [];
  if (items.length === 0) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left w-[240px]">
      <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Proficiencies</div>
      <div className="space-y-1">
        {items.map((entry, idx) => {
          const label = entry.proficiency?.name ?? "Proficiency";
          const value = typeof entry.value === "number" ? entry.value : null;
          return (
            <div key={`${label}-${idx}`} className="grid grid-cols-2 gap-3 items-start">
              <span className="text-sm text-zinc-600 dark:text-zinc-300 break-words whitespace-normal">{label}</span>
              <span className="text-base font-medium break-words whitespace-normal">{value !== null ? value : "-"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


