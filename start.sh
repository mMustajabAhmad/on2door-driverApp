#!/bin/bash

set -e

cd "$(dirname "$0")"

if [ -f ".env" ]; then
  set -a
  . ".env"
  set +a
fi

PORT="${PORT:-4173}"
DRIVER_APP_API_BASE_URL="${DRIVER_APP_API_BASE_URL:-http://localhost:3000/api/v1}"
DRIVER_APP_WS_BASE_URL="${DRIVER_APP_WS_BASE_URL:-ws://localhost:3000/cable}"
URL="http://localhost:${PORT}/login.html"

cat > runtime-config.js <<EOF
window.DRIVER_APP_RUNTIME_CONFIG = {
  apiBaseUrl: "${DRIVER_APP_API_BASE_URL}",
  wsBaseUrl: "${DRIVER_APP_WS_BASE_URL}"
};
EOF

echo "Starting Driver App on ${URL}..."
echo "Serving static files from $(pwd)"
echo ""
echo "Using API Base URL: ${DRIVER_APP_API_BASE_URL}"
echo "Using WebSocket URL: ${DRIVER_APP_WS_BASE_URL}"
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
