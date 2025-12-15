import React from "react";

type MaybeString = string | undefined | null;

interface ConditionRef {
  index?: string;
  name?: string;
  url?: string;
}

interface Senses {
  blindsight?: string;
  darkvision?: string;
  tremorsense?: string;
  truesight?: string;
  passive_perception?: number;
  [k: string]: unknown;
}

interface MonsterOtherProps {
  damageVulnerabilities?: MaybeString[] | null;
  damageResistances?: MaybeString[] | null;
  damageImmunities?: MaybeString[] | null;
  conditionImmunities?: Array<MaybeString | ConditionRef> | null;
  senses?: Senses | null;
  languages?: MaybeString;
  challengeRating?: number | null;
  proficiencyBonus?: number | null;
}

function joinList(values?: MaybeString[] | null): string | null {
  if (!Array.isArray(values) || values.length === 0) return null;
  const parts = values.map((v) => (typeof v === "string" ? v : "")).filter((v) => v.length > 0);
  return parts.length ? parts.join(", ") : null;
}

function joinConditions(values?: Array<MaybeString | ConditionRef> | null): string | null {
  if (!Array.isArray(values) || values.length === 0) return null;
  const parts = values
    .map((v) => (typeof v === "string" ? v : (v?.name ?? "")))
    .filter((v) => v.length > 0);
  return parts.length ? parts.join(", ") : null;
}

export default function MonsterOther({
  damageVulnerabilities,
  damageResistances,
  damageImmunities,
  conditionImmunities,
  senses,
  languages,
  challengeRating,
  proficiencyBonus,
}: MonsterOtherProps) {
  const vul = joinList(damageVulnerabilities);
  const res = joinList(damageResistances);
  const imm = joinList(damageImmunities);
  const condImm = joinConditions(conditionImmunities);

  const hasAny =
    !!vul ||
    !!res ||
    !!imm ||
    !!condImm ||
    !!languages ||
    (senses && (senses.blindsight || senses.darkvision || senses.tremorsense || senses.truesight || typeof senses.passive_perception === "number")) ||
    typeof challengeRating === "number" ||
    typeof proficiencyBonus === "number";

  if (!hasAny) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left">
      <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Other</div>
      <div className="space-y-1">
        {vul ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Vulnerabilities</span>
            <span className="text-sm font-medium break-words whitespace-normal">{vul}</span>
          </div>
        ) : null}
        {res ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Resistances</span>
            <span className="text-sm font-medium break-words whitespace-normal">{res}</span>
          </div>
        ) : null}
        {imm ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Immunities</span>
            <span className="text-sm font-medium break-words whitespace-normal">{imm}</span>
          </div>
        ) : null}
        {condImm ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Condition Immunities</span>
            <span className="text-sm font-medium break-words whitespace-normal">{condImm}</span>
          </div>
        ) : null}
        {senses && (senses.blindsight || senses.darkvision || senses.tremorsense || senses.truesight || typeof senses.passive_perception === "number") ? (
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">Senses</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {senses.blindsight ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Blindsight</span>
                  <span className="text-sm font-medium">{senses.blindsight}</span>
                </div>
              ) : null}
              {senses.darkvision ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Darkvision</span>
                  <span className="text-sm font-medium">{senses.darkvision}</span>
                </div>
              ) : null}
              {senses.tremorsense ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Tremorsense</span>
                  <span className="text-sm font-medium">{senses.tremorsense}</span>
                </div>
              ) : null}
              {senses.truesight ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Truesight</span>
                  <span className="text-sm font-medium">{senses.truesight}</span>
                </div>
              ) : null}
              {typeof senses.passive_perception === "number" ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Passive Perception</span>
                  <span className="text-sm font-medium">{senses.passive_perception}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {languages ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Languages</span>
            <span className="text-sm font-medium break-words whitespace-normal">{languages}</span>
          </div>
        ) : null}
        {typeof challengeRating === "number" ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Challenge Rating</span>
            <span className="text-sm font-semibold">{challengeRating}</span>
          </div>
        ) : null}
        {typeof proficiencyBonus === "number" ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Proficiency Bonus</span>
            <span className="text-sm font-semibold">+{proficiencyBonus}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}


