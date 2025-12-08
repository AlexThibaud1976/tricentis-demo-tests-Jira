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

$auth = "${JiraUser}:${JiraApiToken}"

# 1. Update Test Execution title
Write-Host "`n[1/4] Updating Test Execution title..."
$titleUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"
$titleJson = "{`"fields`": {`"summary`": `"Test execution - device : $DeviceName`"}}"
& curl.exe -s -X PUT $titleUrl -u $auth -H "Accept: application/json" -H "Content-Type: application/json" -d $titleJson
Write-Host "Title updated for $ExecKey"

# 2. Attach HTML report
Write-Host "`n[2/4] Attaching HTML report..."
$htmlPath = "$ReportPath/index.html"
if (Test-Path $htmlPath) {
  $attachUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/attachments"
  & curl.exe -s -X POST $attachUrl -u $auth -H "X-Atlassian-Token: no-check" -F "file=@$htmlPath"
  Write-Host "HTML report attached"
} else {
  Write-Host "HTML report not found at $htmlPath"
}

# 3. Attach PDF report
Write-Host "`n[3/4] Attaching PDF report..."
$pdfPath = "$ReportPath/report.pdf"
if (Test-Path $pdfPath) {
  $attachUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/attachments"
  & curl.exe -s -X POST $attachUrl -u $auth -H "X-Atlassian-Token: no-check" -F "file=@$pdfPath"
  Write-Host "PDF report attached"
} else {
  Write-Host "PDF report not found at $pdfPath"
}

# 4. Add remote link to GitHub Actions
Write-Host "`n[4/4] Adding remote link to GitHub Actions..."
$linkUrl = "$JiraUrl/rest/api/3/issue/$ExecKey/remotelink"
$linkJson = "{`"object`": {`"url`": `"https://github.com/$GitHubRepository/actions/runs/$GitHubRunId`", `"title`": `"GitHub Actions Run #$GitHubRunNumber`"}}"
& curl.exe -s -X POST $linkUrl -u $auth -H "Accept: application/json" -H "Content-Type: application/json" -d $linkJson
Write-Host "Remote link added"

Write-Host "`n=============================================="
Write-Host "[Jira Post-Execution] Completed for $ExecKey"
Write-Host "=============================================="
