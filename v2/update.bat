@echo off
setlocal

:: Define the shared folder path
set "SHARE_PATH=\\192.168.1.4\nginx"

:: Define the source directory (Angular project's dist folder)
set "SOURCE_DIR=%~dp0dist"

:: Clear the contents of the shared folder
echo Deleting existing files in the share...
for /d %%p in ("%SHARE_PATH%\*.*") do rmdir "%%p" /s /q
del "%SHARE_PATH%\*.*" /s /q

:: Copy new files from the dist folder to the shared folder
echo Copying new files to the share...
xcopy "%SOURCE_DIR%\*" "%SHARE_PATH%\" /s /i /q

echo Update complete.
pause
endlocal
