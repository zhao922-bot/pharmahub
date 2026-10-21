# 药枢 PharmaHub · 静默启动
#
# 由 启动药枢.vbs 调用，全程不显示控制台窗口。
# 单独运行时需要 -WindowStyle Hidden，否则会闪出一个 PowerShell 窗口。
#
# 设计要点：
# 1. 默认走生产模式（pnpm start），比 dev 模式快很多，内存占用也低
# 2. 没有构建产物时自动构建一次（首次启动或源码改动后）
# 3. 日志写到 logs/server.log，出问题可以查
# 4. 等服务真正就绪后再打开浏览器，避免看到「无法连接」

param(
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $projectDir "logs"
$logFile = Join-Path $logDir "server.log"
$pidFile = Join-Path $logDir "server.pid"
$port = 3000

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# ---- 工具函数 ----

function Quote-Path {
    param([string]$Path)
    return '"' + $Path + '"'
}

function Quote-Path {
    param([string]$Path)
    return '"' + $Path + '"'
}

# 重定向符号单独用变量承载。
# 原因：PowerShell 解析器在**解析阶段**就把源码里的追加重定向符与
# 错误合并符当成真实的重定向处理，即使它们出现在双引号字符串里
# 也会报 StreamAlreadyRedirected。用变量拼接可绕过解析器的字面扫描。
$REDIRECT = [char]62 + [char]62 + " "   # 两个 62 即追加重定向符
$MERGE_ERR = " " + [char]50 + [char]62 + [char]38 + [char]49   # 即空格加错误合并符

function Build-LoggedCommand {
    param([string]$Command, [string]$Target)
    return $Command + " " + $REDIRECT + (Quote-Path $Target) + $MERGE_ERR
}

function Test-PortListening {
    param([int]$Port)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $async = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        $ok = $async.AsyncWaitHandle.WaitOne(300)
        $connected = $false
        if ($ok -and $client.Connected) { $connected = $true }
        $client.Close()
        return $connected
    } catch {
        return $false
    }
}

function Write-Log {
    param([string]$Message)
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    # 服务启动后，cmd 会以追加方式持有日志文件句柄，
    # 此时 Add-Content 可能报「文件被占用」。
    # 日志写入失败不应影响启动流程，所以这里静默忽略。
    try {
        Add-Content -Path $logFile -Value "[$stamp] $Message" -Encoding UTF8 -ErrorAction Stop
    } catch {
        # 忽略
    }
}

# ---- 已在运行则直接打开浏览器 ----

if (Test-PortListening -Port $port) {
    Write-Log "服务已在运行，跳过启动"
    if (-not $NoBrowser) { Start-Process "http://localhost:$port" }
    exit 0
}

# ---- 检查依赖 ----

$pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpm) {
    Write-Log "错误：未找到 pnpm，请先安装 Node.js 18.17+ 与 pnpm"
    exit 1
}

if (-not (Test-Path (Join-Path $projectDir "node_modules"))) {
    Write-Log "未找到 node_modules，开始安装依赖（可能需要几分钟）"
    # 命令由 Build-LoggedCommand 拼接，避免字面重定向符
    $installCmd = Build-LoggedCommand -Command "pnpm install" -Target $logFile
    $install = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", $installCmd `
        -WorkingDirectory $projectDir -WindowStyle Hidden -Wait -PassThru
    if ($install.ExitCode -ne 0) {
        Write-Log "错误：依赖安装失败，详见日志"
        exit 1
    }
}

# ---- 没有构建产物则先构建 ----

$buildId = Join-Path $projectDir ".next\BUILD_ID"
if (-not (Test-Path $buildId)) {
    Write-Log "未找到构建产物，开始构建（约 1 分钟）"
    Add-Content -Path $logFile -Value "===== BUILD =====" -Encoding UTF8
        $buildCmd = Build-LoggedCommand -Command "pnpm build" -Target $logFile
    $build = Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", $buildCmd `
        -WorkingDirectory $projectDir -WindowStyle Hidden -Wait -PassThru
    if ($build.ExitCode -ne 0 -or -not (Test-Path $buildId)) {
        Write-Log "错误：构建失败，详见日志"
        exit 1
    }
    Write-Log "构建完成"
}

# ---- 启动服务 ----
#
# 两个坑都在这里，一并说明：
#
# 坑 1：重定向不能写在 Start-Process 的参数里。
#   PowerShell 在解析阶段就报 StreamAlreadyRedirected。
#   解决：把整条带重定向的命令作为 cmd 的单个参数传进去，由 cmd 负责重定向。
#
# 坑 2：-WindowStyle Hidden 不能真正隐藏窗口。
#   它只隐藏 cmd 自己，next start 作为子进程会重新申请控制台，
#   任务栏上就出现「next-server (v14.2.35)」窗口。
#   解决：用 CreateNoWindow + CREATE_NO_WINDOW 标志（0x08000000），
#   从进程创建层面就不分配控制台，子进程也拿不到窗口。

