#!/bin/bash

export MIX_ENV=prod
export PORT=4706

CFGD=$(readlink -f ~/.config/gostudy)

if [ ! -e "$CFGD/base" ]; then
    echo "run deploy first"
    exit 1
fi

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://gostudy:$DB_PASS@localhost/gostudy

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/api/bin/api start