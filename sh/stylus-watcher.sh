#!/bin/bash

# This script builds the contents of the ~/stylus folder.

# We need to use `stylus --watch` to get good build times, however"
# 1. it tends to crash
# 2. while the build is underway, it tends to mangle the output file and break the site
#
# To fix this, we run the watcher in a loop to handle crashes,
# and we use a seperate nodemon process to notice changes to the
# output files and promote them to /public/ 

echo "Starting stylus watcher"

while true; do
  stylus \
    --watch \
    --use autoprefixer-stylus \
    --sourcemap \
    --compress styles/styles.styl \
    --out styles/styles.css
  
  echo "Stylus watcher crashed; Restarting."
done