@echo off

IF NOT EXIST dist (
  REM for building the project we neeed all dependencies installed
  ECHO Installing dependencies...
  npm ci

  ECHO Building project...
  npm run build
) ELSE (
  IF NOT EXIST node_modules (
    REM for just running we only need express
    ECHO Installing dependencies...
    npm install express
  )
)

REM launch the server
node micro-ws
