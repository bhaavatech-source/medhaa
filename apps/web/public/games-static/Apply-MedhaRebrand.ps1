#requires -Version 5.1
<#
.SYNOPSIS
  Replaces standalone "Bhava"/"Bhāva" display text with "Medhā" across
  games-static, safely. Defaults to DRY-RUN (shows what would change,
  writes nothing). Pass -Apply to actually write changes, after backups.

.DESCRIPTION
  SAFETY RULES BUILT IN (all automatic, no flags needed to enable them):

  1. Only matches standalone "Bhava"/"Bhāva" — same regex as the scanner:
     (?<![\w-])Bh[āa]va(?![\w-])
     This never touches bhava-bridge.js, BhavaSession, bhava_* keys, etc.

  2. Automatically SKIPS these, even in Apply mode, because they were
     flagged as unresolved risk items:
       - Any file inside an "assets" folder (minified Vite/React bundles —
         hand-editing built output is fragile; fix the source instead)
       - Any line containing "UPI_NAME" (possible payment identifier)
       - Any line containing "data-bhava-game" (HTML attribute that code
         may read via getAttribute — not just display text)
       - Any *.bak / *.responsive_bak file (these are backups/old
         versions, not the live served files)

  3. Makes a full backup of every file it is about to modify, before
     writing anything, into a timestamped folder that mirrors the
     original relative path — so any single file can be restored
     individually.

  4. "Shared" files that are duplicated identically across all
     folder-based games (bhava-bridge.js, bhava-session.js,
     bhava-tech-all.js, bhava-responsive.css, bhava-responsive.js,
     bhava-game-nav.js) are fixed ONCE at the root, then that corrected
     version is copied into every game folder — so all copies stay in
     sync instead of drifting.

  5. Writes a full change-log CSV of every line actually changed
     (file, line number, before, after) for your review/audit trail.

.PARAMETER RootPath
  Folder to process. Defaults to current directory.

.PARAMETER Apply
  Without this switch: DRY RUN. Shows counts and writes a preview CSV,
  changes nothing. With this switch: backs up and actually writes changes.

.EXAMPLE
  # Step 1 — see what would happen, changes nothing:
  powershell -ExecutionPolicy Bypass -File .\Apply-MedhaRebrand.ps1

  # Step 2 — after reviewing the dry-run CSV, actually apply:
  powershell -ExecutionPolicy Bypass -File .\Apply-MedhaRebrand.ps1 -Apply
#>

param(
    [string]$RootPath = ".",
    [switch]$Apply
)

$ErrorActionPreference = 'Stop'
$RootPath = (Resolve-Path -LiteralPath $RootPath).Path
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $RootPath "_medha-rebrand-backups-$timestamp"
$changeLogPath = Join-Path $RootPath "_medha-rebrand-changelog-$timestamp.csv"

if (-not (Test-Path $RootPath)) {
    Write-Host "ERROR: Path not found: $RootPath" -ForegroundColor Red
    exit 1
}

$mode = if ($Apply) { "APPLY (files WILL be modified, backups WILL be made)" } else { "DRY RUN (no files will be modified)" }
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Mode: $mode" -ForegroundColor Cyan
Write-Host " Root: $RootPath" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$includeExtensions = @('.html', '.htm', '.js', '.css', '.json', '.md', '.txt')
$replacement = 'Medhā'
$pattern = '(?<![\w-])Bh[āa]va(?![\w-])'

# Files that are duplicated identically across many folder-based games.
# We fix these once at the root, then sync the fixed copy everywhere.
$sharedFileNames = @(
    'bhava-bridge.js', 'bhava-session.js', 'bhava-tech-all.js',
    'bhava-responsive.css', 'bhava-responsive.js', 'bhava-game-nav.js'
)

function Test-ShouldSkipFile($fullPath) {
    if ($fullPath -match '\\assets\\') { return $true }          # minified bundles
    if ($fullPath -match '\.bak$') { return $true }               # old backups
    if ($fullPath -match '\.responsive_bak$') { return $true }    # old backups
    if ($fullPath -match '\\node_modules\\') { return $true }
    if ($fullPath -match '\\\.git\\') { return $true }
    if ($fullPath -match '_medha-rebrand-backups-') { return $true } # don't touch our own backups
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
        if ((-not (Test-ShouldSkipLine $line)) -and ([regex]::IsMatch($line, $pattern))) {
            $newLine = [regex]::Replace($line, $pattern, $replacement)
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

# ── Gather files ──────────────────────────────────────────────────────
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

# ── Sync shared files into all folder-based game copies ────────────────
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

# ── Reports ──────────────────────────────────────────────────────────
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
