#!/bin/bash

# Webpack will occassionally crash, so run it in a loop so that it'll come back to life on failure.

eslint --config server/.eslintrc.server.js webpack.config.js

echo "Starting webpack watcher"

while true; do
  NODE_OPTIONS="--max-old-space-size=384" webpack --watch --info-verbosity verbose
  
  echo "Webpack crashed; Restarting webpack --watch"
done
