' CIIS School Computer Lab Agent — Silent Background Launcher
' Starts PowerShell agent script invisibly without opening any CMD or console windows.
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ""C:\SchoolLabAgent\agent.ps1""", 0, False
