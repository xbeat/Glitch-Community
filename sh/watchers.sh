#!/bin/bash
set -e

bash sh/webpack.sh &

# ESLint the server files:
nodemon --watch server --exec "eslint --config server/.eslintrc.server.js server" &
  
wait