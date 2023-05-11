# Amplitude Proxy i Origo

## Kjøre lokalt

    ./origo-serve.sh

## Docker

Bygge og kjøre lokalt:

    docker build --platform linux/amd64 -t 371800739114.dkr.ecr.eu-west-1.amazonaws.com/amplitude-proxy:<version> .
    docker run --env-file ./origo-serve-docker.env -p4242:4242 371800739114.dkr.ecr.eu-west-1.amazonaws.com/amplitude-proxy:<version>

Pushe til ECR:

    aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 371800739114.dkr.ecr.eu-west-1.amazonaws.com/amplitude-proxy
    docker push 371800739114.dkr.ecr.eu-west-1.amazonaws.com/amplitude-proxy:<version>

## Infrastruktur i AWS

Testet ut i AppRunner i `teknologi-dev`:\
https://github.com/oslokommune/origo-aws-iac/pull/68
