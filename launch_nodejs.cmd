@echo off
set NODE_PATH=.\nodejs\nodejs-win32-x86_64\node_modules;%NODE_PATH%
if exist ".\nodejs\nodejs-win32-x86_64\node.exe" (
    ".\nodejs\nodejs-win32-x86_64\node.exe" .\src\server.js
    exit /b %ERRORLEVEL%
) else (
     echo ERROR: ".\nodejs\nodejs-win32-x86_64\node.exe" does not exist.
     echo Update the correct path of the nodejs and node modules in the script and run again.
     pause
)