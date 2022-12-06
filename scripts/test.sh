#! /usr/bin/env bash

# empty dist folder
rm -rf dist

echo "Linting squacapi library..."
npm run lint-silent squacapi

echo "Building squacapi library..."
ng build squacapi

echo "Linting widgets library..."
npm run lint-silent widgets

echo "Building widgets library..."
ng build widgets

echo "Linting squac-ui app..."
npm run lint-silent squac-ui

echo "Running tests..."
npm run test-headless
