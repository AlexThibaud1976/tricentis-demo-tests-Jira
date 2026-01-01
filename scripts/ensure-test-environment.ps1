param(
  [Parameter(Mandatory = $true)][string]$EnvironmentName,
  [string]$XrayEndpoint    = $env:XRAY_ENDPOINT,
  [string]$JiraUrl         = $env:JIRA_URL,
  [string]$JiraUser        = $env:JIRA_USER,
  [string]$JiraApiToken    = $env:JIRA_API_TOKEN,
  [string]$XrayClientId    = $env:XRAY_CLIENT_ID,
  [string]$XrayClientSecret = $env:XRAY_CLIENT_SECRET
)

Write-Host "[TestEnvironment] Ensuring environment exists: $EnvironmentName"

# Setup TLS
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

# Get Xray token
function Get-XrayToken {
  param([string]$Endpoint, [string]$ClientId, [string]$ClientSecret)
  
  $authBody = @{ client_id = $ClientId; client_secret = $ClientSecret } | ConvertTo-Json -Compress
  $authUri = "https://$Endpoint/api/v2/authenticate"
  
  try {
    $response = Invoke-RestMethod -Uri $authUri -Method POST -ContentType "application/json" -Body $authBody -ErrorAction Stop
    if ($response -is [string]) {
      return $response.Trim([char]34).Trim()
    } elseif ($response.token) {
      return $response.token
    } elseif ($response.jwt) {
      return $response.jwt
    }
    return $response
  } catch {
    Write-Host "ERROR: Failed to authenticate with Xray: $($_.Exception.Message)"
    return $null
  }
}

# Get Jira token (Basic Auth)
function Get-JiraToken {
  param([string]$User, [string]$ApiToken)
  
  $credPair = "$User`:$ApiToken"
  $encodedCred = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
  return "Basic $encodedCred"
}

# Check if environment exists using Jira API
function Test-EnvironmentExists {
  param([string]$JiraUrl, [string]$AuthToken, [string]$EnvironmentName)
  
  $uri = "$JiraUrl/rest/api/3/environments?search=$([System.Uri]::EscapeDataString($EnvironmentName))"
  
  try {
    $response = Invoke-RestMethod -Uri $uri -Method GET -Headers @{ Authorization = $AuthToken } -ErrorAction Stop
    
    if ($response.values) {
      foreach ($env in $response.values) {
        if ($env.name -eq $EnvironmentName) {
          Write-Host "✓ Environment already exists: $EnvironmentName (ID: $($env.id))"
          return $true
        }
      }
    }
    return $false
  } catch {
    Write-Host "Warning: Could not check if environment exists: $($_.Exception.Message)"
    # If we can't check, we'll try to create it anyway
    return $false
  }
}

# Create environment in Jira
function New-JiraEnvironment {
  param([string]$JiraUrl, [string]$AuthToken, [string]$EnvironmentName)
  
  $uri = "$JiraUrl/rest/api/3/environments"
  $body = @{
    name = $EnvironmentName
    description = "Auto-generated test environment for BrowserStack testing"
  } | ConvertTo-Json
  
  try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -ContentType "application/json" -Headers @{ Authorization = $AuthToken } -Body $body -ErrorAction Stop
    Write-Host "✓ Environment created successfully: $($response.name) (ID: $($response.id))"
    return $true
  } catch {
    Write-Host "Warning: Failed to create environment: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try {
        $s = $_.Exception.Response.GetResponseStream()
        if ($s) {
          $sr = New-Object IO.StreamReader($s)
          $b = $sr.ReadToEnd()
          Write-Host "Response body: $b"
        }
      } catch {}
    }
    return $false
  }
}

# Main logic
if (-not $EnvironmentName) {
  Write-Host "ERROR: EnvironmentName is required"
  exit 1
}

if (-not $JiraUrl -or -not $JiraUser -or -not $JiraApiToken) {
  Write-Host "ERROR: Jira credentials not provided"
  exit 1
}

$jiraAuthToken = Get-JiraToken -User $JiraUser -ApiToken $JiraApiToken

# Check if environment already exists
if (Test-EnvironmentExists -JiraUrl $JiraUrl -AuthToken $jiraAuthToken -EnvironmentName $EnvironmentName) {
  Write-Host "Environment check passed"
  exit 0
}

# Environment doesn't exist, try to create it
Write-Host "Environment not found, attempting to create..."
if (New-JiraEnvironment -JiraUrl $JiraUrl -AuthToken $jiraAuthToken -EnvironmentName $EnvironmentName) {
  Write-Host "Environment creation passed"
  exit 0
} else {
  Write-Host "WARNING: Could not create environment, proceeding anyway (may fail on upload)"
  # Don't exit with error - let the test run and see what happens on upload
  exit 0
}
