@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在检查依赖...
if not exist "node_modules\next" (
    echo 首次运行，正在安装依赖...
    call npm install
)

echo.
echo 启动开发服务器...
echo 启动成功后，在浏览器打开 http://localhost:3000
echo 按 Ctrl+C 可停止服务器
echo.
call npm run dev

pause
