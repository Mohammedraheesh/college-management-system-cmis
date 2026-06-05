# College Management Information System (CMIS) GitHub Pusher Script
# This script guides you to push your project to GitHub.

Clear-Host
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "                  PUSH CMIS PROJECT TO GITHUB                    " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# Verify git remote configuration
$ExistingRemote = git remote get-url origin 2>$null
if ($ExistingRemote) {
    Write-Host "Current Remote URL: $ExistingRemote" -ForegroundColor Green
    $Change = Read-Host "Do you want to change this URL? (y/n)"
    if ($Change -eq 'y') {
        git remote remove origin
        $ExistingRemote = $null
    }
}

if (-not $ExistingRemote) {
    Write-Host "1. Please go to https://github.com/new and create a blank repository." -ForegroundColor Gray
    Write-Host "2. Copy the HTTPS repository URL (e.g. https://github.com/username/repo.git)" -ForegroundColor Gray
    Write-Host ""
    $RepoUrl = Read-Host "Paste your GitHub Repository URL"
    if (-not $RepoUrl) {
        Write-Host "Error: No URL provided. Action aborted." -ForegroundColor Red
        Write-Host "Press enter to exit."
        Read-Host
        Exit
    }
    git remote add origin $RepoUrl.Trim()
    Write-Host "✔ Linked project to remote URL: $RepoUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Renaming local branch to 'main'..." -ForegroundColor Yellow
git branch -M main

Write-Host "Pushing code to GitHub (this will trigger Windows Git login helper)..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "✔ Finished attempting to push! Please check your GitHub page." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Press enter to exit."
Read-Host
