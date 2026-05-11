@echo off
echo Windows Setup for Wedding Website
echo ==================================
echo.

echo Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo Running Windows setup check...
call npm run setup:windows

echo.
echo Setup complete! You can now run:
echo   npm run dev        (start app — configure sites in Admin / Setup)
echo.
pause