@echo off
REM Update Angular CLI globally
echo Updating Angular CLI globally...
npm install -g @angular/cli
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to update Angular CLI globally.
    pause
    exit /b %ERRORLEVEL%
)

REM Navigate to the project directory (optional, set your project path)
REM cd /d "C:\path\to\your\angular\project"

REM Update Angular CLI and Core in the project
echo Updating Angular CLI and Core in the project...
ng update @angular/cli @angular/core
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to update Angular CLI and Core in the project.
    pause
    exit /b %ERRORLEVEL%
)

REM Run npm audit fix with force
echo Running npm audit fix with force...
npm audit fix --force
IF %ERRORLEVEL% NEQ 0 (
    echo Error: npm audit fix encountered issues.
    pause
    exit /b %ERRORLEVEL%
)

echo Update complete.
pause
