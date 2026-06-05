# College Management Information System (CMIS) Startup Script
# This script launches both the backend and frontend servers in separate windows.

Clear-Host
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "         COLLEGE MANAGEMENT INFORMATION SYSTEM (CMIS)            " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# Define custom paths
$JdkPath = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:JAVA_HOME = $JdkPath
$env:PATH = "$JdkPath\bin;" + $env:PATH

Write-Host "[1/2] Starting Spring Boot Backend API (Port 8080)..." -ForegroundColor Yellow
$BackendCmd = "cd backend; `$env:JAVA_HOME = '$JdkPath'; `$env:PATH = '$JdkPath\bin;' + `$env:PATH; java -Dspring.profiles.active=dev -jar .\target\cmis-0.0.1-SNAPSHOT.jar"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCmd

Write-Host "[2/2] Starting Vite Frontend Server (Port 5173)..." -ForegroundColor Yellow
$FrontendCmd = "cd frontend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCmd

Write-Host ""
Write-Host "✔ Servers are launching in the background!" -ForegroundColor Green
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray
Write-Host "🔗 Frontend UI:   http://localhost:5173" -ForegroundColor Green
Write-Host "🔗 Backend API:   http://localhost:8080" -ForegroundColor Green
Write-Host "🔗 Swagger Docs:  http://localhost:8080/swagger-ui/index.html" -ForegroundColor Green
Write-Host "🔗 H2 Database:   http://localhost:8080/h2-console" -ForegroundColor Green
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray
Write-Host "H2 JDBC URL: jdbc:h2:mem:cmisdb (User: sa, Password: password)"
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray
Write-Host "🔑 PRE-SEEDED TEST ACCOUNTS (Ready to use!):" -ForegroundColor Cyan
Write-Host "  1. Administrator Account:" -ForegroundColor White
Write-Host "     - Email:    admin@college.com" -ForegroundColor Green
Write-Host "     - Password: admin123" -ForegroundColor Green
Write-Host "  2. Student Account (Alice Johnson - CS Year 3):" -ForegroundColor White
Write-Host "     - Email:    alice.student@college.edu" -ForegroundColor Green
Write-Host "     - Password: password123" -ForegroundColor Green
Write-Host "  3. Student Account (Bob Smith - EC Year 2):" -ForegroundColor White
Write-Host "     - Email:    bob.student@college.edu" -ForegroundColor Green
Write-Host "     - Password: password123" -ForegroundColor Green
Write-Host "  4. Student Account (Charlie Davis - CS Year 1):" -ForegroundColor White
Write-Host "     - Email:    charlie.student@college.edu" -ForegroundColor Green
Write-Host "     - Password: password123" -ForegroundColor Green
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray
Write-Host "You can also register any new account on the Register page:"
Write-Host "  - Emails containing 'admin' will get full Admin CRUD rights."
Write-Host "  - Other emails will default to standard Student read-only rights."
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Press enter to exit this launcher (processes will remain active)."
Read-Host
