#!/usr/bin/env bash
## Setter context først... denne skal feile om du ikke er logget inn
kubectl config use-context prod-gcp
kubectl get pods -ndataplattform
if [[ $? == 1 ]]
then
echo "Skru på navtunellen, får ikke tilgang til prod-gcp"
exit
fi

kubectl config use-context labs-gcp
kubectl get pods -ndataplattform
if [[ $? == 1 ]]
then
echo "Skru på navtunellen, får ikke tilgang til prod-gcp"
exit
fi

export RELEASE_VERSION="v$(date +%Y%m%d)"
export APPLICATION_NAME="amplitude-data"
export DOCKER_SERVER="docker.pkg.github.com/navikt/dataplattform"
export IMAGE_NAME="${DOCKER_SERVER}/${APPLICATION_NAME}:${RELEASE_VERSION}"
docker build -t ${IMAGE_NAME} .
docker push ${IMAGE_NAME}
if [[ $? == 1 ]]
then
echo "Får ikke pushet til docker.pkg.github.com"
exit
fi
echo "Pushed ${IMAGE_NAME}"
kubectl config use-context labs-gcp
sed "s#IMAGE_NAME#${IMAGE_NAME}#g" app.yaml | kubectl apply -f -
kubectl -ndataplattform rollout status deployment ${APPLICATION_NAME}
kubectl config use-context dev-gcp
sed "s#IMAGE_NAME#${IMAGE_NAME}#g" app.yaml | kubectl apply -f -
kubectl -ndataplattform rollout status deployment ${APPLICATION_NAME}
echo "Prøver å pushe til prod-gcp"
kubectl config use-context prod-gcp
sed "s#IMAGE_NAME#${IMAGE_NAME}#g" app.yaml | kubectl apply -f -
kubectl -ndataplattform rollout status deployment ${APPLICATION_NAME}
