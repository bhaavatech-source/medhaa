# ============================================================
# Bhava HTML Diagnostic Script
# Scans every index.html under games-static for the known
# copy-paste corruption patterns (orphan </script>, duplicate
# </body></html>, and wrong document.title override)
# ============================================================

$gamesRoot = "E:\medhaa\apps\web\public\games-static"

$htmlFiles = Get-ChildItem -Path $gamesRoot -Filter "index.html" -Recurse

Write-Host "Scanning $($htmlFiles.Count) index.html file(s)...`n" -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $issues = @()

    # Check 1: orphan closing </script> right after game.js with nothing between
    if ($content -match '<script src="game\.js"><\/script>\s*\r?\n\s*<\/script>') {
        $issues += "Orphan </script> tag after game.js"
    }

    # Check 2: duplicate closing body/html tags
    $bodyCloseCount = ([regex]::Matches($content, '<\/body>')).Count
    $htmlCloseCount = ([regex]::Matches($content, '<\/html>')).Count
    if ($bodyCloseCount -gt 1 -or $htmlCloseCount -gt 1) {
        $issues += "Duplicate closing tags (body:$bodyCloseCount html:$htmlCloseCount)"
    }

    # Check 3: document.title override doesn't match <title> tag content
    $titleTagMatch = [regex]::Match($content, '<title>(.*?)<\/title>')
    $titleScriptMatch = [regex]::Match($content, 'document\.title\s*=\s*"([^"]*)"')
    if ($titleTagMatch.Success -and $titleScriptMatch.Success) {
        $t1 = $titleTagMatch.Groups[1].Value.Trim()
        $t2 = $titleScriptMatch.Groups[1].Value.Trim()
        if ($t1 -ne $t2) {
            $issues += "Title mismatch: <title> says '$t1' but script sets '$t2'"
        }
    }

    if ($issues.Count -gt 0) {
        Write-Host "[ISSUE] $($file.FullName)" -ForegroundColor Yellow
        foreach ($i in $issues) {
            Write-Host "    - $i" -ForegroundColor Red
        }
        Write-Host ""
    }
}

Write-Host "Scan complete." -ForegroundColor Cyan
