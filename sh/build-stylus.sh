#!/bin/bash
cd ~/

# This script builds the contents of the ~/stylus folder.
# On success, we move styles.css to public/

# n.b. we're deliberately avoiding using `stylus --watch` because"
# 1. it tends to crash
# 2. while the build is underway, it tends to mangle the output file and break the site
#
# To fix this, we use nodemon to watch for changes to .styl files,
# then call this build script.

echo "Starting Stylus build"

stylus \
  --use autoprefixer-stylus \
  --sourcemap \
  styles/styles.styl

stylus_status=$?
# If it built, update styles.css
if [ $stylus_status -eq 0 ]; then
  echo "Stylus build success, updating css..."
  mv styles/styles.css public/styles.css
  mv styles/styles.css.map public/styles.css.map
  echo "CSS updated"
else
  echo "Stylus build failed"
fi