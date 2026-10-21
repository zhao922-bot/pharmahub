# 药枢 PharmaHub · 静默停止
#
# 关键设计：只终止本项目的进程，不用 taskkill /IM node.exe。
#
# 原因：/IM node.exe 会杀掉机器上所有 Node 进程。如果你同时开着其他
# Node 工具（编辑器插件、其他项目、甚至这个对话的界面），会被一起杀掉。
# 这里按「命令行里包含本项目路径」来精确匹配。

$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $projectDir "logs"
$pidFile = Join-Path $logDir "server.pid"
$logFile = Join-Path $logDir "server.log"
$port = 3000

function Write-Log {
    param([string]$Message)
    if (Test-Path $logDir) {
        $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        # 服务运行期间 cmd 持有日志文件句柄，写日志可能失败。
        # 日志不是关键路径，失败时静默忽略，不影响停止流程。
        try {
            Add-Content -Path $logFile -Value "[$stamp] $Message" -Encoding UTF8 -ErrorAction Stop
        } catch {
            # 忽略
        }
    }
}

# ---- 找出属于本项目的 node 进程 ----

# 归一化路径用于比较：Windows 路径大小写不敏感，反斜杠可能有差异
$normalizedProject = $projectDir.Replace("/", "\").ToLowerInvariant()

$targets = Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object {
    $cmd = $_.CommandLine
    if (-not $cmd) { return $false }
    $normalizedCmd = $cmd.Replace("/", "\").ToLowerInvariant()
    return $normalizedCmd.Contains($normalizedProject)
}

# 额外加上记录的 cmd 父进程
$parentIds = @()
if (Test-Path $pidFile) {
    $saved = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($saved -and $saved -match '^\d+$') {
        $parentIds += [int]$saved
    }
}

$killed = 0

foreach ($proc in $targets) {
    try {
        Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
        Write-Log "已终止 node PID $($proc.ProcessId)"
        $killed += 1
    } catch {
        Write-Log "终止 PID $($proc.ProcessId) 失败：$($_.Exception.Message)"
    }
}

foreach ($id in $parentIds) {
    $p = Get-Process -Id $id -ErrorAction SilentlyContinue
    if ($p -and $p.ProcessName -eq "cmd") {
        try {
            Stop-Process -Id $id -Force -ErrorAction Stop
            Write-Log "已终止 cmd PID $id"
            $killed += 1
        } catch {
            Write-Log "终止 cmd PID $id 失败：$($_.Exception.Message)"
        }
    }
}

if (Test-Path $pidFile) { Remove-Item $pidFile -Force -ErrorAction SilentlyContinue }

# ---- 确认端口已释放 ----

Start-Sleep -Milliseconds 800

$stillListening = $false
try {
    $client = New-Object System.Net.Sockets.TcpClient
    $async = $client.BeginConnect("127.0.0.1", $port, $null, $null)
    $ok = $async.AsyncWaitHandle.WaitOne(400)
    if ($ok -and $client.Connected) { $stillListening = $true }
    $client.Close()
} catch { }

if ($stillListening) {
    Write-Log "警告：端口 $port 仍在监听，可能有其他进程占用"
} elseif ($killed -gt 0) {
    Write-Log "已停止，共终止 $killed 个进程"
} else {
    Write-Log "没有找到正在运行的服务"
}
