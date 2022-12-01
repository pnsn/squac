
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

echo "SSH into $DEPLOY_HOST as $DEPLOY_USER"
ssh $DEPLOY_USER@$DEPLOY_HOST $DEPLOY_SCRIPT $stage

echo "Deploying to: $dest_dir"
scp -r $BUILD_DIR $DEPLOY_USER@$DEPLOY_HOST:$dest_dir 

echo done

