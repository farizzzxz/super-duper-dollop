$port = 3000
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$dataFile = Join-Path $root "donations.json"
if (-not (Test-Path $dataFile)) {
    "[]" | Out-File -FilePath $dataFile -Encoding UTF8
}

function Get-LocalIPs {
    $addresses = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
        Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and -not $_.IsLoopback } |
        ForEach-Object { $_.IPAddressToString }

    if (-not $addresses) {
        return @("127.0.0.1")
    }

    return $addresses
}

function Read-Donations {
    try {
        $json = Get-Content -Path $dataFile -Raw -ErrorAction Stop
        return $json | ConvertFrom-Json
    } catch {
        return @()
    }
}

function Save-Donations($donations) {
    $json = $donations | ConvertTo-Json -Depth 4
    $json | Set-Content -Path $dataFile -Encoding UTF8
}

function Get-ContentType($filePath) {
    switch ([System.IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
        ".html" { "text/html; charset=utf-8" }
        ".htm" { "text/html; charset=utf-8" }
        ".js" { "application/javascript; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".svg" { "image/svg+xml" }
        ".png" { "image/png" }
        ".jpg" { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".gif" { "image/gif" }
        ".ico" { "image/x-icon" }
        default { "application/octet-stream" }
    }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server berjalan di http://localhost:$port"
Write-Host "Buka http://localhost:$port/owner.html atau http://localhost:$port/donor.html"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
    } catch {
        break
    }

    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.AbsolutePath
    $method = $request.HttpMethod

    if ($path -eq "/") {
        $path = "/owner.html"
    }

    if ($path -eq "/api/info") {
        $payload = @{ hostname = $env:COMPUTERNAME; addresses = Get-LocalIPs }
        $json = $payload | ConvertTo-Json -Depth 3
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentType = "application/json; charset=utf-8"
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
        continue
    }

    if ($path -eq "/api/donations" -and $method -eq "GET") {
        $donations = Read-Donations
        $json = $donations | ConvertTo-Json -Depth 4
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentType = "application/json; charset=utf-8"
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
        continue
    }

    if ($path -eq "/api/donations" -and $method -eq "POST") {
        try {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $donation = $body | ConvertFrom-Json
        } catch {
            $response.StatusCode = 400
            $response.Close()
            continue
        }

        if (-not $donation -or -not $donation.name -or -not $donation.amount) {
            $response.StatusCode = 400
            $response.Close()
            continue
        }

        $donations = Read-Donations
        $newDonation = $donation | Add-Member -NotePropertyName createdAt -NotePropertyValue ([int64](Get-Date -UFormat %s) * 1000) -PassThru
        $donations = ,$newDonation + $donations
        Save-Donations $donations

        $payload = @{ success = $true }
        $json = $payload | ConvertTo-Json
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentType = "application/json; charset=utf-8"
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
        continue
    }

    $filePath = Join-Path $root ($path.TrimStart("/") -replace "/", "\")
    if (-not [System.IO.Path]::HasExtension($filePath) -and (Test-Path $filePath -PathType Container)) {
        $filePath = Join-Path $filePath "index.html"
    }

    if (-not (Test-Path $filePath)) {
        $response.StatusCode = 404
        $response.ContentType = "text/plain; charset=utf-8"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
        continue
    }

    try {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = Get-ContentType $filePath
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
        $response.StatusCode = 500
        $response.ContentType = "text/plain; charset=utf-8"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error")
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } finally {
        $response.OutputStream.Close()
    }
}

$listener.Stop()
