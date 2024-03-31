#!/bin/sh
# safe-prettier-fix.sh
npx prettier "$@" --write || true