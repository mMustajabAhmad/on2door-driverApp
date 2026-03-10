#!/bin/bash

set -e

cd "$(dirname "$0")"

if [ -f ".env" ]; then
  set -a
  . ".env"
  set +a
fi

PORT="${PORT:-4173}"
URL="http://localhost:${PORT}/login.html"

echo "Starting Driver App on ${URL}..."
echo "Serving static files from $(pwd)"
echo ""
echo "Environment is auto-detected in the browser (localhost -> :3000, deployed -> on2door-api)."
echo "Make sure the Rails API is running"
echo "Opening the driver login page in your browser..."

python3 -m http.server "$PORT" >/tmp/driver-app-http.log 2>&1 &
SERVER_PID=$!

sleep 1
open "$URL"

echo "Driver login page opened."
echo "Static server PID: ${SERVER_PID}"
echo ""
echo "Press Ctrl+C to stop the server."

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM
wait "$SERVER_PID"
