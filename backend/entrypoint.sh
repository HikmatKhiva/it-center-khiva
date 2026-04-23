#!/bin/sh
set -e

# Run migrations
npx prisma migrate deploy

# Start server (inherits signals)
exec npm run server