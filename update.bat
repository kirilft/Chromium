@echo off
REM Update global Angular CLI
echo Updating Global Angular CLI...
npm install -g @angular/cli@latest
if %ERRORLEVEL% neq 0 (
    echo Error updating global Angular CLI. Check the npm permissions and network connection.
    goto end
)

REM Change the directory accordingly
cd C:\Github\Chromium
if %ERRORLEVEL% neq 0 (
    echo Error changing directory to C:\Github\Chromium. Verify the path is correct.
    goto end
)

REM Update local Angular CLI
echo Updating Local Angular CLI...
ng update @angular/cli@latest
if %ERRORLEVEL% neq 0 (
    echo Error updating local Angular CLI. Consider checking for the latest versions manually.
    goto end
)

REM Update Angular Core and other Angular packages
echo Updating Angular Core and other Angular packages...
ng update @angular/core@latest @angular/cli@latest
if %ERRORLEVEL% neq 0 (
    echo Error updating Angular Core and CLI. Review any version constraints that might be causing conflicts.
    goto end
)

REM Update all dependencies
echo Updating all dependencies...
ng update
if %ERRORLEVEL% neq 0 (
    echo Error updating dependencies. Some updates may require manual intervention.
    goto end
)

echo Update process completed. Please check the console for any errors or further instructions.
goto end

:end
pause
