param(
  [Parameter(Mandatory=$true)][string]$IssueKey,
  [string]$DeviceName = $env:DEVICE_NAME,
  [string]$XrayEndpoint = $env:XRAY_ENDPOINT,
  [string]$JiraProjectKey = $env:JIRA_PROJECT_KEY
)

Write-Host "🔐 Authentification Xray..."

$clientId = $env:XRAY_CLIENT_ID
$clientSecret = $env:XRAY_CLIENT_SECRET
if (-not $clientId -or -not $clientSecret) {
  Write-Host "ERROR: XRAY_CLIENT_ID or XRAY_CLIENT_SECRET not provided in environment"
  exit 1
}

$authBody = @{
  client_id = $clientId
  client_secret = $clientSecret
} | ConvertTo-Json

# Appel d'authentification avec gestion des erreurs
try {
  $authResponse = Invoke-RestMethod -Uri "https://$XrayEndpoint/api/v2/authenticate" `
    -Method POST `
    -ContentType "application/json" `
    -Body $authBody -ErrorAction Stop
} catch {
  Write-Host "Authentication request failed: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    try {
      $stream = $_.Exception.Response.GetResponseStream()
      if ($stream) {
        $sr = New-Object System.IO.StreamReader($stream)
        $body = $sr.ReadToEnd()
        Write-Host "Authentication response body: $body"
      }
    } catch {
      Write-Host "Unable to read response body: $($_.Exception.Message)"
    }
  }
  throw
}

# Si la réponse est vide, tenter Invoke-WebRequest pour récupérer le contenu brut
if (-not $authResponse -or $authResponse -eq "") {
  Write-Host "Auth response empty, retrying with Invoke-WebRequest to capture raw body..."
  try {
    $web = Invoke-WebRequest -Uri "https://$XrayEndpoint/api/v2/authenticate" -Method POST -ContentType "application/json" -Body $authBody -UseBasicParsing -ErrorAction Stop
    $raw = $web.Content
    Write-Host "Auth raw content length: $($raw.Length)"
    $token = $raw.Trim([char]34)
  } catch {
    Write-Host "Retry authentication failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
          $sr = New-Object System.IO.StreamReader($stream)
          $body = $sr.ReadToEnd()
          Write-Host "Authentication retry response body: $body"
        }
      } catch {
        Write-Host "Unable to read retry response body: $($_.Exception.Message)"
      }
    }
    throw
  }
} else {
  # Extraire le token de façon robuste (la réponse peut être une string brute ou un objet JSON)
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
    -Method POST `
    -ContentType "text/xml" `
    param(
      [Parameter(Mandatory=$true)][string]$IssueKey,
      [string]$DeviceName = $env:DEVICE_NAME,
      [string]$XrayEndpoint = $env:XRAY_ENDPOINT,
      [string]$JiraProjectKey = $env:JIRA_PROJECT_KEY
    )

    Write-Host "🔐 Authentification Xray..."

    $clientId = $env:XRAY_CLIENT_ID
    $clientSecret = $env:XRAY_CLIENT_SECRET
    if (-not $clientId -or -not $clientSecret) {
      Write-Host "ERROR: XRAY_CLIENT_ID or XRAY_CLIENT_SECRET not provided in environment"
      exit 1
    }

    $authBodyObj = @{
      client_id = $clientId
      client_secret = $clientSecret
    }
    $authBody = $authBodyObj | ConvertTo-Json -Compress

    # Appel d'authentification avec gestion des erreurs
    try {
      $authResponse = Invoke-RestMethod -Uri "https://$XrayEndpoint/api/v2/authenticate" `
        -Method POST `
        -ContentType "application/json" `
        -Body $authBody -ErrorAction Stop
    } catch {
      Write-Host "Authentication request failed: $($_.Exception.Message)"
      if ($_.Exception.Response) {
        try {
          $stream = $_.Exception.Response.GetResponseStream()
          if ($stream) {
            $sr = New-Object System.IO.StreamReader($stream)
            $body = $sr.ReadToEnd()
            Write-Host "Authentication response body: $body"
          }
        } catch {
          Write-Host "Unable to read response body: $($_.Exception.Message)"
        }
      }
      throw
    }

    # Diagnostic: montrer le type et le contenu de la réponse (non-illicit, le token sera masqué par Actions)
    if ($authResponse) {
      try {
        $typeName = $authResponse.GetType().FullName
      } catch { $typeName = "(unknown)" }
      Write-Host "AuthResponse type: $typeName"
      try {
        $authJson = $authResponse | ConvertTo-Json -Compress
        param(
          [Parameter(Mandatory=$true)][string]$IssueKey,
          [string]$DeviceName = $env:DEVICE_NAME,
          [string]$XrayEndpoint = $env:XRAY_ENDPOINT,
          [string]$JiraProjectKey = $env:JIRA_PROJECT_KEY
        )

        Write-Host "🔐 Authentification Xray..."

        $clientId = $env:XRAY_CLIENT_ID
        $clientSecret = $env:XRAY_CLIENT_SECRET
        if (-not $clientId -or -not $clientSecret) {
          Write-Host "ERROR: XRAY_CLIENT_ID or XRAY_CLIENT_SECRET not provided in environment"
          exit 1
        }

        $authBodyObj = @{
          client_id = $clientId
          client_secret = $clientSecret
        }
        $authBody = $authBodyObj | ConvertTo-Json -Compress

        # Appel d'authentification avec gestion des erreurs
        try {
          $authResponse = Invoke-RestMethod -Uri "https://$XrayEndpoint/api/v2/authenticate" `
            -Method POST `
            -ContentType "application/json" `
            -Body $authBody -ErrorAction Stop
        } catch {
          Write-Host "Authentication request failed: $($_.Exception.Message)"
          if ($_.Exception.Response) {
            try {
              $stream = $_.Exception.Response.GetResponseStream()
              if ($stream) {
                $sr = New-Object System.IO.StreamReader($stream)
                $body = $sr.ReadToEnd()
                Write-Host "Authentication response body: $body"
              }
            } catch {
              Write-Host "Unable to read response body: $($_.Exception.Message)"
            }
          }
          throw
        }

        # Diagnostic: montrer le type et le contenu de la réponse (le token sera masqué par Actions)
        if ($authResponse) {
          try { $typeName = $authResponse.GetType().FullName } catch { $typeName = "(unknown)" }
          Write-Host "AuthResponse type: $typeName"
          try { $authJson = $authResponse | ConvertTo-Json -Compress; Write-Host "AuthResponse JSON: $authJson" } catch { Write-Host "AuthResponse could not be converted to JSON" }
        } else {
          Write-Host "AuthResponse is null or empty"
        }

        # Si la réponse est vide, tenter Invoke-WebRequest pour récupérer le contenu brut
        if (-not $authResponse -or $authResponse -eq "") {
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
              try {
                $stream = $_.Exception.Response.GetResponseStream()
                if ($stream) {
                  $sr = New-Object System.IO.StreamReader($stream)
                  $body = $sr.ReadToEnd()
                  Write-Host "Authentication retry response body: $body"
                }
              } catch {
                Write-Host "Unable to read retry response body: $($_.Exception.Message)"
              }
            }
            throw
          }
        } else {
          # Extraire le token de façon robuste (la réponse peut être une string brute ou un objet JSON)
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
            -Method POST `
            -ContentType "text/xml" `
            -Headers @{ "Authorization" = "Bearer $token" } `
            -Body $junitContent -ErrorAction Stop
        } catch {
          Write-Host "Import request failed: $($_.Exception.Message)"
          if ($_.Exception.Response) {
            try {
              $stream = $_.Exception.Response.GetResponseStream()
              if ($stream) {
                $sr = New-Object System.IO.StreamReader($stream)
                $body = $sr.ReadToEnd()
                Write-Host "Import response body: $body"
              }
            } catch {
              Write-Host "Unable to read import response body: $($_.Exception.Message)"
            }
          }
          throw
        }

        Write-Host "Response: $($response | ConvertTo-Json)"

        $execKey = $response.key
        Write-Host "Test Execution Key: $execKey"

        # Écrire dans GITHUB_OUTPUT
        if ($env:GITHUB_OUTPUT) {
          Add-Content -Path $env:GITHUB_OUTPUT -Value "exec_key=$execKey"
        } else {
          Write-Host "GITHUB_OUTPUT not set; printing exec_key to stdout: exec_key=$execKey"
          Write-Host "exec_key=$execKey"
        }
