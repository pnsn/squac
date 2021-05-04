#! /usr/bin/env bash
ng build --configuration=production
echo 'Building production configuration'

~/.local/bin/aws s3 sync dist s3://squac.pnsn.org --region=us-west-2 --delete

echo 'Deploying to AWS'
