Write-Host "🌙 Starting Dream to Startup Generator..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Starting Backend..." -ForegroundColor Yellow
Set-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python run.py"
Set-Location ..

Write-Host ""
Write-Host "⚛️ Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host ""
Write-Host "🚀 Both servers are starting..." -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "📍 Backend: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)" -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 