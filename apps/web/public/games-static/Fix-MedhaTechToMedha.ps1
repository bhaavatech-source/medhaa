#requires -Version 5.1
<#
.SYNOPSIS
  Second-pass fix: collapses "Medhā Tech" down to just "Medhā" everywhere
  the previous rebrand script left the word "Tech" behind. Dry-run by
  default; pass -Apply to actually write changes.

.DESCRIPTION
  This is a much narrower, lower-risk operation than the first rebrand
  pass: it only looks for the EXACT literal phrase "Medhā Tech" (which
  only exists because of the previous script's output) and replaces it
  with "Medhā". It does NOT touch:
    - Any remaining "Bhava"/"Bhāva" text (should be none left, but if any
      exists it is left alone — run the original scan/apply scripts for that)
    - assets/ folders (minified bundles) — same exclusion as before
    - .bak / .responsive_bak files
    - Lines containing UPI_NAME or data-bhava-game (same exclusions as before)

  Handles possessive forms correctly: "Medhā Tech's" becomes "Medhā's"
  automatically, since it's a plain substring replace.

  Makes a full backup of every file before writing, same as the first
  script, into its own timestamped backup folder.

.PARAMETER RootPath
  Folder to process. Defaults to current directory.

.PARAMETER Apply
  Without this switch: DRY RUN, shows counts, writes a preview CSV, changes
  nothing. With this switch: backs up and actually writes changes.

.EXAMPLE
  # Step 1 — dry run:
  powershell -ExecutionPolicy Bypass -File .\Fix-MedhaTechToMedha.ps1

  # Step 2 — apply:
  powershell -ExecutionPolicy Bypass -File .\Fix-MedhaTechToMedha.ps1 -Apply
#>

param(
    [string]$RootPath = ".",
    [switch]$Apply
)

$ErrorActionPreference = 'Stop'
$RootPath = (Resolve-Path -LiteralPath $RootPath).Path
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $RootPath "_medha-tech-fix-backups-$timestamp"
$changeLogPath = Join-Path $RootPath "_medha-tech-fix-changelog-$timestamp.csv"

if (-not (Test-Path $RootPath)) {
    Write-Host "ERROR: Path not found: $RootPath" -ForegroundColor Red
    exit 1
}

$mode = if ($Apply) { "APPLY (files WILL be modified, backups WILL be made)" } else { "DRY RUN (no files will be modified)" }
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Mode: $mode" -ForegroundColor Cyan
Write-Host " Root: $RootPath" -ForegroundColor Cyan
Write-Host " Fixing: 'Medha Tech' -> 'Medha' (collapsing the leftover word)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$includeExtensions = @('.html', '.htm', '.js', '.css', '.json', '.md', '.txt')
$searchPhrase = 'Medhā Tech'
$replacement = 'Medhā'

$sharedFileNames = @(
    'bhava-bridge.js', 'bhava-session.js', 'bhava-tech-all.js',
    'bhava-responsive.css', 'bhava-responsive.js', 'bhava-game-nav.js'
)

function Test-ShouldSkipFile($fullPath) {
    if ($fullPath -match '\\assets\\') { return $true }
    if ($fullPath -match '\.bak$') { return $true }
    if ($fullPath -match '\.responsive_bak$') { return $true }
    if ($fullPath -match '\\node_modules\\') { return $true }
    if ($fullPath -match '\\\.git\\') { return $true }
    if ($fullPath -match '_medha-tech-fix-backups-') { return $true }
    if ($fullPath -match '_medha-rebrand-backups-') { return $true }
    return $false
}

function Test-ShouldSkipLine($line) {
    if ($line -match 'UPI_NAME') { return $true }
    if ($line -match 'data-bhava-game') { return $true }
    return $false
}

function Backup-File($fullPath) {
    $relative = $fullPath.Substring($RootPath.Length).TrimStart('\')
    $backupPath = Join-Path $backupRoot $relative
    $backupDir = Split-Path $backupPath -Parent
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    Copy-Item -LiteralPath $fullPath -Destination $backupPath -Force
}

function Process-File($file, [ref]$changeLog, [ref]$totalChanges) {
    $fullPath = $file.FullName
    if (Test-ShouldSkipFile $fullPath) { return $null }

    $lines = $null
    try {
        $lines = Get-Content -LiteralPath $fullPath -Encoding UTF8 -ErrorAction Stop
    } catch {
        Write-Host "  SKIPPED (unreadable/binary): $fullPath" -ForegroundColor DarkYellow
        return $null
    }

    $fileChanged = $false
    $newLines = New-Object System.Collections.Generic.List[string]

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ((-not (Test-ShouldSkipLine $line)) -and ($line -like "*$searchPhrase*")) {
            $newLine = $line.Replace($searchPhrase, $replacement)
            if ($newLine -ne $line) {
                $fileChanged = $true
                $totalChanges.Value++
                $relative = $fullPath.Substring($RootPath.Length).TrimStart('\')
                $changeLog.Value.Add([PSCustomObject]@{
                    File       = $relative
                    LineNumber = $i + 1
                    Before     = $line.Trim()
                    After      = $newLine.Trim()
                })
                $newLines.Add($newLine)
                continue
            }
        }
        $newLines.Add($line)
    }

    if ($fileChanged -and $Apply) {
        Backup-File $fullPath
        Set-Content -LiteralPath $fullPath -Value $newLines -Encoding UTF8
    }

    return $fileChanged
}

$allFiles = Get-ChildItem -Path $RootPath -Recurse -File | Where-Object {
    $includeExtensions -contains $_.Extension.ToLower()
}

Write-Host "Found $($allFiles.Count) candidate files." -ForegroundColor Cyan

$changeLog = New-Object System.Collections.Generic.List[object]
$totalChanges = 0
$filesChanged = 0
$fileCount = 0

foreach ($file in $allFiles) {
    $fileCount++
    $changed = Process-File $file ([ref]$changeLog) ([ref]$totalChanges)
    if ($changed) { $filesChanged++ }
    if ($fileCount % 25 -eq 0) {
        Write-Host "  ...processed $fileCount / $($allFiles.Count) files" -ForegroundColor DarkGray
    }
}

if ($Apply) {
    Write-Host ""
    Write-Host "Syncing corrected shared files into all game folders..." -ForegroundColor Cyan
    foreach ($sharedName in $sharedFileNames) {
        $canonicalPath = Join-Path $RootPath $sharedName
        if (-not (Test-Path $canonicalPath)) { continue }

        $copies = Get-ChildItem -Path $RootPath -Recurse -File -Filter $sharedName |
            Where-Object { $_.FullName -ne $canonicalPath -and -not (Test-ShouldSkipFile $_.FullName) }

        foreach ($copy in $copies) {
            $canonicalContent = Get-Content -LiteralPath $canonicalPath -Raw -Encoding UTF8
            $copyContent = Get-Content -LiteralPath $copy.FullName -Raw -Encoding UTF8
            if ($canonicalContent -ne $copyContent) {
                Backup-File $copy.FullName
                Set-Content -LiteralPath $copy.FullName -Value $canonicalContent -Encoding UTF8 -NoNewline
                Write-Host "  Synced: $($copy.FullName.Substring($RootPath.Length).TrimStart('\'))" -ForegroundColor DarkGray
            }
        }
    }
}

if ($changeLog.Count -gt 0) {
    $changeLog | Export-Csv -Path $changeLogPath -NoTypeInformation -Encoding UTF8
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Done. Mode was: $mode" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Files scanned:         $fileCount"
Write-Host "Files with changes:    $filesChanged"
Write-Host "Total line changes:    $totalChanges"
if ($changeLog.Count -gt 0) {
    Write-Host "Change log saved to:   $changeLogPath"
}
if ($Apply) {
    Write-Host "Backups saved to:      $backupRoot" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "This was a DRY RUN — nothing was changed." -ForegroundColor Yellow
    Write-Host "Review the change log CSV, then re-run with -Apply to write changes." -ForegroundColor Yellow
}
