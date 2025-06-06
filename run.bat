@echo off
setlocal

REM === Lancer le backend PHP ===
echo Lancement du backend PHP sur http://localhost:8000
start "Backend" cmd /k "cd backend && php -S localhost:8000"

REM === Lancer live-server depuis frontend/native-spa ===
echo Lancement du frontend sur http://localhost:3000/
start "Frontend" cmd /k "cd frontend\\native-spa && live-server --port=3000"

REM === Ouvrir automatiquement la page dans le navigateur ===
timeout /t 2 > nul
start "" "http://localhost:3000/"

echo.
echo Serveurs lances :
echo - Backend : http://localhost:8000
echo - Frontend : http://localhost:3000/
echo.
echo Ferme les fenêtres de terminal pour arreter les serveurs.

pause
