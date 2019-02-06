#!/bin/bash
set -e

# ESLint the server files:
nodemon --max_old_space_size= --watch server --watch shared --exec "eslint --config server/.eslintrc.server.js server shared webpack.config.js" &
  
wait