#!/usr/bin/env bash
set -euo pipefail

STORYBOOK_DIR="$1"
PORT="${2:-6006}"
SERVE_PID=""
LISTENER_PID=""
IS_WINDOWS=false

case "$(uname -s)" in
  MSYS*|MINGW*|CYGWIN*) IS_WINDOWS=true ;;
esac

case "$STORYBOOK_DIR" in
  apps/storybook)       PKG="@pathable/storybook" ;;
  apps/storybook-react)  PKG="@pathable/storybook-react" ;;
  *)
    echo "Unknown storybook dir: $STORYBOOK_DIR" >&2
    exit 1
    ;;
esac

cd "$(git rev-parse --show-toplevel)"

get_listener_pid() {
  if [ "$IS_WINDOWS" = true ]; then
    powershell.exe -NoProfile -NonInteractive -Command \
      "(Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)" 2>/dev/null | tr -d '\r'
  fi
}

cleanup() {
  if [ "$IS_WINDOWS" = true ]; then
    # Git Bash's background PID can be a wrapper several levels above serve.
    if [ -z "$LISTENER_PID" ]; then
      LISTENER_PID="$(get_listener_pid || true)"
    fi
    if [ -n "$LISTENER_PID" ]; then
      taskkill.exe //PID "$LISTENER_PID" //T //F >/dev/null 2>&1 || true
    fi
    if [ -n "$SERVE_PID" ]; then
      taskkill.exe //PID "$SERVE_PID" //T //F >/dev/null 2>&1 || true
    fi
  elif [ -n "$SERVE_PID" ]; then
    kill "$SERVE_PID" 2>/dev/null || true
    wait "$SERVE_PID" 2>/dev/null || true
  fi
  SERVE_PID=""
  LISTENER_PID=""
}
trap cleanup EXIT INT TERM

# Avoid treating a stale Storybook server as the server started by this run.
if node -e '
  const net = require("node:net");
  const socket = net.createConnection({ host: "127.0.0.1", port: Number(process.argv[1]) });
  socket.setTimeout(500, () => { socket.destroy(); process.exit(1); });
  socket.once("connect", () => { socket.destroy(); process.exit(0); });
  socket.once("error", () => process.exit(1));
' "$PORT"; then
  echo "Port $PORT is already in use; stop the existing process or choose another port." >&2
  exit 1
fi

# Build storybook (without STORYBOOK_BUILD so base path stays at / for local serving)
echo "=== Building $STORYBOOK_DIR ==="
pnpm --filter "$PKG" build-storybook

# Serve static build in background
echo "=== Serving $STORYBOOK_DIR on port $PORT ==="
if [ "$IS_WINDOWS" = true ]; then
  npx.cmd serve -n -l "$PORT" "$STORYBOOK_DIR/storybook-static" &
else
  npx serve -n -l "$PORT" "$STORYBOOK_DIR/storybook-static" &
fi
SERVE_PID=$!

# Wait for server to be ready
echo "=== Waiting for server ==="
for i in $(seq 1 30); do
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
    echo "Server ready after ${i}s"
    if [ "$IS_WINDOWS" = true ]; then
      LISTENER_PID="$(get_listener_pid)"
    fi
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Server failed to start"
    exit 1
  fi
  sleep 1
done

# Run tests
echo "=== Testing $STORYBOOK_DIR ==="
set +e
pnpm --filter "$PKG" test-storybook --index-json --url "http://127.0.0.1:$PORT"
TEST_EXIT=$?
set -e

exit $TEST_EXIT
