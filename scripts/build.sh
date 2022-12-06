#! /usr/bin/env bash

if [[ $# -lt 1 ]]
then
  stage=staging
else
  stage=$1
fi
echo "Building with configuration for $stage"
if ng build --configuration=$stage squac-ui
then
  echo "Build successful for: $stage"
else
  echo "ERROR: Build failed for: $stage"
  exit 1
fi

mv dist/squac-ui/* dist
rm dist/squac-ui

echo done

