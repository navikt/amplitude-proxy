#!/usr/bin/env bash
for context in dev-sbs dev-fss prod-sbs prod-fss dev-gcp prod-gcp labs-gcp; do
    echo "Fetching $context from kubernetes"
    kubectl get app -o json -A --context $context > "tmp/$context.json";
done
echo "Creating ingresses index"
node src/create-index.js
echo "Done"