Add-Content -Path $logFile -Value "===== START $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') =====" -Encoding UTF8

$serverCmd = Build-LoggedCommand -Command "pnpm start" -Target $logFile

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = "/c " + $serverCmd
$psi.WorkingDirectory = $projectDir
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
# 不重定向流：输出由 cmd 自己的重定向写进日志文件，
# 若同时 RedirectStandardOutput 会与 cmd 的重定向冲突
$psi.RedirectStandardOutput = $false
$psi.RedirectStandardError = $false

$server = [System.Diagnostics.Process]::Start($psi)
Set-Content -Path $pidFile -Value $server.Id -Encoding ASCII
Write-Log "已启动，PID = $($server.Id)"

# ---- 等待就绪（最多 60 秒）----

$ready = $false
for ($i = 0; $i -lt 120; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-PortListening -Port $port) {
        $ready = $true
        break
    }
    if ($server.HasExited) {
        Write-Log "错误：服务进程提前退出，退出码 $($server.ExitCode)"
        break
    }
}

if (-not $ready) {
    Write-Log "错误：等待服务就绪超时"
    exit 1
}

Write-Log "服务已就绪 http://localhost:$port"

# ---- 找出局域网地址，方便手机访问 ----

# 挑「真实」网卡：排除虚拟网卡与 VPN 的常见网段，
# 那些地址手机连不上，列出来只会让人困惑。
$lanIp = $null
try {
    $candidates = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
        Where-Object {
            $_.IPAddress -notlike "127.*" -and
            $_.IPAddress -notlike "169.254.*" -and
            $_.IPAddress -notlike "198.18.*" -and
            $_.IPAddress -notlike "192.168.52.*" -and
            $_.IPAddress -notlike "192.168.228.*" -and
            $_.PrefixOrigin -ne "WellKnown"
        }
    # 优先 192.168.x.x / 10.x.x.x，这些是常见家用路由器网段
    $lanIp = ($candidates | Where-Object { $_.IPAddress -like "192.168.*" } |
        Select-Object -First 1).IPAddress
    if (-not $lanIp) {
        $lanIp = ($candidates | Where-Object { $_.IPAddress -like "10.*" } |
            Select-Object -First 1).IPAddress
    }
    if (-not $lanIp) {
        $lanIp = ($candidates | Select-Object -First 1).IPAddress
    }
} catch {
    # 取不到就算了，不影响本机使用
}

# 状态信息写到独立文件。
#
# 原因：服务启动后 cmd 以追加方式持有 server.log 句柄，
# 此时 Write-Log 会失败（已做静默容错），但「手机访问地址」这条
# 恰恰是启动之后才产生的，写进 server.log 必然丢。
# 单独写 status.txt 就不受这个句柄影响。
$statusFile = Join-Path $logDir "status.txt"
$lines = @()
$lines += "本机访问   http://localhost:$port"
if ($lanIp) {
    $lines += "手机访问   http://${lanIp}:$port"
    $lines += ""
    $lines += "手机需与电脑连同一个 Wi-Fi。"
    $lines += "打开后在浏览器菜单里选「添加到主屏幕」，即可当 App 使用。"
} else {
    $lines += "手机访问   未检测到局域网地址"
}
try {
    Set-Content -Path $statusFile -Value ($lines -join "`r`n") -Encoding UTF8
} catch {
    # 忽略
}

if ($lanIp) {
    Write-Log "手机访问地址 http://${lanIp}:$port"
} else {
    Write-Log "未检测到局域网地址，手机暂时无法访问"
}

# ---- 可选：确保防火墙放行 ----
#
# 只检查、不主动改防火墙。修改防火墙需要管理员权限，
# 双击启动时静默弹 UAC 会让人困惑。如果端口连不上，
# 日志里会提示手动处理。

if ($lanIp) {
    $rule = Get-NetFirewallRule -Enabled True -Direction Inbound -ErrorAction SilentlyContinue |
        Where-Object { $_.DisplayName -match "Node\.js" } |
        Select-Object -First 1
    if (-not $rule) {
        Write-Log "提示：未找到 Node.js 防火墙放行规则，手机可能连不上。"
        Write-Log "      可在「Windows 安全中心 → 防火墙 → 允许应用通过防火墙」中勾选 Node.js。"
    }
}

if (-not $NoBrowser) {
    Start-Process "http://localhost:$port"
}
