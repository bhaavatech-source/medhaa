#requires -Version 5.1
<#
.SYNOPSIS
  DRY-RUN scanner only. Finds every standalone "Bhava" / "Bhāva" mention in
  your games-static folder and reports it to a CSV — it does NOT change,
  rename, or overwrite a single file or byte. Safe to run as many times as
  you like.

.DESCRIPTION
  Uses the regex (?<![\w-])Bh[āa]va(?![\w-]) which matches "Bhava"/"Bhāva"
  ONLY when it is NOT directly glued to another letter, digit, underscore,
  or hyphen on either side. This means it will find things like:
      "the Bhava normative sample"      -> MATCH (display text)
      "Bhāva Tech — Brain Power Test"   -> MATCH (display text)
      "Bhāva Space Academy"             -> MATCH (display text)
  ...but will automatically SKIP things like:
      bhava-bridge.js                   -> no match (hyphen attached)
      BhavaSession                      -> no match (letter attached)
      bhava_soccomm_last                -> no match (underscore attached)
      --bhv-card                        -> no match (different string entirely)

  Every match is additionally flagged with a "LooksLikeCode" column as a
  second safety net — if the line also contains things like "function",
  "const ", "localStorage", "<script src=", "href=", "class=", etc., it is
  flagged TRUE so you can manually double-check it even though the regex
  matched, in case a filename is merely mentioned inside a comment or
  visible string.

.PARAMETER RootPath
  Folder to scan. Defaults to the games-static folder.

.PARAMETER OutputCsv
  Where to write the report. Defaults to a timestamped CSV next to the
  script.

.EXAMPLE
  .\Scan-BhavaReferences.ps1
  .\Scan-BhavaReferences.ps1 -RootPath "E:\medhaa\apps\web\public\games-static"
#>

param(
    [string]$RootPath = "E:\medhaa\apps\web\public\games-static",
    [string]$OutputCsv = ".\bhava-scan-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').csv"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $RootPath)) {
    Write-Host "ERROR: Path not found: $RootPath" -ForegroundColor Red
    exit 1
}

Write-Host "Scanning (read-only, no files will be modified): $RootPath" -ForegroundColor Cyan

# Only scan text-based file types where display text or code actually lives.
# Deliberately EXCLUDES images, zips, fonts, etc.
$includeExtensions = @('.html', '.htm', '.js', '.css', '.json', '.md', '.txt')

# Folders to skip entirely — build artifacts, dependencies, version control.
$excludeDirPatterns = @('\\node_modules\\', '\\\.git\\', '\\dist\\', '\\build\\')

# The core safe regex: standalone "Bhava"/"Bhāva" only, never glued to
# another word-character or hyphen.
$pattern = '(?<![\w-])Bh[āa]va(?![\w-])'

# Secondary heuristic: lines containing these tokens are more likely to be
# functional code even if the regex matched (e.g. a filename referenced
# inside an href, or a variable declared nearby on the same line).
$codeHints = @(
    'function ', 'const ', 'let ', 'var ', 'class=', 'className=',
    'localStorage', 'sessionStorage', '<script src=', 'href=', 'import ',
    'require(', 'window.', 'document.', '.js"', '.css"', 'src="', "src='"
)

$allFiles = Get-ChildItem -Path $RootPath -Recurse -File |
    Where-Object {
        $ext = $_.Extension.ToLower()
        $includeExtensions -contains $ext -and
        -not ($excludeDirPatterns | Where-Object { $_ -and ($_ -ne '') -and ($_ -match [regex]::Escape('')) }) # placeholder, real filter below
    }

# Apply directory exclusion properly (string-based, case-insensitive)
$allFiles = $allFiles | Where-Object {
    $full = $_.FullName
    -not ($full -match '\\node_modules\\') -and
    -not ($full -match '\\\.git\\') -and
    -not ($full -match '\\dist\\') -and
    -not ($full -match '\\build\\')
}

Write-Host "Found $($allFiles.Count) text-based files to scan..." -ForegroundColor Cyan

$results = New-Object System.Collections.Generic.List[object]
$fileCount = 0
$matchCount = 0

foreach ($file in $allFiles) {
    $fileCount++
    $lines = $null
    try {
        $lines = Get-Content -LiteralPath $file.FullName -Encoding UTF8 -ErrorAction Stop
    } catch {
        Write-Host "  SKIPPED (unreadable/binary): $($file.FullName)" -ForegroundColor DarkYellow
        continue
    }

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        $regexMatches = [regex]::Matches($line, $pattern)
        if ($regexMatches.Count -gt 0) {
            $looksLikeCode = $false
            foreach ($hint in $codeHints) {
                if ($line -like "*$hint*") { $looksLikeCode = $true; break }
            }

            foreach ($m in $regexMatches) {
                $matchCount++
                $trimmedLine = $line.Trim()
                if ($trimmedLine.Length -gt 200) {
                    $trimmedLine = $trimmedLine.Substring(0, 200) + " ...(truncated)"
                }
                $results.Add([PSCustomObject]@{
                    File           = $file.FullName.Replace($RootPath, '').TrimStart('\')
                    LineNumber     = $i + 1
                    MatchedText    = $m.Value
                    LooksLikeCode  = $looksLikeCode
                    LineContent    = $trimmedLine
                })
            }
        }
    }

    if ($fileCount % 25 -eq 0) {
        Write-Host "  ...scanned $fileCount / $($allFiles.Count) files" -ForegroundColor DarkGray
    }
}

$results | Export-Csv -Path $OutputCsv -NoTypeInformation -Encoding UTF8

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Scan complete. NO FILES WERE MODIFIED." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Files scanned:        $fileCount"
Write-Host "Total matches found:  $matchCount"
Write-Host "Flagged as code-risk: $(($results | Where-Object { $_.LooksLikeCode }).Count)"
Write-Host "Report saved to:      $OutputCsv"
Write-Host ""
Write-Host "Open the CSV in Excel and review every row before we write" -ForegroundColor Yellow
Write-Host "any script that actually changes files." -ForegroundColor Yellow
