# amplitude-proxy
Application that whitelists and forwards traffic to amplitudes servers. 
This improves privacy concerns related to tracking user behavior events.
All applications must use this proxy and is not allowed to send events directly to Amplitude.

# Prerequisites
- Install node.js
- Install homebrew(for Mac)

## **Install**

`npm install`

## **Run**

`npm run-script serve`

App runs on

`localhost:4242`

Test with postman against 

`localhost:4242/collect`