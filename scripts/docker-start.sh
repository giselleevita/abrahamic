#!/usr/bin/env bash
set -euo pipefail

npx prisma migrate deploy
npm run db:seed
exec npm start -- --hostname 0.0.0.0
