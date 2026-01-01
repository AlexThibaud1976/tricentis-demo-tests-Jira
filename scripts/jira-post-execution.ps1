param(
  [Parameter(Mandatory = $true)][string]$ExecKey,
  [Parameter(Mandatory = $true)][string]$DeviceName,
  [Parameter(Mandatory = $true)][string]$JiraUrl,
  [Parameter(Mandatory = $true)][string]$JiraUser,
  [Parameter(Mandatory = $true)][string]$JiraApiToken,
  [Parameter(Mandatory = $true)][string]$GitHubRepository,
  [Parameter(Mandatory = $true)][string]$GitHubRunId,
  [Parameter(Mandatory = $true)][string]$GitHubRunNumber,
  [string]$ReportPath = "playwright-report"
)

Write-Host "=============================================="
Write-Host "[Jira Post-Execution] Starting for $ExecKey"
Write-Host "=============================================="

$basicAuth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${JiraUser}:${JiraApiToken}"))
$jsonHeaders = @{ Authorization = "Basic $basicAuth"; Accept = "application/json" }

# 1. Add label for device/environment
Write-Host "`n[1/5] Adding device label..."
$labelUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$labelJson = "{`"fields`": {`"labels`": [`"$DeviceName`"]}}"
try {
  Invoke-RestMethod -Method Put -Uri $labelUrl -Headers $jsonHeaders -ContentType "application/json" -Body $labelJson | Out-Null
  Write-Host "Label '$DeviceName' added to $ExecKey"
} catch {
  Write-Host "Warning: Could not add label - $($_.Exception.Message)"
}

# 2. Update Test Execution title
Write-Host "`n[2/5] Updating Test Execution title..."
$titleUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$titleJson = "{`"fields`": {`"summary`": `"Test execution - device : $DeviceName`"}}"
Invoke-RestMethod -Method Put -Uri $titleUrl -Headers $jsonHeaders -ContentType "application/json" -Body $titleJson | Out-Null
Write-Host "Title updated for $ExecKey"

# 3. Attach HTML report
Write-Host "`n[3/5] Attaching HTML report..."
$htmlPath = "$ReportPath/index.html"
if (Test-Path $htmlPath) {
  $attachUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/attachments"
  $attachHeaders = @{ Authorization = "Basic $basicAuth"; "X-Atlassian-Token" = "no-check" }
  Invoke-WebRequest -Method Post -Uri $attachUrl -Headers $attachHeaders -Form @{ file = (Get-Item $htmlPath) } | Out-Null
  Write-Host "HTML report attached"
} else {
  Write-Host "HTML report not found at $htmlPath"
}

# 4. Attach PDF report
Write-Host "`n[4/5] Attaching PDF report..."
$pdfPath = "$ReportPath/report.pdf"
if (Test-Path $pdfPath) {
  $attachUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/attachments"
  $attachHeaders = @{ Authorization = "Basic $basicAuth"; "X-Atlassian-Token" = "no-check" }
  Invoke-WebRequest -Method Post -Uri $attachUrl -Headers $attachHeaders -Form @{ file = (Get-Item $pdfPath) } | Out-Null
  Write-Host "PDF report attached"
} else {
  Write-Host "PDF report not found at $pdfPath"
}

# 5. Add remote link to GitHub Actions
Write-Host "`n[5/5] Adding remote link to GitHub Actions..."
$linkUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/remotelink"
$linkJson = "{`"object`": {`"url`": `"https://github.com/$GitHubRepository/actions/runs/$GitHubRunId`", `"title`": `"GitHub Actions Run #$GitHubRunNumber`"}}"
Invoke-RestMethod -Method Post -Uri $linkUrl -Headers $jsonHeaders -ContentType "application/json" -Body $linkJson | Out-Null
Write-Host "Remote link added"

Write-Host "`n=============================================="
Write-Host "[Jira Post-Execution] Completed for $ExecKey"
Write-Host "=============================================="
