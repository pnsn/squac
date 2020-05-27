
#! /usr/bin/env bash
source .env
# After tests and linting pass

if [[ $# -lt 2 ]] ; then
    echo 'please provide environment and git branch'
    echo 'production|staging master' 
    exit 1
fi
stage=staging
dest_dir=$STAGING_DIR
if [[ "$1" = "production" ]] ; then
    stage=production
    dest_dir=$PRODUCTION_DIR
fi
branch=$2

if ng build --configuration=$stage
then
  echo "Build successful for: $stage"
else
  echo "ERROR: Build failed for: $stage"
  exit 1
fi

echo "SSH into $DEPLOY_HOST as $DEPLOY_USER"
ssh $DEPLOY_USER@$DEPLOY_HOST $DEPLOY_SCRIPT $stage

echo "Deploying to: $dest_dir"
scp $BUILD_DIR $DEPLOY_USER@$DEPLOY_HOST:$dest_dir 

echo done

