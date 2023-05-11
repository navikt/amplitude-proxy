#!/bin/bash

export AMPLITUDE_URL=https://api.eu.amplitude.com
export KAFKA_DISABLED=true
export PROJECT_KEYS='{ "project-key-prod": "*" }'

npm run-script serve
