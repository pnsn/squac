
#! /usr/bin/env bash
source .env
# After tests and linting pass

if [[ $# -lt 1 ]] ; then
    echo 'please provide environment'
    echo 'production|staging' 
    exit 1
fi
stage=staging
dest_dir=$STAGING_DIR
if [[ "$1" = "production" ]] ; then
    stage=production
    dest_dir=$PRODUCTION_DIR
fi

if ng build --configuration=$stage
then
  echo "Build successful for: $stage"
else
  echo "ERROR: Build failed for: $stage"
  exit 1
fi

echo done

