# Removes old/unused files from the Devanagari game project.
# Run from the project folder (the one with package.json):   powershell -ExecutionPolicy Bypass -File .\cleanup-leftovers.ps1
$files = @(
  "src\App.css.bak", "src\App.tsx.bak", "src\components\ReferenceChart.tsx.bak",
  "src\components\ReferenceChart_OLD.tsx", "src\devanagariData_OLD.ts", "vite.config.ts.bak",
  "src\components\DropZone.tsx", "src\components\LetterTile.tsx",
  "src\assets\hero.png", "src\assets\react.svg", "src\assets\vite.svg"
)
foreach ($f in $files) {
  if (Test-Path $f) { Remove-Item $f -Force; Write-Host "removed  $f" } else { Write-Host "(absent) $f" }
}
if ((Test-Path "src\assets") -and -not (Get-ChildItem "src\assets")) { Remove-Item "src\assets"; Write-Host "removed  src\assets (empty)" }
Write-Host "Done. Now run:  npm run build"
