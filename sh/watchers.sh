#!/bin/bash
set -e

bash sh/stylus.sh &
bash sh/webpack.sh &
# ESLint the server files:
nodemon --exec "eslint --config server/.eslintrc.server.js server --cache" --watch server &
  
wait