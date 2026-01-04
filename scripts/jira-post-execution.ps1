<#
.SYNOPSIS
    Post-traitement Jira après exécution des tests Playwright

.DESCRIPTION
    Ce script enrichit une Test Execution Jira avec:
    - Champs personnalisés (OS, Browser, Version, Test Scope)
    - Label du device testé + résultat (PASS/FAIL)
    - Titre descriptif de l'exécution avec emoji
    - Rapport HTML en pièce jointe
    - Liens vers GitHub Actions et BrowserStack

.PARAMETER ExecKey
    Clé Jira de la Test Execution (ex: DEMO-123)

.PARAMETER DeviceName
    Nom du device/configuration testée (ex: win-11-chrome-latest)

.PARAMETER TestResult
    Résultat des tests (PASS ou FAIL)

.PARAMETER JiraUrl
    URL de base Jira (ex: https://votredomaine.atlassian.net)

.PARAMETER JiraUser
    Email de l'utilisateur Jira

.PARAMETER JiraApiToken
    Token API Jira pour l'authentification

.PARAMETER GitHubRepository
    Nom du repository GitHub (format: owner/repo)

.PARAMETER GitHubRunId
    ID de l'exécution GitHub Actions

.PARAMETER GitHubRunNumber
    Numéro de l'exécution GitHub Actions

.PARAMETER BrowserStackBuildUrl
    (Optionnel) URL du build BrowserStack

.PARAMETER TestScope
    Périmètre de test exécuté (par défaut: All Tests)

.PARAMETER ReportPath
    Chemin du dossier contenant les rapports (par défaut: playwright-report)
#>

param(
  [Parameter(Mandatory = $true)][string]$ExecKey,
  [Parameter(Mandatory = $true)][string]$DeviceName,
  [Parameter(Mandatory = $false)][string]$TestResult = "UNKNOWN",
  [Parameter(Mandatory = $true)][string]$JiraUrl,
  [Parameter(Mandatory = $true)][string]$JiraUser,
  [Parameter(Mandatory = $true)][string]$JiraApiToken,
  [Parameter(Mandatory = $true)][string]$GitHubRepository,
  [Parameter(Mandatory = $true)][string]$GitHubRunId,
  [Parameter(Mandatory = $true)][string]$GitHubRunNumber,
  [string]$BrowserStackBuildUrl = "",
  [string]$TestScope = "All Tests",
  [string]$ReportPath = "playwright-report"
)

Write-Host "=============================================="
Write-Host "[Jira Post-Execution] Starting for $ExecKey"
Write-Host "Device: $DeviceName"
Write-Host "Test Result: $TestResult"
Write-Host "Test Scope: $TestScope"
Write-Host "=============================================="

# Préparation de l'authentification Basic Auth pour l'API Jira
$basicAuth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${JiraUser}:${JiraApiToken}"))
$jsonHeaders = @{ Authorization = "Basic $basicAuth"; Accept = "application/json" }

# 1. Add custom fields (OS, OS Version, Browser, Browser Version, Test Scope)
Write-Host "`n[1/7] Updating custom fields..."
$customFieldsUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"

$customFieldsObj = @{ fields = @{} }

# Add custom fields if environment variables are set
if ($env:JIRA_CUSTOM_FIELD_OS -and $env:BS_OS) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS] = $env:BS_OS
  Write-Host "  - OS: $($env:BS_OS)"
}
if ($env:JIRA_CUSTOM_FIELD_OS_VERSION -and $env:BS_OS_VERSION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS_VERSION] = $env:BS_OS_VERSION
  Write-Host "  - OS Version: $($env:BS_OS_VERSION)"
}
if ($env:JIRA_CUSTOM_FIELD_BROWSER -and $env:BS_BROWSER) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_BROWSER] = $env:BS_BROWSER
  Write-Host "  - Browser: $($env:BS_BROWSER)"
}
if ($env:JIRA_CUSTOM_FIELD_BROWSER_VERSION -and $env:BS_BROWSER_VERSION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_BROWSER_VERSION] = $env:BS_BROWSER_VERSION
  Write-Host "  - Browser Version: $($env:BS_BROWSER_VERSION)"
}
if ($env:JIRA_CUSTOM_FIELD_TEST_SCOPE -and $TestScope) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_TEST_SCOPE] = $TestScope
  Write-Host "  - Test Scope: $TestScope"
}

