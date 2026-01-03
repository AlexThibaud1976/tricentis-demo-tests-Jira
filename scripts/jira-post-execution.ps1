<#
.SYNOPSIS
    Post-traitement Jira après exécution des tests Playwright

.DESCRIPTION
    Ce script enrichit une Test Execution Jira avec:
    - Champs personnalisés (OS, Browser, Version, Test Scope)
    - Label du device testé
    - Titre descriptif de l'exécution
    - Rapport HTML en pièce jointe
    - Liens vers GitHub Actions et BrowserStack

.PARAMETER ExecKey
    Clé Jira de la Test Execution (ex: DEMO-123)

.PARAMETER DeviceName
    Nom du device/configuration testée (ex: win-11-chrome-latest)

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
Write-Host "=============================================="

# Préparation de l'authentification Basic Auth pour l'API Jira
$basicAuth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${JiraUser}:${JiraApiToken}"))
$jsonHeaders = @{ Authorization = "Basic $basicAuth"; Accept = "application/json" }

# 1. Add custom fields (OS, OS Version, Browser, Browser Version, Test Scope)
Write-Host "`n[1/6] Updating custom fields..."
$customFieldsUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"

$customFieldsObj = @{ fields = @{} }

# Add custom fields if environment variables are set
if ($env:JIRA_CUSTOM_FIELD_OS -and $env:BS_OS) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS] = $env:BS_OS
}
if ($env:JIRA_CUSTOM_FIELD_OS_VERSION -and $env:BS_OS_VERSION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS_VERSION] = $env:BS_OS_VERSION
}
if ($env:JIRA_CUSTOM_FIELD_BROWSER -and $env:BS_BROWSER) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_BROWSER] = $env:BS_BROWSER
}
if ($env:JIRA_CUSTOM_FIELD_BROWSER_VERSION -and $env:BS_BROWSER_VERSION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_BROWSER_VERSION] = $env:BS_BROWSER_VERSION
}
if ($env:JIRA_CUSTOM_FIELD_TEST_SCOPE -and $TestScope) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_TEST_SCOPE] = $TestScope
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

# 2. Ajout d'un label pour identifier la configuration testée
# Permet de filtrer les Test Executions par device dans Jira
Write-Host "`n[2/6] Adding device label..."
$labelUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$labelJson = "{`"fields`": {`"labels`": [`"$DeviceName`"]}}"
try {
  Invoke-RestMethod -Method Put -Uri $labelUrl -Headers $jsonHeaders -ContentType "application/json" -Body $labelJson | Out-Null
  Write-Host "Label '$DeviceName' added to $ExecKey"
} catch {
  Write-Host "Warning: Could not add label - $($_.Exception.Message)"
}

# 3. Update Test Execution title
Write-Host "`n[3/6] Updating Test Execution title..."
$titleUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$titleJson = "{`"fields`": {`"summary`": `"Test execution - $TestScope - device : $DeviceName`"}}"
Invoke-RestMethod -Method Put -Uri $titleUrl -Headers $jsonHeaders -ContentType "application/json" -Body $titleJson | Out-Null
Write-Host "Title updated for $ExecKey"

# 4. Attach HTML report
Write-Host "`n[4/6] Attaching HTML report..."
$htmlPath = "$ReportPath/index.html"
if (Test-Path $htmlPath) {
  $attachUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/attachments"
  $attachHeaders = @{ Authorization = "Basic $basicAuth"; "X-Atlassian-Token" = "no-check" }
  Invoke-WebRequest -Method Post -Uri $attachUrl -Headers $attachHeaders -Form @{ file = (Get-Item $htmlPath) } | Out-Null
  Write-Host "HTML report attached"
} else {
  Write-Host "HTML report not found at $htmlPath"
}

# 5. Add remote link to GitHub Actions
Write-Host "`n[5/6] Adding remote link to GitHub Actions..."
$linkUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/remotelink"
$linkJson = "{`"object`": {`"url`": `"https://github.com/$GitHubRepository/actions/runs/$GitHubRunId`", `"title`": `"GitHub Actions Run #$GitHubRunNumber`"}}"
Invoke-RestMethod -Method Post -Uri $linkUrl -Headers $jsonHeaders -ContentType "application/json" -Body $linkJson | Out-Null
Write-Host "Remote link added"

# 6. Add remote link to BrowserStack build (optional)
if ($BrowserStackBuildUrl) {
  Write-Host "`n[6/6] Adding remote link to BrowserStack build..."
  $bsLinkUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/remotelink"
  $bsLinkJson = "{`"object`": {`"url`": `"$BrowserStackBuildUrl`", `"title`": `"BrowserStack Build`"}}"
  Invoke-RestMethod -Method Post -Uri $bsLinkUrl -Headers $jsonHeaders -ContentType "application/json" -Body $bsLinkJson | Out-Null
  Write-Host "BrowserStack build link added"
} else {
  Write-Host "BrowserStack build URL not provided, skipping"
}

Write-Host "`n=============================================="
Write-Host "[Jira Post-Execution] Completed for $ExecKey"
Write-Host "=============================================="
