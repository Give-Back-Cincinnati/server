#!/bin/sh
set -e

# load env from vault in prod
if [ "$NODE_ENV" = "production" ]; then
    echo "source"
    source /vault/secrets/env
    # echo "yarn permissions:seed"
    # yarn permissions:seed
    echo "yarn ts-node --transpile-only src/app.ts"
    exec yarn ts-node src/app.ts
    #  exec yarn ts-node src/app.ts
fi

# load env from .env
if [ "$NODE_ENV" != "production" ]; then
    source .env
    yarn permissions:seed
    # prettify pino logs in development
    exec yarn nodemon src/app.ts | yarn pino-pretty
fi
