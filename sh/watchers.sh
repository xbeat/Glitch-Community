#!/bin/bash
set -e

nodemon --exec "bash sh/compile-jade.sh" --watch src/templates --ext .jade &
#nodemon --exec "bash sh/build-stylus.sh" --watch styles --ext .styl &
bash sh/webpack.sh &

# ESLint the server files:
nodemon --exec "eslint --config server/.eslintrc.server.js server --cache" --watch server &
  
wait