
#! /usr/bin/env bash

branch=$(git rev-parse --abbrev-ref HEAD)
echo "building for $branch"

stage=staging
if [[ branch = "main" ]]; then
  stage=production
fi

if ng build --configuration=$stage
then
  echo "Build successful for: $stage"
else
  echo "ERROR: Build failed for: $stage"
  exit 1
fi

echo done
