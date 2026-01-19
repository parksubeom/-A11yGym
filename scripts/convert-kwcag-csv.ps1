$ErrorActionPreference = 'Stop'

$downloadDir = 'C:\Users\Administrator\Downloads'
$workspaceDir = 'C:\Users\Administrator\Desktop\-A11yGym'

# Find the CSV by partial name match (avoid embedding Korean chars in the script invocation layer)
$csv = Get-ChildItem -Path $downloadDir -File |
  Where-Object { $_.Name -match 'gems' -and $_.Extension -match '\.csv' } |
  Select-Object -First 1

if (-not $csv) {
  throw "CSV not found in $downloadDir (expected filename contains 'gems')."
}

$inPath = $csv.FullName
$outPath = Join-Path $workspaceDir 'docs\kwcag-guidelines.utf8.csv'

# Convert CP949/EUC-KR -> UTF-8 (no BOM)
# Some Windows apps keep a lock on the file; read with FileShare.ReadWrite to bypass.
$fs = New-Object System.IO.FileStream($inPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
try {
  $bytes = New-Object byte[] $fs.Length
  [void]$fs.Read($bytes, 0, $bytes.Length)
} finally {
  $fs.Dispose()
}
$enc949 = [System.Text.Encoding]::GetEncoding(949)
$text = $enc949.GetString($bytes)
[System.IO.File]::WriteAllText($outPath, $text, (New-Object System.Text.UTF8Encoding $false))

Write-Output "IN:  $inPath"
Write-Output "OUT: $outPath"
Write-Output "HEADER:"
Write-Output (($text -split "`n")[0])


