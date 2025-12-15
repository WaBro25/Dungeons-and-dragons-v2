import React from "react";

interface ArmorClassEntry {
  value: number;
  type?: string;
  armor?: string;
}

interface ArmorClassPanelProps {
  armorClass?: number | ArmorClassEntry[] | null;
}

function formatArmorClass(armorClass?: number | ArmorClassEntry[] | null): string | null {
  if (armorClass === undefined || armorClass === null) return null;
  if (typeof armorClass === "number") return String(armorClass);
  if (Array.isArray(armorClass)) {
    const parts = armorClass
      .map((entry) => {
        if (typeof entry?.value !== "number") return "";
        const suffix = entry.type ? ` (${entry.type})` : "";
        return `${entry.value}${suffix}`;
      })
      .filter((s) => s.length > 0);
    return parts.length ? parts.join(", ") : null;
  }
  return null;
}

export default function ArmorClassPanel({ armorClass }: ArmorClassPanelProps) {
  const display = formatArmorClass(armorClass);
  if (!display) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left">
      <div className="text-xs uppercase tracking-wide text-zinc-500">Armor Class</div>
      <div className="text-2xl font-semibold">{display}</div>
    </div>
  );
}


