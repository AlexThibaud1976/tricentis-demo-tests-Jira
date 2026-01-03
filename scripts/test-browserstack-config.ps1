<#
.SYNOPSIS
    Script de test pour valider la configuration BrowserStack

.DESCRIPTION
    Permet de tester localement le script resolve-browserstack-config.js
    avec différentes combinaisons d'OS et de navigateurs avant de lancer
    un workflow GitHub Actions complet.

.PARAMETER OS
    Système d'exploitation (Windows ou Mac, par défaut: Windows)

.PARAMETER OSVersion
    Version du système d'exploitation (par défaut: 11)

.PARAMETER Browser
    Navigateur à tester (chrome, firefox, safari, edge, par défaut: chrome)

.PARAMETER BrowserVersion
    Version du navigateur (par défaut: latest)

.EXAMPLE
    .\test-browserstack-config.ps1 -OS "Mac" -OSVersion "Monterey" -Browser "safari" -BrowserVersion "latest"
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$OS = "Windows",
    
    [Parameter(Mandatory=$false)]
    [string]$OSVersion = "11",
    
    [Parameter(Mandatory=$false)]
    [string]$Browser = "chrome",
    
    [Parameter(Mandatory=$false)]
    [string]$BrowserVersion = "latest"
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Test Configuration BrowserStack" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Parametres:" -ForegroundColor Yellow
Write-Host "  OS: $OS"
Write-Host "  OS Version: $OSVersion"
Write-Host "  Browser: $Browser"
Write-Host "  Browser Version: $BrowserVersion"
Write-Host ""

Write-Host "Resolution de la configuration..." -ForegroundColor Yellow
Write-Host ""

$output = & node scripts/resolve-browserstack-config.js --os $OS --osVersion $OSVersion --browser $Browser --browserVersion $BrowserVersion 2>&1
Write-Host $output
