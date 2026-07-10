#!/usr/bin/env bash
set -euo pipefail

STORYBOOK_DIR="$1"
PORT="${2:-6006}"
SERVE_PID=""

case "$STORYBOOK_DIR" in
  apps/storybook)       PKG="@pathable/storybook" ;;
  apps/storybook-react)  PKG="@pathable/storybook-react" ;;
  *)
    echo "Unknown storybook dir: $STORYBOOK_DIR" >&2
    exit 1
    ;;
esac

cd "$(git rev-parse --show-toplevel)"

cleanup() {
  if [ -n "$SERVE_PID" ]; then
    kill "$SERVE_PID" 2>/dev/null || true
    wait "$SERVE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

# Build storybook (without STORYBOOK_BUILD so base path stays at / for local serving)
echo "=== Building $STORYBOOK_DIR ==="
pnpm --filter "$PKG" build-storybook

# Serve static build in background
echo "=== Serving $STORYBOOK_DIR on port $PORT ==="
npx serve -n -l "$PORT" "$STORYBOOK_DIR/storybook-static" &
SERVE_PID=$!

# Wait for server to be ready
echo "=== Waiting for server ==="
for i in $(seq 1 30); do
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
    echo "Server ready after ${i}s"
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