-- Keep the existing reading activity title aligned with the student catalog.
UPDATE "Game"
SET "title" = 'Medhā Reading Quest'
WHERE "slug" = 'medha-read-anybook-in-3hrs';

UPDATE "Game"
SET "kind" = 'activity'
WHERE "slug" IN (
  'bcs-lite-v3',
  'calm-zone',
  'career-adventure',
  'day-hero-game',
  'day-super-hero',
  'empathy-quest',
  'finlife-india-quest-enhanced',
  'good-habits',
  'heart-heroes',
  'iq-test-level-3',
  'medha-read-anybook-in-3hrs',
  'mindspark-iq',
  'nadopaasana',
  'neuro-ascend-iq',
  'ready-for-the-world',
  'soccomm-enhanced'
);

-- Brain of All Machines is a shipped free game but was missing from the API catalog.
INSERT INTO "Game" ("id", "slug", "title", "domain", "isFreeTier", "entryPath", "skills", "kind", "isActive")
VALUES (
  gen_random_uuid()::text,
  'brain-of-all-machines',
  'Brain of All Machines',
  'cognitive-math',
  true,
  'brain-of-all-machines/index.html',
  ARRAY[]::TEXT[],
  'game',
  true
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "domain" = EXCLUDED."domain",
  "isFreeTier" = EXCLUDED."isFreeTier",
  "entryPath" = EXCLUDED."entryPath",
  "kind" = EXCLUDED."kind";