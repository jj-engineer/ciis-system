Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
backendDir = currentDir & "\backend"
WshShell.CurrentDirectory = backendDir
WshShell.Run "cmd /c cd /d """ & backendDir & """ && node src\server.js", 0, False

