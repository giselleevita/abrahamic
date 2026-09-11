#!/usr/bin/env bash
set -euo pipefail

first_log="$(mktemp)"
second_log="$(mktemp)"
trap 'rm -f "$first_log" "$second_log"' EXIT

npm run db:seed >"$first_log" 2>&1
npm run db:seed >"$second_log" 2>&1

if grep -E "prisma:error|Unique constraint failed|Invalid .* invocation" "$second_log"; then
  echo "Second seed pass emitted database errors" >&2
  exit 1
fi

grep -q "Seed complete" "$first_log"
grep -q "Seed complete" "$second_log"
echo "Verified clean, repeatable database seed"
