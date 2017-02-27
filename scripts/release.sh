#!/bin/bash
set -euv

sh -c "NODE_ENV=production npm run build"
cp LICENSE README.md package.json lib/
sh -c "cd lib; npm publish"
