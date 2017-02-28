#!/bin/sh

# usage: push-gh-pages DIRECTORY # DIRECTORY is where GitHub pages contents are in (eg. build)

set -e

# Echo commands
# set -x

remote=$(git config remote.origin.url)
described_rev=$(git rev-parse HEAD | git name-rev --stdin)

default_dist_dir="dist"

current_dir="$(pwd)"
dist_dir="${1:-$default_dist_dir}"
dist_dir="$current_dir/$dist_dir"
deploy_dir="$current_dir/.deploy"

if [ ! -d "$dist_dir" ]; then
  echo "Usage: $0 DIRECTORY"
  exit 1
fi

if [ ! -d "$deploy_dir" ]; then
  mkdir -p "$deploy_dir"
fi

cd "$deploy_dir"

cdup=$(git rev-parse --show-cdup)
if [ "$cdup" != '' ]; then
  git init
  git remote add --fetch origin "$remote"
fi

if git rev-parse --verify origin/gh-pages > /dev/null 2>&1; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

rm -rf "$deploy_dir"/*
cp -R "$dist_dir"/* "$deploy_dir"

git add .
git commit -m "pages built at $described_rev" -e
git push origin gh-pages
