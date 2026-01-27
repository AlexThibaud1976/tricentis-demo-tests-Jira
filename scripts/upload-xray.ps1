<#
.SYNOPSIS
    Upload des résultats de tests au format JUnit vers Xray Cloud

.DESCRIPTION
    Ce script authentifie avec l'API Xray, puis upload un fichier JUnit XML
    pour créer une Test Execution dans Jira. Le script gère:
    - Authentification avec Xray Cloud via client_id/client_secret
    - Multipart upload du fichier results.xml
    - Association avec un Test Plan existant
    - Export de la clé de Test Execution créée

.PARAMETER IssueKey
    Clé du Test Plan Jira auquel associer les résultats (ex: DEMO-100)

.PARAMETER DeviceName
    Nom du device testé (optionnel, récupéré de $env:DEVICE_NAME)

.PARAMETER XrayEndpoint
    Point d'entrée de l'API Xray (par défaut: xray.cloud.getxray.app)

.PARAMETER JiraProjectKey
    Clé du projet Jira (ex: DEMO)

.OUTPUTS
    Exporte la variable exec_key contenant la clé de la Test Execution créée
#>

param(
  [Parameter(Mandatory = $true)][string]$IssueKey,
  [string]$DeviceName     = $env:DEVICE_NAME,
  [string]$XrayEndpoint   = $env:XRAY_ENDPOINT,
  [string]$JiraProjectKey = $env:JIRA_PROJECT_KEY
)

Write-Host "[Xray] Authentication..."

# Configuration des protocoles TLS pour assurer la compatibilité avec l'API Xray
# Force l'utilisation de TLS 1.2 ou 1.3 pour sécuriser les communications
try {
  $currentProtocols = [Net.ServicePointManager]::SecurityProtocol
  $tls12 = [Net.SecurityProtocolType]::Tls12
  $tls13 = $null
  try { $tls13 = [Enum]::Parse([Net.SecurityProtocolType], "Tls13") } catch {}
  if ($tls13) {
    [Net.ServicePointManager]::SecurityProtocol = $currentProtocols -bor $tls12 -bor $tls13
  } else {
    [Net.ServicePointManager]::SecurityProtocol = $currentProtocols -bor $tls12
  }
} catch {
  Write-Host "Warning: unable to force TLS1.2/1.3 ($($_.Exception.Message))"
}

$clientId     = $env:XRAY_CLIENT_ID
$clientSecret = $env:XRAY_CLIENT_SECRET
if (-not $clientId -or -not $clientSecret) {
  Write-Host "ERROR: XRAY_CLIENT_ID or XRAY_CLIENT_SECRET not provided in environment"
  exit 1
}

# Préparation des credentials pour l'authentification Xray
$authBodyObj = @{ client_id = $clientId; client_secret = $clientSecret }
$authBody    = $authBodyObj | ConvertTo-Json -Compress
$authUri     = "https://$XrayEndpoint/api/v2/authenticate"

# Fonction pour obtenir le token d'authentification Xray
function Get-XrayToken {
  param([string]$Uri, [string]$BodyJson)

  try {
    return Invoke-RestMethod -Uri $Uri -Method POST -ContentType "application/json" -Body $BodyJson -ErrorAction Stop
  } catch {
    Write-Host "Authentication request failed (Invoke-RestMethod): $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try {
        $s = $_.Exception.Response.GetResponseStream()
        if ($s) { $sr = New-Object IO.StreamReader($s); $b = $sr.ReadToEnd(); Write-Host "Authentication response body: $b" }
      } catch { Write-Host "Unable to read response body: $($_.Exception.Message)" }
    }
    return $null
  }
}

function Extract-XrayToken {
  param([object]$Response)

  if (-not $Response) { return $null }
  if ($Response -is [string]) { return $Response.Trim([char]34).Trim() }
  if ($Response -is [System.Management.Automation.PSCustomObject]) {
    if ($Response.token) { return "$($Response.token)".Trim() }
    if ($Response.jwt) { return "$($Response.jwt)".Trim() }
    return ($Response | ConvertTo-Json -Compress).Trim([char]34).Trim()
  }
  return $Response.ToString().Trim([char]34).Trim()
}

$authResponse = Get-XrayToken -Uri $authUri -BodyJson $authBody
$token = Extract-XrayToken -Response $authResponse

