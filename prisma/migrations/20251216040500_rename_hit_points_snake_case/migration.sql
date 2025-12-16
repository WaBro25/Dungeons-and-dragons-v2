-- Rename table "hit points" -> hit_points if it exists
DO $$
BEGIN
  IF to_regclass('"hit points"') IS NOT NULL AND to_regclass('public.hit_points') IS NULL THEN
    ALTER TABLE "hit points" RENAME TO hit_points;
  END IF;
END
$$;

-- Rename column "hit points" -> hit_points if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hit_points'
      AND column_name = 'hit points'
  ) THEN
    ALTER TABLE public.hit_points RENAME COLUMN "hit points" TO hit_points;
  END IF;
END
$$;

-- Ensure table exists in case previous migration wasn't applied
CREATE TABLE IF NOT EXISTS public.hit_points (
  id SERIAL PRIMARY KEY,
  "monsterName" TEXT NOT NULL UNIQUE,
  hit_points INTEGER NOT NULL
);

