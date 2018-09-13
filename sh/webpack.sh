#!/bin/bash

# Webpack will occassionally crash, so run it in a loop so that it'll come back to life on failure.

echo "Starting webpack watcher"

while true; do
  pnpx webpack --watch
  
  echo "Webpack crashed; Restarting webpack --watch"
done
