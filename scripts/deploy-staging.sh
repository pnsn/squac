
#! /usr/bin/env bash
ng build --configuration=staging
echo 'Building staging configuration'

~/.local/bin/aws s3 sync dist s3://staging-squac.pnsn.org --region=us-west-2 --delete

echo 'Deploying to AWS'