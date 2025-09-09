#!/bin/bash
cd /home/kavia/workspace/code-generation/detox-in-e-commerce-platform-131676-131685/detox_in_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

