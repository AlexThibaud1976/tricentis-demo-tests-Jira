param(
  [Parameter(Mandatory = $true)][string]$JiraUrl,
  [Parameter(Mandatory = $true)][string]$JiraUser,
  [Parameter(Mandatory = $true)][string]$JiraApiToken
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "JIRA CUSTOM FIELDS ID RETRIEVER" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Setup TLS
try {
  $currentProtocols = [Net.ServicePointManager]::SecurityProtocol
  $tls12 = [Net.SecurityProtocolType]::Tls12
  [Net.ServicePointManager]::SecurityProtocol = $currentProtocols -bor $tls12
} catch {}

# Create Basic Auth header
$credPair = "$JiraUser`:$JiraApiToken"
$encodedCred = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{ Authorization = "Basic $encodedCred" }

Write-Host "Fetching custom fields from Jira..." -ForegroundColor Yellow

try {
  $response = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/field" -Method GET -Headers $headers -ErrorAction Stop
  
  Write-Host ""
  Write-Host "Custom fields related to OS and Browser:" -ForegroundColor Green
  Write-Host ""
  
  $filteredFields = $response | Where-Object { 
    $_.name -match "OS|Browser" -and $_.custom -eq $true
  }
  
  if ($filteredFields.Count -eq 0) {
    Write-Host "[!] No custom fields found with 'OS' or 'Browser' in the name"
    Write-Host ""
    Write-Host "Available custom fields:" -ForegroundColor Yellow
    $response | Where-Object { $_.custom -eq $true } | ForEach-Object {
      Write-Host "  - $($_.name) : $($_.id)" -ForegroundColor Gray
    }
  } else {
    $filteredFields | ForEach-Object {
      Write-Host "  [OK] $($_.name)" -ForegroundColor Green
      Write-Host "       ID: $($_.id)" -ForegroundColor Cyan
      Write-Host ""
    }
  }
  
  Write-Host "=======================================================" -ForegroundColor Cyan
  Write-Host "How to use these IDs:" -ForegroundColor Cyan
  Write-Host "=======================================================" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "1. Add these as GitHub Secrets:" -ForegroundColor Yellow
  Write-Host "   - JIRA_CUSTOM_FIELD_OS = [ID]"
  Write-Host "   - JIRA_CUSTOM_FIELD_OS_VERSION = [ID]"
  Write-Host "   - JIRA_CUSTOM_FIELD_BROWSER = [ID]"
  Write-Host "   - JIRA_CUSTOM_FIELD_BROWSER_VERSION = [ID]"
  Write-Host ""
  Write-Host "2. Go to:" -ForegroundColor Yellow
  Write-Host "   GitHub Repo - Settings - Secrets and variables - Actions"
  Write-Host ""
  Write-Host "3. Add new secrets with the IDs found above"
  Write-Host ""
  
} catch {
  Write-Host "[ERROR] Connection failed to Jira: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
  Write-Host "Possible causes:" -ForegroundColor Yellow
  Write-Host "  - Jira URL is incorrect"
  Write-Host "  - Credentials are wrong"
  Write-Host "  - User doesn't have permission to list fields"
  exit 1
}
