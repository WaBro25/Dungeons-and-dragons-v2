import React from "react";

interface Speed {
  walk?: string;
  fly?: string;
  swim?: string;
  [k: string]: string | undefined;
}

interface MonsterVitalsProps {
  hitPoints?: number | null;
  startingHitPoints?: number | null;
  hitDice?: string | null;
  hitPointsRoll?: string | null;
  speed?: Speed | null;
  onHitPointsChange?: (value: number) => void;
}

export default function MonsterVitals({
  hitPoints,
  startingHitPoints,
  hitDice,
  hitPointsRoll,
  speed,
  onHitPointsChange,
}: MonsterVitalsProps) {
  const hasAny =
    typeof hitPoints === "number" ||
    !!hitDice ||
    !!hitPointsRoll ||
    (speed && Object.values(speed).some(Boolean));

  if (!hasAny) return null;

  return (
    <div className="px-4 py-3 rounded border border-zinc-200 dark:border-zinc-800 text-left">
      <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Vitals</div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-300">Hit Points</span>
          {typeof onHitPointsChange === "function" ? (
            <div className="flex items-center gap-2">
              {typeof startingHitPoints === "number" ? (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{startingHitPoints}/</span>
              ) : null}
              <input
                type="number"
                className="w-24 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-right"
                value={typeof hitPoints === "number" ? hitPoints : ""}
                onChange={(e) => {
                  const next = parseInt(e.target.value, 10);
                  if (Number.isFinite(next)) {
                    onHitPointsChange(next);
                  } else if (e.target.value === "") {
                    // Allow clearing temporarily to empty string without emitting NaN
                    onHitPointsChange(0);
                  }
                }}
                min={0}
                inputMode="numeric"
              />
            </div>
          ) : (
            <span className="text-base font-semibold">
              {typeof hitPoints === "number" ? hitPoints : "-"}
              {typeof startingHitPoints === "number" ? (
                <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">(start: {startingHitPoints})</span>
              ) : null}
            </span>
          )}
        </div>
        {hitDice ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Hit Dice</span>
            <span className="text-base font-semibold break-words whitespace-normal">{hitDice}</span>
          </div>
        ) : null}
        {hitPointsRoll ? (
          <div className="grid grid-cols-2 gap-3 items-start">
            <span className="text-sm text-zinc-600 dark:text-zinc-300">Hit Points Roll</span>
            <span className="text-base font-semibold break-words whitespace-normal">{hitPointsRoll}</span>
          </div>
        ) : null}
        {speed ? (
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">Speed</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {speed.walk ? (
                <div className="grid grid-cols-2 gap-3 items-start">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Walk</span>
                  <span className="text-base font-medium ml-4 break-words whitespace-normal">{speed.walk}</span>
                </div>
              ) : null}
              {speed.fly ? (
                <div className="grid grid-cols-2 gap-3 items-start">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Fly</span>
                  <span className="text-base font-medium break-words whitespace-normal">{speed.fly}</span>
                </div>
              ) : null}
              {speed.swim ? (
                <div className="grid grid-cols-2 gap-3 items-start">
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">Swim</span>
                  <span className="text-base font-medium break-words whitespace-normal">{speed.swim}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}


