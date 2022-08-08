#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

git checkout -b master
git add -A
git commit -m 'deploy'

git push -f git@github.com:linxianxi/vue-use-sync-url.git main:gh-pages

cd -