if ($customFieldsObj.fields.Count -gt 0) {
  $customFieldsJson = $customFieldsObj | ConvertTo-Json
  try {
    Invoke-RestMethod -Method Put -Uri $customFieldsUrl -Headers $jsonHeaders `
      -ContentType "application/json" -Body $customFieldsJson | Out-Null
    Write-Host "Custom fields updated successfully"
  } catch {
    Write-Host "Warning: Could not update custom fields - $($_.Exception.Message)"
  }
} else {
  Write-Host "Custom field environment variables not set (optional)"
}

# 2. Ajout des labels : device name + résultat (PASS/FAIL)
Write-Host "`n[2/7] Adding labels (device + result)..."
$labelUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$labelsArray = @($DeviceName, $TestResult)
$labelsJson = $labelsArray | ConvertTo-Json
$labelBodyJson = "{`"fields`": {`"labels`": $labelsJson}}"
try {
  Invoke-RestMethod -Method Put -Uri $labelUrl -Headers $jsonHeaders -ContentType "application/json" -Body $labelBodyJson | Out-Null
  Write-Host "Labels added: $DeviceName, $TestResult"
} catch {
  Write-Host "Warning: Could not add labels - $($_.Exception.Message)"
}

# 3. Update Test Execution title with result emoji
Write-Host "`n[3/7] Updating Test Execution title..."
$titleUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$resultEmoji = if ($TestResult -eq "PASS") { "✅" } elseif ($TestResult -eq "FAIL") { "❌" } else { "⚪" }
$newTitle = "$resultEmoji Test execution - $TestScope - device : $DeviceName"
$titleBodyObj = @{
  fields = @{
    summary = $newTitle
  }
}
$titleJson = $titleBodyObj | ConvertTo-Json
try {
  Invoke-RestMethod -Method Put -Uri $titleUrl -Headers $jsonHeaders -ContentType "application/json" -Body $titleJson | Out-Null
  Write-Host "Title updated: $newTitle"
} catch {
  Write-Host "Warning: Could not update title - $($_.Exception.Message)"
}

# 4. Attach HTML report
Write-Host "`n[4/7] Attaching HTML report..."
$htmlPath = "$ReportPath/index.html"
if (Test-Path $htmlPath) {
  $attachUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/attachments"
  $attachHeaders = @{ Authorization = "Basic $basicAuth"; "X-Atlassian-Token" = "no-check" }
  try {
    Invoke-WebRequest -Method Post -Uri $attachUrl -Headers $attachHeaders -Form @{ file = (Get-Item $htmlPath) } | Out-Null
    Write-Host "HTML report attached successfully"
  } catch {
    Write-Host "Warning: Could not attach HTML report - $($_.Exception.Message)"
  }
} else {
  Write-Host "HTML report not found at $htmlPath"
}

# 5. Add remote link to GitHub Actions
Write-Host "`n[5/7] Adding remote link to GitHub Actions..."
$linkUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/remotelink"
$ghLinkObj = @{
  object = @{
    url = "https://github.com/$GitHubRepository/actions/runs/$GitHubRunId"
    title = "GitHub Actions Run #$GitHubRunNumber"
    icon = @{
      url16x16 = "https://github.githubassets.com/favicons/favicon.png"
      title = "GitHub Actions"
    }
  }
}
$ghLinkJson = $ghLinkObj | ConvertTo-Json -Depth 4
try {
  Invoke-RestMethod -Method Post -Uri $linkUrl -Headers $jsonHeaders -ContentType "application/json" -Body $ghLinkJson | Out-Null
  Write-Host "GitHub Actions link added"
} catch {
  Write-Host "Warning: Could not add GitHub link - $($_.Exception.Message)"
}

# 6. Add remote link to BrowserStack build (optional)
if ($BrowserStackBuildUrl -and $BrowserStackBuildUrl -ne "") {
  Write-Host "`n[6/7] Adding remote link to BrowserStack build..."
  $bsLinkObj = @{
    object = @{
      url = $BrowserStackBuildUrl
      title = "BrowserStack Build"
      icon = @{
        url16x16 = "https://www.browserstack.com/favicon.ico"
        title = "BrowserStack"
      }
    }
  }
  $bsLinkJson = $bsLinkObj | ConvertTo-Json -Depth 4
  try {
    Invoke-RestMethod -Method Post -Uri $linkUrl -Headers $jsonHeaders -ContentType "application/json" -Body $bsLinkJson | Out-Null
    Write-Host "BrowserStack build link added"
  } catch {
    Write-Host "Warning: Could not add BrowserStack link - $($_.Exception.Message)"
  }
} else {
  Write-Host "`n[6/7] BrowserStack build URL not provided, skipping"
}

# 7. Summary
Write-Host "`n[7/7] Post-execution complete!"
Write-Host "=============================================="
Write-Host "[Jira Post-Execution] Completed for $ExecKey"
Write-Host "Result: $resultEmoji $TestResult"
Write-Host "View: $JiraUrl/browse/$ExecKey"
Write-Host "=============================================="