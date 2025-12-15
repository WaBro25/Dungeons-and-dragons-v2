import React from "react";

interface DamageTypeRef {
  index?: string;
  name?: string;
  url?: string;
}

interface DamageEntry {
  damage_type?: DamageTypeRef;
  damage_dice?: string;
}

export interface MonsterAction {
  name?: string;
  desc?: string;
  attack_bonus?: number;
  damage?: DamageEntry[];
  actions?: Array<{
    action_name?: string;
    count?: string;
    type?: string;
  }>;
}

interface SpecialAbility {
  name?: string;
  desc?: string;
  damage?: DamageEntry[];
}

interface MonsterDamageProps {
  actions?: MonsterAction[] | null;
  legendaryActions?: MonsterAction[] | null;
  specialAbilities?: SpecialAbility[] | null;
}

function formatDamageList(damage?: DamageEntry[]): string | null {
  if (!Array.isArray(damage) || damage.length === 0) return null;
  const parts = damage
    .map((d) => {
      const dice = d.damage_dice ?? "";
      const type = d.damage_type?.name ?? "";
      return [dice, type].filter(Boolean).join(" ");
    })
    .filter((s) => s.length > 0);
  return parts.length ? parts.join(", ") : null;
}

export default function MonsterDamage({ actions, legendaryActions, specialAbilities }: MonsterDamageProps) {
  const actionEntries = Array.isArray(actions) ? actions : [];
  const legendaryEntries = Array.isArray(legendaryActions) ? legendaryActions : [];
  const specials = Array.isArray(specialAbilities) ? specialAbilities : [];

  const rows: Array<{ label: string; name: string; text: string }> = [];

  // Include Legendary Resistance if present among special abilities
  const legendaryResistance = specials.find(
    (s) => (s.name ?? "").toLowerCase().includes("legendary resistance")
  );
  if (legendaryResistance) {
    rows.push({
      label: "Legendary",
      name: legendaryResistance.name ?? "Legendary Resistance",
      text: legendaryResistance.desc ?? "",
    });
  }

  // Include all other special abilities
  for (const s of specials) {
    if ((s.name ?? "").toLowerCase().includes("legendary resistance")) continue;
    const name = s.name ?? "Special Ability";
    const formatted = formatDamageList(s.damage);
    rows.push({
      label: "Special",
      name,
      text: formatted ?? (s.desc ?? ""),
    });
  }

  for (const a of actionEntries) {
    const name = a.name ?? "Action";
    const formatted = formatDamageList(a.damage);
    if (formatted) {
      rows.push({ label: "Action", name, text: formatted });
    }
  }
  for (const la of legendaryEntries) {
    const name = la.name ?? "Legendary Action";
    const formatted = formatDamageList(la.damage);
    rows.push({
      label: "Legendary",
      name,
      text: formatted ?? (la.desc ?? ""),
    });
  }

  if (rows.length === 0) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left">
      <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Damage</div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={`${r.label}-${r.name}-${idx}`} className="text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-600 dark:text-zinc-300">{r.name}</span>
              <span className="font-medium">{r.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


