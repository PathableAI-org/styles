#!/usr/bin/env bash
set -euo pipefail

STORYBOOK_DIR="$1"
PORT="${2:-6006}"

cd "$(git rev-parse --show-toplevel)"

# Build storybook (without STORYBOOK_BUILD so base path stays at / for local serving)
echo "=== Building $STORYBOOK_DIR ==="
pnpm --filter @pathable/storybook build-storybook

# Serve static build in background
echo "=== Serving $STORYBOOK_DIR on port $PORT ==="
npx serve -n -l "$PORT" "$STORYBOOK_DIR/storybook-static" &
SERVE_PID=$!

# Wait for server to be ready
echo "=== Waiting for server ==="
for i in $(seq 1 10); do
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
    echo "Server ready after ${i}s"
    break
  fi
  if [ "$i" -eq 10 ]; then
    echo "Server failed to start"
    kill "$SERVE_PID" 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# Run tests
echo "=== Testing $STORYBOOK_DIR ==="
set +e
if [ "$STORYBOOK_DIR" = "apps/storybook" ]; then
  pnpm --filter @pathable/storybook test-storybook --index-json --url "http://127.0.0.1:$PORT"
else
  pnpm --filter @pathable/storybook-react test-storybook --index-json --url "http://127.0.0.1:$PORT"
fi
TEST_EXIT=$?
set -e

# Cleanup
kill "$SERVE_PID" 2>/dev/null || true
wait "$SERVE_PID" 2>/dev/null || true

exit $TEST_EXIT