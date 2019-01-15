#!/bin/bash
set -e

# ESLint the server files:
nodemon --watch server --watch shared --exec "eslint --config server/.eslintrc.server.js server shared webpack.config.js" &
  
wait