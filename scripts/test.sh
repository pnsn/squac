#! /usr/bin/env bash
echo "Linting squacapi library..."
npm run lint-silent squacapi

echo "Testing squacapi library..."
npm run test-headless squacapi

echo "Building squacapi library..."
ng build squacapi

echo "Linting widgets library..."
npm run lint-silent widgets

echo "Testing widgets library..."
npm run test-headless widgets

echo "Building widgets library..."
ng build widgets

echo "Linting squac-ui app..."
npm run lint-silent squac-ui

echo "Testing squac-ui app..."
npm run test-headless squac-ui
