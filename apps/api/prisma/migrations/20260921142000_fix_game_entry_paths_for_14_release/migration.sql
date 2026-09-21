-- Fix game catalog entries that pointed to missing/case-mismatched static files.
UPDATE "Game" SET "entryPath" = 'build-your-car/index.html' WHERE "slug" = 'build-your-car';
UPDATE "Game" SET "entryPath" = 'bhava_Tech_Likhwell.html' WHERE "slug" = 'bhava-tech-likhwell';
UPDATE "Game" SET "entryPath" = 'bhava-space-academy/index.html' WHERE "slug" = 'bhava-space-academy';
UPDATE "Game" SET "entryPath" = 'Grammar-Pro.html' WHERE "slug" = 'grammar-pro';

-- Hide entries that have no corresponding game file in games-static.
UPDATE "Game" SET "isActive" = false WHERE "slug" IN (
  'math-blitz-example',
  'take-test',
  'empathy-conversation',
  'hidden-science',
  'logic-grid-puzzle'
);
