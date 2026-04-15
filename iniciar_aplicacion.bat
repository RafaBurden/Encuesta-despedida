@echo off
title Formulario Despedida - Servidor Neon
echo ==========================================
echo   INICIANDO FORMULARIO DE DESPEDIDA
echo ==========================================
echo.
echo 1. Abriendo navegador en http://localhost:3000...
start http://localhost:3000
echo 2. Arrancando servidor...
echo.
echo NOTA: Para cerrar la aplicacion, usa el boton "Salir" en la web
echo o cierra esta ventana de comandos.
echo.
node server.js
pause
