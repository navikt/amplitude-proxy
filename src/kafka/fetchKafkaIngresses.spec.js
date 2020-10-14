const assert = require('assert');
const fetchKafkaIngresses = require('./fetchKafkaIngresses')
const getIngressExceptionPath = require('../data/ingressException-path')
const ingressException = require(getIngressExceptionPath())

describe('Fetch Kafka ingresses', function () {
  it('data should be transformed', function () {

    const ingresses = new Map()

    // add ingress exception data to map of ingresses
    ingressException.forEach(data => { ingresses.set(data.ingress, data)})

    ingresses.set("https://data.nais.preprod.local/apier", {
      "app": "data-catalog-api-viewer",
      "team": "dataplattform",
      "namespace": "default",
      "version": "2020-09-14--7aa9d15",
      "context": "dev-fss",
      "ingress": "https://data.nais.preprod.local/apier"
    })

    const jsonTestData = JSON.parse("{\"object\": {\"apiVersion\": \"nais.io/v1alpha1\", \"kind\": \"Application\", \"metadata\": {\"annotations\": {\"nais.io/deploymentCorrelationID\": \"3239908c-3bfe-41d8-be8e-85b8ca94cb61\"}, \"creationTimestamp\": \"2020-01-14T12:36:38Z\", \"generation\": 134, \"labels\": {\"team\": \"dataplattform\"}, \"name\": \"dakan-api-viewer\", \"namespace\": \"dataplattform\", \"resourceVersion\": \"2204093870\", \"selfLink\": \"/apis/nais.io/v1alpha1/namespaces/dataplattform/applications/dakan-api-viewer\", \"uid\": \"dcd812e2-82de-4144-9cc7-52b6fcfdc372\"}, \"spec\": {\"image\": \"docker.pkg.github.com/navikt/dakan/dakan-api-viewer:2020-09-14--7aa9d15\", \"ingresses\": [\"https://data.nais.preprod.local/apier\", \"https://data.dev-fss.nais.io/apier\"], \"liveness\": {\"failureThreshold\": 30, \"initialDelay\": 5, \"path\": \"/apier/isAlive\", \"periodSeconds\": 5, \"timeout\": 1}, \"port\": 80, \"prometheus\": {\"enabled\": true, \"path\": \"/apier\"}, \"readiness\": {\"failureThreshold\": 30, \"initialDelay\": 5, \"path\": \"/apier/isReady\", \"periodSeconds\": 5, \"timeout\": 1}, \"replicas\": {\"cpuThresholdPercentage\": 70, \"max\": 2, \"min\": 2}, \"resources\": {\"limits\": {\"cpu\": \"400m\", \"memory\": \"512Mi\"}, \"requests\": {\"cpu\": \"50m\", \"memory\": \"128Mi\"}}, \"vault\": {\"enabled\": true, \"paths\": [{\"kvPath\": \"secret/dataplattform/datakatalog/preprod_fss\", \"mountPath\": \"/var/run/secrets/nais.io/common\"}]}}, \"status\": {\"correlationID\": \"3239908c-3bfe-41d8-be8e-85b8ca94cb61\", \"deploymentRolloutStatus\": \"complete\", \"rolloutCompleteTime\": 1600084931952750880, \"synchronizationHash\": \"b8515745917fb9d9\", \"synchronizationState\": \"RolloutComplete\", \"synchronizationTime\": 1600084891098839986}}, \"raw_object\": {\"apiVersion\": \"nais.io/v1alpha1\", \"kind\": \"Application\", \"metadata\": {\"annotations\": {\"nais.io/deploymentCorrelationID\": \"3239908c-3bfe-41d8-be8e-85b8ca94cb61\"}, \"creationTimestamp\": \"2020-01-14T12:36:38Z\", \"generation\": 134, \"labels\": {\"team\": \"dataplattform\"}, \"name\": \"dakan-api-viewer\", \"namespace\": \"dataplattform\", \"resourceVersion\": \"2204093870\", \"selfLink\": \"/apis/nais.io/v1alpha1/namespaces/dataplattform/applications/dakan-api-viewer\", \"uid\": \"dcd812e2-82de-4144-9cc7-52b6fcfdc372\"}, \"spec\": {\"image\": \"docker.pkg.github.com/navikt/dakan/dakan-api-viewer:2020-09-14--7aa9d15\", \"ingresses\": [\"https://data.nais.preprod.local/apier\", \"https://data.dev-fss.nais.io/apier\"], \"liveness\": {\"failureThreshold\": 30, \"initialDelay\": 5, \"path\": \"/apier/isAlive\", \"periodSeconds\": 5, \"timeout\": 1}, \"port\": 80, \"prometheus\": {\"enabled\": true, \"path\": \"/apier\"}, \"readiness\": {\"failureThreshold\": 30, \"initialDelay\": 5, \"path\": \"/apier/isReady\", \"periodSeconds\": 5, \"timeout\": 1}, \"replicas\": {\"cpuThresholdPercentage\": 70, \"max\": 2, \"min\": 2}, \"resources\": {\"limits\": {\"cpu\": \"400m\", \"memory\": \"512Mi\"}, \"requests\": {\"cpu\": \"50m\", \"memory\": \"128Mi\"}}, \"vault\": {\"enabled\": true, \"paths\": [{\"kvPath\": \"secret/dataplattform/datakatalog/preprod_fss\", \"mountPath\": \"/var/run/secrets/nais.io/common\"}]}}, \"status\": {\"correlationID\": \"3239908c-3bfe-41d8-be8e-85b8ca94cb61\", \"deploymentRolloutStatus\": \"complete\", \"rolloutCompleteTime\": 1600084931952750880, \"synchronizationHash\": \"b8515745917fb9d9\", \"synchronizationState\": \"RolloutComplete\", \"synchronizationTime\": 1600084891098839986}}, \"cluster\": \"dev-fss\"}")


    const expected = new Map()
    
    // add ingress exception data to map of ingresses
    ingressException.forEach(data => { expected.set(data.ingress, data)})

    expected.set("https://data.nais.preprod.local/apier", {
      "app": "dakan-api-viewer",
      "team": "dataplattform",
      "namespace": "dataplattform",
      "version": "2020-09-14--7aa9d15",
      "context": "dev-fss",
      "ingress": "https://data.nais.preprod.local/apier"
    })

    expected.set("https://data.dev-fss.nais.io/apier", {
      "app": "dakan-api-viewer",
      "team": "dataplattform",
      "namespace": "dataplattform",
      "version": "2020-09-14--7aa9d15",
      "context": "dev-fss",
      "ingress": "https://data.dev-fss.nais.io/apier",
    })

    fetchKafkaIngresses(ingresses ,jsonTestData)

    assert.deepStrictEqual(ingresses, expected);

  });
});