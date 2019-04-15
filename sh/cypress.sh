#!/bin/bash

# npx cypress run --headed --no-exit --config pageLoadTimeout=360000 baseUrl=https://$1.glitch.me
npx cypress open --config baseUrl=https://$1.glitch.me
