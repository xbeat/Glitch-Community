#!/bin/bash
set -e

# ESLint the server files:
nodemon --watch server --exec "eslint --config server/.eslintrc.server.js server webpack.config.js" &
  
wait