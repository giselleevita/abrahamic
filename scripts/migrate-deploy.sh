#!/usr/bin/env bash
set -euo pipefail

if [[ "${VERCEL_ENV:-}" == "preview" ]]; then
  if [[ "${PREVIEW_DATABASE_ISOLATED:-}" != "true" || -z "${PREVIEW_DATABASE_URL:-}" || -z "${PREVIEW_DIRECT_URL:-${PREVIEW_DATABASE_URL_UNPOOLED:-}}" ]]; then
    echo "An isolated preview database is required" >&2
    exit 1
  fi
  exec npx prisma migrate deploy
fi

export DATABASE_URL="${NEON_DATABASE_URL:-${DATABASE_URL:-${PRISMA_DATABASE_URL:-${POSTGRES_URL:-${storage_PRISMA_DATABASE_URL:-${storage_POSTGRES_URL:-${storage_DATABASE_URL:-}}}}}}}"
export DIRECT_URL="${NEON_DATABASE_URL_UNPOOLED:-${DIRECT_URL:-${POSTGRES_URL:-${storage_POSTGRES_URL:-${PRISMA_DATABASE_URL:-${storage_PRISMA_DATABASE_URL:-${DATABASE_URL:-}}}}}}}"

if [[ -z "${DATABASE_URL}" ]]; then
  echo "DATABASE_URL (or PRISMA_DATABASE_URL / POSTGRES_URL) is required" >&2
  exit 1
fi

if [[ -z "${DIRECT_URL}" ]]; then
  export DIRECT_URL="${DATABASE_URL}"
fi

exec npx prisma migrate deploy
