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
