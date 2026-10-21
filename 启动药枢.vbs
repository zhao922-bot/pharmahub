' 药枢 PharmaHub · 静默启动
'
' 双击运行，不显示任何控制台窗口。
' 原理：WScript.Shell.Run 用窗口样式 0 启动 PowerShell，
' 全程无窗口；比 .bat 里用 start /min 更彻底（后者仍会闪一下）。
'
' 服务就绪后会自动打开浏览器。日志在 logs\server.log。

Option Explicit

Dim shell, fso, projectDir, psScript, cmd

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' 本脚本放在项目根目录，所以项目目录就是脚本所在目录。
' 踩过的坑：这里曾经多取了一层父目录，导致路径指向
' default-workspace\scripts 而不是 pharmahub\scripts。
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
psScript = projectDir & "\scripts\server-start.ps1"

If Not fso.FileExists(psScript) Then
    MsgBox "找不到启动脚本：" & vbCrLf & psScript & vbCrLf & vbCrLf & _
           "请确认 scripts\server-start.ps1 存在。", 16, "药枢 PharmaHub"
    WScript.Quit 1
End If

' 0 = 隐藏窗口，False = 不等待返回
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & psScript & """"
shell.Run cmd, 0, False

Set shell = Nothing
Set fso = Nothing
