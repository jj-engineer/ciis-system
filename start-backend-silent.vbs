Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
backendDir = currentDir & "\backend"
runPs1 = backendDir & "\run-server.ps1"
WshShell.CurrentDirectory = backendDir
WshShell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & runPs1 & """", 0, False


