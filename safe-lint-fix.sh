#!/bin/sh
# lint-fix.sh
npx eslint "$@" --fix || true
