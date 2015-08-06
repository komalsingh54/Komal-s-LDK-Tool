@echo off
if exist ".\mongodb\mongodb-win32-x86_64-3.0.4\bin\mongod.exe" (
    ".\mongodb\mongodb-win32-x86_64-3.0.4\bin\mongod.exe" --dbpath .\var\db
    exit /b %ERRORLEVEL%
) else (
     echo ERROR: ".\mongodb\mongodb-win32-x86_64-3.0.4\bin\mongod.exe" does not exist.
     echo Update the correct path of the mongod in the script and run again.
     pause
)