@echo off
echo [INFO] Cerrando bot y preparando USB...

:: Cierra el bot si está corriendo
taskkill /F /IM node.exe >nul 2>&1

:: Respaldar archivos clave
xcopy "D:\FORMULA\.env" "D:\RESPALDO\" /Y
xcopy "D:\FORMULA\package.json" "D:\RESPALDO\" /Y
xcopy "D:\FORMULA\index.js" "D:\RESPALDO\" /Y

echo [INFO] Archivos respaldados. Puedes expulsar el USB con seguridad.
pause
