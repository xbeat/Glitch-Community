#!/bin/bash

# Stylus --watch has two problems that we're working around:
# 1. it tends to crash
# 2. while the build it underway, in mangles the output file
#
# To fix this, we watch .styl with nodemon and call this build script,
# and then after a successful build, we move our compliation to the output.

echo "Starting Stylus Build"

# move to app folder so this script is dependant on the location of the caller
cd ~/

# Build it!
stylus \
  --use autoprefixer-stylus \
  --sourcemap \
  --compress styles/styles.styl \
  --out styles/styles.css.tmp

stylus_status = $?
# If it built, update styles.css
if [ $stylus_status -eq 0 ]; then
  mv styles/styles.css.tmp public/styles.css
  echo "Styles updated."
else
  echo "Stylus build failed."
fi