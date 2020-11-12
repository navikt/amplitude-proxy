# amplitude-proxy
Application that whitelists and forwards traffic to amplitudes servers. 
This improves privacy concerns related to tracking user behavior events.
All applications must use this proxy and is not allowed to send events 
directly to Amplitude.

The application translates IP-adresses to locations, using `geoip-lite`.


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


## Auto-collect (POC/DRAFT)
This endpoint require some config. Theese projects will be mapped
to urls. Atm this is not done in a very generic way.
```
{
  "project-key-prod": "prod-sbs,prod-fss,prod-gcp",
  "project-key-preprod": "dev-sbs,dev-fss,dev-gcp,labs-gcp",
  "project-key-test": "*"
}
```

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

