#!/bin/bash

# --- Configuration ---

# Firebase project alias for your API key (ensure this is correctly configured in your Firebase project).
API_KEY_ALIAS="apikey.avantutoraikey"

# Firebase functions project alias
PROJECT_ALIAS="avanaitutor-com"

# --- Set environment variable, build and deploy ---

# Get the API key from firebase functions config, and set the environment variable
export VITE_API_KEY=$(firebase functions:config:get ${API_KEY_ALIAS} --project ${PROJECT_ALIAS})

# Show message if the API key was not set correctly
if [ -z "$VITE_API_KEY" ]; then
    echo "Error: VITE_API_KEY not set. Please check the Firebase configuration for ${API_KEY_ALIAS}."
    exit 1
fi

echo "VITE_API_KEY set to: $VITE_API_KEY"

# Build the React application
echo "Building the React application..."
npm run build

# Deploy to Firebase Hosting with the environment variable again
export VITE_API_KEY=$(firebase functions:config:get ${API_KEY_ALIAS} --project ${PROJECT_ALIAS})
echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting --project ${PROJECT_ALIAS}

echo "Deployment completed successfully!"