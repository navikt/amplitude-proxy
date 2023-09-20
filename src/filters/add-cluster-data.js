const cleanUrl = require('../utils/clean-url');
const validUrl = require('../utils/valid-url');

const addClusterData = (inputEvents, getIngressData, ingresses, usingNewSdk) => {
  const outputEvents = [];
  inputEvents.forEach(event => {
    const cloneEvent = { ...event };  
    cloneEvent.event_properties = event.event_properties || {};
    
    let eventUrl;
    //sjekker om platform i event_properties er satt og bruker den istedet
    if(event.event_properties.platform) {
      eventUrl = event.event_properties.platform
      //sjekker om url ble også satt i platform og nullstiller det til 'Web'
      if(validUrl(cloneEvent.platform)){
        cloneEvent.platform = 'Web'
      }
    } 
    //dersom platform i event_prorties er ikke satt vil koden hente url utifra om ny sdk-et er brukt
    else {
      if(usingNewSdk){ 
        eventUrl = event.ingestion_metadata.source_name
      } else {
        //Setter platfrom til Web kun om du bruker den gamle måte (dvs. endrer setter platform under initialisering)
        eventUrl = event.platform
        cloneEvent.platform = 'Web'; // Correct this back to the original.
      }
    }

    if(eventUrl.includes('localhost')) {
      eventUrl = eventUrl.replace(/\:[0-9]+/g,'')
    }
    const ingressData = getIngressData(eventUrl, ingresses);
    if (ingressData) {
      Object.keys(ingressData).forEach(key => {
        if (key !== "creationTimestamp") {
          cloneEvent.event_properties[key] = ingressData[key];
        }
      });
    }

    const cleanedEventUrl = cleanUrl(eventUrl);
    const eventUrlObj = new URL(cleanedEventUrl);
    cloneEvent.event_properties.url = eventUrlObj.hostname + eventUrlObj.pathname;
    cloneEvent.event_properties.hostname = eventUrlObj.hostname;
    cloneEvent.event_properties.pagePath = eventUrlObj.pathname;
    outputEvents.push(cloneEvent);
  });
  return outputEvents;
};

module.exports = addClusterData;
