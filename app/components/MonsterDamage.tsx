"use client";
import React, { useMemo, useState } from "react";

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
  multiattack_type?: string;
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
  const actionEntries = useMemo(() => (Array.isArray(actions) ? actions : []), [actions]);
  const legendaryEntries = useMemo(() => (Array.isArray(legendaryActions) ? legendaryActions : []), [legendaryActions]);
  const specials = useMemo(() => (Array.isArray(specialAbilities) ? specialAbilities : []), [specialAbilities]);

  // Extract Legendary Resistances from specials
  const legendaryResistances = useMemo(
    () => specials.filter((s) => (s.name ?? "").toLowerCase().includes("legendary resistance")),
    [specials]
  );

  const shouldMoveToLegendary = (name?: string) => {
    const n = (name ?? "").toLowerCase();
    return n.includes("frightful presence") || n.includes("breath weapon");
  };
  const isAttackAction = (a: MonsterAction) => {
    const hasAttackBonus = typeof a.attack_bonus === "number";
    const hasDamage = Array.isArray(a.damage) && a.damage.length > 0;
    const descLower = (a.desc ?? "").toLowerCase();
    const looksLikeAttack =
      descLower.includes("attack") ||
      (Array.isArray(a.actions) &&
        a.actions.some((sub) => (sub.action_name ?? "").toLowerCase().includes("attack")));
    return hasAttackBonus || hasDamage || looksLikeAttack;
  };

  // Prepare row renderers
  const actionRows = useMemo(() => {
    return actionEntries
      .filter((a) => !shouldMoveToLegendary(a.name) && isAttackAction(a))
      .map((a) => {
        const name = a.name ?? "Action";
        const formatted = formatDamageList(a.damage);
        const text = formatted ?? (a.desc?.trim() ?? "");
        if (!text) return null;
        return { name, text };
      })
      .filter(Boolean) as Array<{ name: string; text: string }>;
  }, [actionEntries]);

  const legendaryActionRows = useMemo(() => {
    return legendaryEntries.map((la) => {
      const name = la.name ?? "Legendary Action";
      const formatted = formatDamageList(la.damage);
      return { name, text: formatted ?? (la.desc ?? "") };
    });
  }, [legendaryEntries]);

  const legendaryResistanceRows = useMemo(() => {
    return legendaryResistances.map((lr) => ({
      name: lr.name ?? "Legendary Resistance",
      text: lr.desc ?? "",
    }));
  }, [legendaryResistances]);

  // Pull selected actions (Frightful Presence, Breath Weapon) into Legendary bucket
  const legendaryFromActionsRows = useMemo(() => {
    return actionEntries
      .filter((a) => shouldMoveToLegendary(a.name))
      .map((a) => {
        const name = a.name ?? "Legendary";
        const formatted = formatDamageList(a.damage);
        const text = formatted ?? (a.desc?.trim() ?? "");
        return { name, text };
      });
  }, [actionEntries]);

  // Merge Legendary Resistances into the Legendary bucket (no separate tab)
  const mergedLegendaryRows = useMemo(
    () => [...legendaryResistanceRows, ...legendaryActionRows, ...legendaryFromActionsRows],
    [legendaryResistanceRows, legendaryActionRows, legendaryFromActionsRows]
  );

  type TabKey = "actions" | "legendaryActions";
  const hasOnlyActions = actionRows.length > 0 && mergedLegendaryRows.length === 0;
  const defaultTab: TabKey =
    actionRows.length > 0
      ? "actions"
      : mergedLegendaryRows.length > 0
      ? "legendaryActions"
      : "actions";
  const [selectedTab, setSelectedTab] = useState<TabKey>(defaultTab);

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: "actions" as TabKey, label: "Actions", count: actionRows.length },
    { key: "legendaryActions" as TabKey, label: "Legendary", count: mergedLegendaryRows.length },
  ].filter((t) => t.count > 0);

  const effectiveActiveTab: TabKey = useMemo(() => {
    if (hasOnlyActions) return "actions";
    if (tabs.length === 0) return "actions";
    return tabs.some((t) => t.key === selectedTab) ? selectedTab : tabs[0].key;
  }, [hasOnlyActions, tabs, selectedTab]);

  const currentRows = hasOnlyActions
    ? actionRows
    : effectiveActiveTab === "actions"
    ? actionRows
    : mergedLegendaryRows;

  const hasAny = actionRows.length > 0 || mergedLegendaryRows.length > 0;
  if (!hasAny) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left">
      {hasOnlyActions ? (
        <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Actions</div>
      ) : (
        <div className="mb-2 flex gap-2">
          {tabs.map((t) => {
            const isActive = effectiveActiveTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedTab(t.key)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  isActive
                    ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800"
                    : "border-transparent hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
                }`}
              >
                {t.label}
                <span className="ml-1 text-[10px] text-zinc-500">({t.count})</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="space-y-2">
        {currentRows.map((r, idx) => (
          <div key={`${r.name}-${idx}`} className="text-sm">
            <div className="grid grid-cols-2 gap-3 items-start">
              <span className="text-zinc-600 dark:text-zinc-300">{r.name}</span>
              <span className="font-medium break-words whitespace-normal max-w-[240px]">{r.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


