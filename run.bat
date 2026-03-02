@echo off
cd /d "%~dp0"
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)
echo Starting dev server...
echo.
echo 启动后请在浏览器打开: http://localhost:3000
echo 若 3000 被占用将自动使用 3001
echo.
start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3000/dashboard"
call npm run dev
