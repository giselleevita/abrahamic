#!/usr/bin/env bash
set -euo pipefail

export DATABASE_URL="${DATABASE_URL:-${PRISMA_DATABASE_URL:-${POSTGRES_URL:-${storage_PRISMA_DATABASE_URL:-${storage_POSTGRES_URL:-${storage_DATABASE_URL:-}}}}}}"
export DIRECT_URL="${DIRECT_URL:-${POSTGRES_URL:-${storage_POSTGRES_URL:-${PRISMA_DATABASE_URL:-${storage_PRISMA_DATABASE_URL:-${DATABASE_URL:-}}}}}}"

if [[ -z "${DATABASE_URL}" ]]; then
  echo "DATABASE_URL (or storage_PRISMA_DATABASE_URL / POSTGRES_URL) is required" >&2
  exit 1
fi

if [[ -z "${DIRECT_URL}" ]]; then
  export DIRECT_URL="${DATABASE_URL}"
fi

exec npx prisma db seed
