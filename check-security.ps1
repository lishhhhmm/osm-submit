# Pre-Commit Security Check Script

# This script helps verify no sensitive information will be committed

Write-Host "`n=== PRE-COMMIT SECURITY CHECK ===" -ForegroundColor Cyan

# Check for .env.local
Write-Host "`nChecking for .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $ignored = git check-ignore .env.local 2>$null
    if ($ignored) {
        Write-Host "✅ .env.local exists but is properly gitignored" -ForegroundColor Green
    } else {
        Write-Host "❌ WARNING: .env.local exists and is NOT gitignored!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️  .env.local not found (this is okay)" -ForegroundColor Gray
}

# Check what will be committed
Write-Host "`nFiles that will be committed:" -ForegroundColor Yellow
git status --short

# Check for common sensitive patterns
Write-Host "`nChecking for potential secrets..." -ForegroundColor Yellow
$patterns = @(
    "AIza",           # Google API keys
    "sk-",            # OpenAI keys
    "ghp_",           # GitHub tokens
    "gho_",           # GitHub OAuth
    "github_pat_",    # GitHub PAT
    "-----BEGIN"      # Private keys
)

$found = $false
foreach ($pattern in $patterns) {
    $results = git diff --cached | Select-String -Pattern $pattern -Quiet
    if ($results) {
        Write-Host "❌ WARNING: Found potential secret pattern: $pattern" -ForegroundColor Red
        $found = $true
    }
}

if (-not $found) {
    Write-Host "✅ No obvious secrets detected in staged files" -ForegroundColor Green
}

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Review the files above before committing." -ForegroundColor White
Write-Host "Make sure no sensitive information is included." -ForegroundColor White

Write-Host "`nIf everything looks good, proceed with:" -ForegroundColor Yellow
Write-Host "  git commit -m 'Your message'" -ForegroundColor Gray
Write-Host "  git push" -ForegroundColor Gray
Write-Host ""
