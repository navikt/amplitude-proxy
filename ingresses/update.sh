#!/usr/bin/env bash
for context in dev-sbs dev-fss prod-sbs prod-fss dev-gcp prod-gcp; do
    kubectl get app -o json -A --context $context > "tmp/$context.json";
done
node src/create-index.js
