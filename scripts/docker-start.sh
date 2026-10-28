#!/usr/bin/env bash
set -euo pipefail

bash scripts/migrate-deploy.sh
npm run db:seed
exec npm start -- --hostname 0.0.0.0
