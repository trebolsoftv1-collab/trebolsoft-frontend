@echo off
cd /d "C:\Users\jpancha\trebolsoft-frontend"
set PATH=%PATH%;C:\Program Files\nodejs

echo Instalando paquete faltante de Tailwind...
call npm install @tailwindcss/postcss

echo.
echo Actualizando configuracion de PostCSS...
(
echo export default {
echo   plugins: {
echo     '@tailwindcss/postcss': {},
echo   },
echo }
) > postcss.config.js

echo.
echo Iniciando servidor...
npm run dev
pause
