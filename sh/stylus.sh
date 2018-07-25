#!/bin/bash

# Two processes are needed to handle stylus.

# This first is to invoke stylus --watch so that we get speedy stylus builds:
bash sh/stylus-watcher.sh &

# The second is to notice its output, then move it to /public/
# Stylus generates the .map _after_ it generates the .css, so monitor the .map file
# to determine when the build has completed.
nodemon --exec "bash sh/stylus-mover.sh" --watch styles/styles.css.map &