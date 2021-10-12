# amplitude-proxy
Application that whitelists and forwards traffic to amplitudes servers. 
This improves privacy concerns related to tracking user behavior events.
All applications must use this proxy and is not allowed to send events 
directly to Amplitude.

The application translates IP-adresses to locations, using [geoip-lite](https://www.npmjs.com/package/geoip-lite).
The proxy uses [isbot](https://www.npmjs.com/package/isbot) to filter out
bot traffic at the source.


# Prerequisites
- Install node.js
- Install homebrew(for Mac)
- Docker installed and running

## **Install**
`npm install`

## **Run**
`npm run-script serve`

App runs on

`localhost:4242`

Test with postman against: `http://localhost:4242/collect`


## The auto-collect endpoint
This endpoint require some config. The projects will be mapped
to urls. Atm this is not done in a very generic way.
```
{
  "project-key-prod": "prod-sbs,prod-fss,prod-gcp",
  "project-key-preprod": "dev-sbs,dev-fss,dev-gcp,labs-gcp",
  "project-key-test": "*"
}
```
This config might either be in a json-file 
`PROJECT_KEYS_FILE` or as stringified json in an envvar `PROJECT_KEYS` 

The datasource looks like this and is taken from our kubernetes cluster:

```
  [{
    "app": "app-name",
    "team": "team-name",
    "namespace": "default",
    "version": "app-version",
    "context": "dev-sbs",
    "ingress": "https://my-app.example.com/somepath"
  }]
```

This way most of our urls can be mapped.

## Ingress log

Log data for ingresses are saved in a local file called ingresses.log. This file can be found in the /tmp folder.
