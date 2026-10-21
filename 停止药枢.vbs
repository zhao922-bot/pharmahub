' 药枢 PharmaHub · 静默停止
'
' 只终止本项目的进程，不影响其他 Node 程序。

Option Explicit

Dim shell, fso, projectDir, psScript, cmd

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
psScript = projectDir & "\scripts\server-stop.ps1"

If Not fso.FileExists(psScript) Then
    MsgBox "找不到停止脚本：" & vbCrLf & psScript, 16, "药枢 PharmaHub"
    WScript.Quit 1
End If

cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & psScript & """"
shell.Run cmd, 0, False

Set shell = Nothing
Set fso = Nothing
