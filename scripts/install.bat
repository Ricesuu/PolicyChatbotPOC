@echo off
echo 🤖 Azure AI Chatbot Setup
echo ========================
echo.
echo Installing dependencies...
npm install

echo.
echo ✅ Dependencies installed!
echo.
echo 🔧 Next step: Configure your environment
echo.
echo Choose an option:
echo   1. Run setup assistant: npm run setup
echo   2. Manual setup: Copy .env.example to .env and edit
echo.
echo 🚀 After configuration:
echo   - Development: npm run dev
echo   - Production:  npm start
echo.
pause