if (-not $token) {
  Write-Host "Auth response empty, retrying with Invoke-WebRequest..."
  try {
    $web = Invoke-WebRequest -Uri $authUri -Method POST -ContentType "application/json" -Body $authBody -UseBasicParsing -ErrorAction Stop
    $raw = $web.Content
    if ($null -eq $raw) { $raw = "" }
    Write-Host "Auth raw content length: $($raw.Length)"
    $token = $raw.Trim([char]34).Trim()
  } catch {
    Write-Host "Retry authentication failed (Invoke-WebRequest): $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try { $s = $_.Exception.Response.GetResponseStream(); if ($s) { $sr = New-Object IO.StreamReader($s); $b = $sr.ReadToEnd(); Write-Host "Authentication retry response body: $b" } } catch { Write-Host "Unable to read retry response body: $($_.Exception.Message)" }
    }
  }
}

if (-not $token) {
  $curlCommand = $null
  foreach ($cmdName in @("curl.exe", "curl")) {
    $cmd = Get-Command $cmdName -ErrorAction SilentlyContinue
    if ($cmd) { $curlCommand = $cmd.Source; break }
  }

  if ($curlCommand) {
    Write-Host "Auth still empty, retrying with $curlCommand..."
    try {
      $curlOutput = & $curlCommand -s -H "Content-Type: application/json" -X POST -d $authBody $authUri 2>$null
      $curlExit = $LASTEXITCODE
      if ($null -eq $curlOutput) { $curlOutput = "" }
      Write-Host "curl auth exit code: $curlExit; content length: $($curlOutput.Length)"
      $token = $curlOutput.Trim([char]34).Trim()
    } catch {
      Write-Host "curl authentication failed: $($_.Exception.Message)"
    }
  } else {
    Write-Host "curl command not found; skipping curl fallback"
  }
}

if (-not $token) {
  Write-Host "ERROR: token is empty after authentication. Aborting upload to Xray."
  exit 1
}

Write-Host "Token length: $($token.Length) characters"

Write-Host "[Xray] Importing JUnit results..."

# Vérifier l'existence du nouveau fichier généré par le reporter Xray
if (-not (Test-Path "xray-report.xml")) {
  Write-Host "ERROR: xray-report.xml not found in workspace"
  Write-Host "Note: Ce fichier est généré par @xray-app/playwright-junit-reporter"
  exit 1
}

$junitContent = Get-Content -Path "xray-report.xml" -Raw
Write-Host "xray-report.xml size: $($junitContent.Length) characters"
if ($junitContent.Length -gt 0) {
    Write-Host "xray-report.xml preview (first 200 chars):"
    Write-Host $junitContent.Substring(0, [Math]::Min(200, $junitContent.Length))
} else {
    Write-Host "ERROR: xray-report.xml is empty"
    exit 1
}

$importUri = "https://$XrayEndpoint/api/v2/import/execution/junit?projectKey=$JiraProjectKey&testPlanKey=$IssueKey"
Write-Host "Import URI: $importUri"

try {
  $response = Invoke-RestMethod -Uri $importUri `
    -Method POST -ContentType "text/xml" -Headers @{ "Authorization" = "Bearer $token" } -Body $junitContent -ErrorAction Stop
} catch {
  Write-Host "Import request failed: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    try { 
        $s = $_.Exception.Response.GetResponseStream()
        if ($s) { 
            $sr = New-Object IO.StreamReader($s)
            $b = $sr.ReadToEnd()
            Write-Host "Import response body: $b" 
        }
    } catch { 
        Write-Host "Unable to read import response body: $($_.Exception.Message)" 
    }
  }
  
  # Fallback to curl if Invoke-RestMethod fails, to see if we get better info or if it works
  $curlCommand = $null
  foreach ($cmdName in @("curl.exe", "curl")) {
    $cmd = Get-Command $cmdName -ErrorAction SilentlyContinue
    if ($cmd) { $curlCommand = $cmd.Source; break }
  }

  if ($curlCommand) {
    Write-Host "Retrying import with $curlCommand..."
    # Note: curl expects file path with @ for binary/file data in --data-binary or --data, but for raw body we can pipe or use file
    # Using --data @xray-report.xml is standard for curl
    try {
        # We need to pass the token. 
        # Note: Windows curl might be alias to Invoke-WebRequest in PS, but we found the exe above.
        $curlArgs = @(
            "-s",
            "-H", "Content-Type: text/xml",
            "-H", "Authorization: Bearer $token",
            "-X", "POST",
            "--data", "@xray-report.xml",
            "$importUri"
        )
        $curlOutput = & $curlCommand $curlArgs
        Write-Host "curl output: $curlOutput"
        # If curl succeeds, we might want to parse the output to get the key
        if ($curlOutput -match '"key"\s*:\s*"([^"]+)"') {
             $response = @{ key = $matches[1] }
             Write-Host "Recovered key from curl: $($response.key)"
        } else {
             exit 1
        }
    } catch {
        Write-Host "curl retry failed: $($_.Exception.Message)"
        exit 1
    }
  } else {
      exit 1
  }
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
