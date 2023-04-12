# amplitude-proxy
Application that whitelists and forwards traffic to amplitudes servers. 
This improves privacy concerns related to tracking user behavior events.
All applications must use this proxy and is not allowed to send events 
directly to Amplitude.

The application translates IP-adresses to locations, using [geoip-lite](https://www.npmjs.com/package/geoip-lite).
The proxy uses [isbot](https://www.npmjs.com/package/isbot) to filter out
bot traffic at the source.

The application uses regex and goes through all urls in the event object and cleans it of sensitive data (uuid and personid).

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
This endpoint require some config. 

To properly use this endpoint the user must change some config when initialising amplitude.

When using the old SDK (example: "amplitude-js"), the user must set `Platfrom` to `window.location.toString()`

```
amplitude.getInstance().init('default', undefined, {
  apiEndpoint: 'amplitude.nav.no/collect-auto',
  platform: window.location.toString(),
})
```

When using the new SDK (example: "@amplitude/analytics-browser"), the user must set `source name` to `window.location.toString()` under the `Ingestion metadata` config

```
init('default', undefined, {
  apiEndpoint: 'amplitude.nav.no/collect-auto',
  ingestionMetadata: {
    sourceName: window.location.toString()
    },
})
```

The projects will be mapped to urls. Atm this is not done in a very generic way.
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
