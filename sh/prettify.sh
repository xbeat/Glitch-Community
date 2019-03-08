#!/bin/bash
# Runs `prettier` on our code
npx prettier --config /app/.prettierrc --write "/app/{server,src}/**/*.js"