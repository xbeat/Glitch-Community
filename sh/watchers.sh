#!/bin/bash
set -e

nodemon --exec "bash sh/compile-jade.sh" --watch src/templates --ext .jade &
pnpx webpack --watch &
bash sh/stylus.sh &

# ESLint the server files:
nodemon --exec "eslint --config server/.eslintrc.server.js server --cache" --watch server &
  
wait