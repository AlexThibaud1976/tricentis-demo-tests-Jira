param(
  [Parameter(Mandatory = $true)][string]$IssueKey,
  [string]$DeviceName     = $env:DEVICE_NAME,
  [string]$XrayEndpoint   = $env:XRAY_ENDPOINT,
  [string]$JiraProjectKey = $env:JIRA_PROJECT_KEY
)

Write-Host "🔐 Authentification Xray..."

$clientId     = $env:XRAY_CLIENT_ID
$clientSecret = $env:XRAY_CLIENT_SECRET
if (-not $clientId -or -not $clientSecret) {
  Write-Host "ERROR: XRAY_CLIENT_ID or XRAY_CLIENT_SECRET not provided in environment"
  exit 1
}

$authBodyObj = @{ client_id = $clientId; client_secret = $clientSecret }
$authBody    = $authBodyObj | ConvertTo-Json -Compress

function Get-XrayToken {
  param([string]$Endpoint, [string]$BodyJson)

  try {
    $resp = Invoke-RestMethod -Uri "https://$Endpoint/api/v2/authenticate" `
      -Method POST -ContentType "application/json" -Body $BodyJson -ErrorAction Stop
    return $resp
  } catch {
    Write-Host "Authentication request failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try {
        $s = $_.Exception.Response.GetResponseStream()
        if ($s) { $sr = New-Object IO.StreamReader($s); $b = $sr.ReadToEnd(); Write-Host "Authentication response body: $b" }
      } catch { Write-Host "Unable to read response body: $($_.Exception.Message)" }
    }
    return $null
  }
}

$authResponse = Get-XrayToken -Endpoint $XrayEndpoint -BodyJson $authBody

if ($authResponse) {
  try { $typeName = $authResponse.GetType().FullName } catch { $typeName = "(unknown)" }
  Write-Host "AuthResponse type: $typeName"
  try { $authJson = $authResponse | ConvertTo-Json -Compress; Write-Host "AuthResponse JSON: $authJson" } catch { Write-Host "AuthResponse could not be converted to JSON" }
}

if (-not $authResponse) {
  Write-Host "Auth response empty, retrying with Invoke-WebRequest to capture raw body..."
  try {
    $web = Invoke-WebRequest -Uri "https://$XrayEndpoint/api/v2/authenticate" -Method POST -ContentType "application/json" -Body $authBody -UseBasicParsing -ErrorAction Stop
    $raw = $web.Content
    Write-Host "Auth raw content length: $($raw.Length)"
    Write-Host "Auth raw content: $raw"
    $token = $raw.Trim([char]34)
  } catch {
    Write-Host "Retry authentication failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try { $s = $_.Exception.Response.GetResponseStream(); if ($s) { $sr = New-Object IO.StreamReader($s); $b = $sr.ReadToEnd(); Write-Host "Authentication retry response body: $b" } } catch { Write-Host "Unable to read retry response body: $($_.Exception.Message)" }
    }
    exit 1
  }
} else {
  if ($authResponse -is [string]) {
    $token = $authResponse.Trim([char]34)
  } elseif ($authResponse -is [System.Management.Automation.PSCustomObject]) {
    if ($authResponse.token) { $token = $authResponse.token }
    elseif ($authResponse.jwt) { $token = $authResponse.jwt }
    else { $token = ($authResponse | ConvertTo-Json -Compress).Trim([char]34) }
  } else {
    $token = $authResponse.ToString().Trim([char]34)
  }
}

if (-not $token) {
  Write-Host "ERROR: token is empty after authentication. Aborting upload to Xray."
  exit 1
}

Write-Host "Token length: $($token.Length) characters"

Write-Host "📤 Import des résultats JUnit..."

if (-not (Test-Path "results.xml")) {
  Write-Host "ERROR: results.xml not found in workspace"
  exit 1
}

$junitContent = Get-Content -Path "results.xml" -Raw

try {
  $response = Invoke-RestMethod -Uri "https://$XrayEndpoint/api/v2/import/execution/junit?projectKey=$JiraProjectKey&testPlanKey=$IssueKey&testEnvironments=$DeviceName" `
    -Method POST -ContentType "text/xml" -Headers @{ "Authorization" = "Bearer $token" } -Body $junitContent -ErrorAction Stop
} catch {
  Write-Host "Import request failed: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    try { $s = $_.Exception.Response.GetResponseStream(); if ($s) { $sr = New-Object IO.StreamReader($s); $b = $sr.ReadToEnd(); Write-Host "Import response body: $b" } } catch { Write-Host "Unable to read import response body: $($_.Exception.Message)" }
  }
  exit 1
}

Write-Host "Response: $($response | ConvertTo-Json)"

$execKey = $response.key
Write-Host "Test Execution Key: $execKey"

if ($env:GITHUB_OUTPUT) {
  Add-Content -Path $env:GITHUB_OUTPUT -Value "exec_key=$execKey"
} else {
  Write-Host "GITHUB_OUTPUT not set; printing exec_key to stdout: exec_key=$execKey"
  Write-Host "exec_key=$execKey"
}
