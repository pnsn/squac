
#! /usr/bin/env bash
source .env

if [[ $# -lt 2 ]] ; then
    echo 'please provide environment and git branch'
    echo 'production|staging master' 
    exit 1
fi
stage=staging
dest_dir=/var/www/staging-squac/
if [[ "$1" = "production" ]] ; then
    stage=production
    dest_dir=/var/www/squac/
fi
branch=$2

#build it
if ng build --configuration=$stage
then
  echo "Build successful for: $stage"
else
  echo "ERROR: Build failed for: $stage"
  exit 1
fi

build_dir=/dist/squac_ui/*

echo "SSH into $DEPLOY_HOST as $DEPLOY_USER"
ssh $DEPLOY_USER@$DEPLOY_HOST

# echo "Removing files from: $dest_dir"
# cd /var/www

# exit

# echo "Deploying to: $dest_dir"
# scp build_dir $DEPLOY_USER@$DEPLOY_HOST:$dest_dir 

# after linting and running tests
# ng build --c=[Environment]
# ssh into host
# remove existing files -> is that safe??
# maybe print something to confirm
# scp files from /dist/squac_ui/* to destination

