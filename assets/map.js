var map;
var sidePanel;
var layerControl;
var POIs = {};
var warnings = {};
var polys = [];

function showSidepanelTab(tabName) {
  //open sidepanel
  var sp = document.getElementById("mySidepanelLeft");
  if (sp.classList.contains("closed")) {
    sp.classList.remove("closed");
    sp.classList.add("opened");
  }
  else {
    sp.classList.add("opened")
  }
  //make the tab active
  var spc = document.getElementsByClassName("sidebar-tab-link");
  for(var i=0;i<spc.length;i++){
    if (spc[i].classList.contains("active")) {
      spc[i].classList.remove("active")
    }
  }
  for(var i=0;i<spc.length;i++){
    if (spc[i].attributes["data-tab-link"].value==tabName){
      if (!spc[i].classList.contains("active")) {
        spc[i].classList.add("active")
      }
    }  
  }
   //make the tab active
   var spc = document.getElementsByClassName("sidepanel-tab-content");
   for(var i=0;i<spc.length;i++){
     if (spc[i].classList.contains("active")) {
      //save the last scroll top
      lastScrollTop[spc[i].attributes['data-tab-content'].value] = document.getElementsByClassName("sidepanel-content-wrapper")[0].scrollTop;
      if (!["tab-travel-details","tab-place"].includes(spc[i].attributes['data-tab-content'].value)){
        lastTab = spc[i].attributes['data-tab-content'].value;
      }
      spc[i].classList.remove("active");
     }
   }
   for(var i=0;i<spc.length;i++){
     if (spc[i].attributes["data-tab-content"].value==tabName){
       if (!spc[i].classList.contains("active")) {
         spc[i].classList.add("active");
         if(tabName in lastScrollTop){
          document.getElementsByClassName("sidepanel-content-wrapper")[0].scrollTop = lastScrollTop[tabName];
         }
         else{
          document.getElementsByClassName("sidepanel-content-wrapper")[0].scrollTop = 0;
         }
       }
     }  
   } 
}

function _placeOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.properties.image}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.properties.title}" title = "${e.sourceTarget.properties.title}">
     <div class="card-img-overlay">
       <div class="row justify-content-evenly"><div class="col"><a href="${e.sourceTarget.properties.pagelink}" target="_blank" class="h3" style="font-family: 'Cantora One', Arial; font-weight: 700; vertical-align: baseline; color:white; text-shadow:-1px 1px 0 #000, 1px 1px 0 #000; ">${e.sourceTarget.properties.title}</a></div><div class="col-3"></div></div>
     </div>
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(e.sourceTarget.properties.description)} <a href="${e.sourceTarget.properties.pagelink}" target="_blank"> more...</a></li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
}

function _lineOnClick(e){
  if(e.sourceTarget.feature.properties.image){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.feature.properties.image}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.feature.properties.name}" title = "${e.sourceTarget.feature.properties.name}">
     <div class="card-img-overlay">
       <div class="row justify-content-evenly"><div class="col"><a href="${e.sourceTarget.feature.properties.link}" class="h3" style="font-family: 'Cantora One', Arial; font-weight: 700; vertical-align: baseline; color:white; text-shadow:-1px 1px 0 #000, 1px 1px 0 #000; ">${e.sourceTarget.feature.properties.name}</a></div><div class="col-3"></div></div>
     </div>
     <ul class="list-group list-group-flush">
      <li class="list-group-item"><b>Distance: ${decodeURIComponent(e.sourceTarget.feature.properties.distance)} km</b> ${decodeURIComponent(e.sourceTarget.feature.properties.description)} <a href="${e.sourceTarget.feature.properties.link}"> more...</a></li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
  }
}

function _boatOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.properties.image}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.properties.name}" title = "${e.sourceTarget.properties.name}">
     <div class="card-img-overlay">
       <div class="row justify-content-evenly"><div class="col"><a target="_blank" href="${e.sourceTarget.properties.link}" class="h3" style="font-family: 'Cantora One', Arial; font-weight: 700; vertical-align: baseline; color:white; text-shadow:-1px 1px 0 #000, 1px 1px 0 #000; ">${e.sourceTarget.properties.name}</a></div><div class="col-3"></div></div>
     </div>
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(e.sourceTarget.properties.description)}</li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
}

function _swimOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.properties.image}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.properties.name}" title = "${e.sourceTarget.properties.name}">
     <div class="card-img-overlay">
       <div class="row justify-content-evenly"><div class="col"><a target="_blank" href="${e.sourceTarget.properties.link}" class="h3" style="font-family: 'Cantora One', Arial; font-weight: 700; vertical-align: baseline; color:white; text-shadow:-1px 1px 0 #000, 1px 1px 0 #000; ">${e.sourceTarget.properties.name}</a></div><div class="col-3"></div></div>
     </div>
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(e.sourceTarget.properties.description)}</li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
}

function _poiOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.properties.image}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.properties.name}" title = "${e.sourceTarget.properties.name}">
     <div class="card-img-overlay">
       <div class="row justify-content-evenly"><div class="col"><a target="_blank" href="${e.sourceTarget.properties.link}" class="h3" style="font-family: 'Cantora One', Arial; font-weight: 700; vertical-align: baseline; color:white; text-shadow:-1px 1px 0 #000, 1px 1px 0 #000; ">${e.sourceTarget.properties.name}</a></div><div class="col-3"></div></div>
     </div>
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(e.sourceTarget.properties.description)}</li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
}

function _warnOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(e.sourceTarget.properties.description)}</li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
}

async function addLine(sourceData,name){
  const response = await fetch(sourceData);
  const data = await response.json();

  let routeLayer = L.geoJSON(data, {
      style: function (feature) {
          return {color: feature.properties.stroke, weight:feature.properties.strokewidth};
      },
      filter: function(feature){
        if (feature.geometry.type != "Polygon" && feature.geometry.type != "MultiPolygon") return true;
      }
  })
  routeLayer.bindTooltip(function (layer) {
      let pop = `${layer.feature.properties.name}`;
      return pop;
  })
  routeLayer.addEventListener('click', _lineOnClick);
  routeLayer.eachLayer(lay=> {polys.push(lay)});
  layerControl.addOverlay(routeLayer, name);
  routeLayer.addTo(map);
}

async function addArrayOfPoints(url,show=false){
  const response = await fetch(url);
  if(response.status == 200){
      var pois = new L.LayerGroup();
      var poiCount = 0;
      const responseJson = await response.json();
      responseJson.forEach(element => {
        let my_icon = L.icon({iconUrl: "../assets/images/poi.png",iconSize: [24, 24], iconAnchor: [12,24]});
        let marker = L.marker([element.lat,element.lng],{icon:my_icon});
        marker.bindTooltip(decodeURI(element.name));
        marker.properties = element;
        marker.addEventListener('click', _poiOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[element.name] = element;
      });
      layerControl.addOverlay(pois, `points of interest: (${poiCount})`);
      if(show){      
        pois.addTo(map);
      }

  }  

}
async function addPlaces(url,show=false){
  const response = await fetch(url);
  if(response.status == 200){
      var pois = new L.LayerGroup();
      var poiCount = 0;
      const responseJson = await response.json();
      Object.entries(responseJson).forEach((element) => {
        const [id, place] = element;
        let poiColor = "rgb(250, 100, 100)";
        let my_icon = L.icon({iconUrl: "../assets/images/place.png",iconSize: [24, 24], iconAnchor: [12,24]});
        let marker = L.marker([place.lat,place.lng],{icon:my_icon});
        marker.bindTooltip(decodeURI(place.title));
        marker.properties = place;
        marker.addEventListener('click', _placeOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[place.title] = place;
      });
      layerControl.addOverlay(pois, `places: (${poiCount})`);
      if(show){
        pois.addTo(map);
      }
  }  

}
async function addWarningSpots(url,show=false){
  let my_icon = L.icon({iconUrl: `/assets/images/warning.png`,iconSize: [18, 18], iconAnchor: [9,18]});
  const response = await fetch(url);
  const data = await response.json();

  let routeLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:my_icon});
      },
      filter: function(feature){
        if (feature.geometry.type != "Polygon" && feature.geometry.type != "MultiPolygon") return true;
      }
  })
  routeLayer.bindTooltip(function (layer) {
      let pop = `${layer.feature.properties.name}`;
      return pop;
  })
  routeLayer.addEventListener('click', _warnOnClick);
  routeLayer.eachLayer(lay=> {polys.push(lay)});
  layerControl.addOverlay(routeLayer, "warnings");
  routeLayer.addTo(map);
}
async function addSwimSpots(url){
  const response = await fetch(url);
  if(response.status == 200){
      var pois = new L.LayerGroup();
      var poiCount = 0;
      const responseJson = await response.json();
      responseJson.forEach(element => {
        let my_icon = L.icon({iconUrl: `/assets/images/swimming.png`,iconSize: [18, 18], iconAnchor: [9,18]});
        let marker = L.marker([element.lat,element.lng],{icon:my_icon});
        marker.bindTooltip(decodeURI(element.name));
        marker.properties = element;
        marker.addEventListener('click', _swimOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[element.name] = element;
      });
      layerControl.addOverlay(pois, `swimming: (${poiCount})`);
      pois.addTo(map);
  }  
}

async function addBoatSpots(url){
  const response = await fetch(url);
  if(response.status == 200){
      var pois = new L.LayerGroup();
      var poiCount = 0;
      const responseJson = await response.json();
      responseJson.forEach(element => {
        let my_icon = L.icon({iconUrl: `/assets/images/boating.png`,iconSize: [18, 18], iconAnchor: [9,18]});
        let marker = L.marker([element.lat,element.lng],{icon:my_icon});
        marker.bindTooltip(decodeURI(element.name));
        marker.properties = element;
        marker.addEventListener('click', _boatOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[element.name] = element;
      });
      layerControl.addOverlay(pois, `boating: (${poiCount})`);
      pois.addTo(map);
  }  
}
async function getPOI(url){
  const response = await fetch(url);
  if(response.status == 200){
      var pois = new L.LayerGroup();
      var poiCount = 0;
      const responseJson = await response.json();
      let result = responseJson["features"];
      result.forEach(element => {
        let my_icon = L.icon({iconUrl: `/assets/images/poi.png`,iconSize: [18, 18], iconAnchor: [9,18]});
        let marker = L.marker([element.geometry.coordinates[1],element.geometry.coordinates[0]],{icon:my_icon});
        marker.bindTooltip(decodeURI(element.properties.name));
        marker.properties = element;
        marker.addEventListener('click', _poiMarkerOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[element.label] = element;
      });
      layerControl.addOverlay(pois, `points of interest: (${poiCount})`);
      pois.addTo(map);
  }  
}
function loadMap(){
  map = L.map('map').setView([52.3322, -0.2773], 9);
  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  var img = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
  var top = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'});
  var rel = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri',maxZoom: 13});

  var baseMaps = {
      "OpenStreetMap":osm,
      "Satelite":img,
      "Topological":top,
      "Shaded relief":rel
  }
  layerControl = L.control.layers(baseMaps).addTo(map);
  return true;
}
function loadWaterbodies(){
  let a = loadMap();
  addLine(`/assets/data/GreatOuse.geojson`,"Great Ouse");
}
function loadSwims(){
  let a = loadMap();
  addLine(`/assets/data/GreatOuse.geojson`,"Great Ouse");
  addSwimSpots(`/assets/data/swimming.json`);
}
function loadBoats(){
  let a = loadMap();
  addLine(`/assets/data/GreatOuse.geojson`,"Great Ouse");
  addBoatSpots(`/assets/data/boating.json`);
}
function loadWalks(){
  let a = loadMap();
  addLine(`/assets/data/walks.geojson`,"Walks");
  addArrayOfPoints(`/assets/data/poi.json`,false);
}

function loadOVW(){
  let a = loadMap();
  addLine(`/assets/data/HeadwatersSyreshamtoBedford.geojson`,"Headwaters: Syresham to Bedford");
  addLine(`/assets/data/NavigationBedfordtoEarith.geojson`,"Navigation: Bedford to Earith");
  addLine(`/assets/data/FensEarithtoEly.geojson`,"Fens: Earith to Ely");
  addArrayOfPoints(`/assets/data/poi.json`,false);
  addPlaces(`/assets/data/places.json`,false);
}
function loadOVWLeg(lat,lng,level){
  let a = loadMap();
  addLine(`/assets/data/HeadwatersSyreshamtoBedford.geojson`,"Headwaters: Syresham to Bedford");
  addLine(`/assets/data/NavigationBedfordtoEarith.geojson`,"Navigation: Bedford to Earith");
  addLine(`/assets/data/FensEarithtoEly.geojson`,"Fens: Earith to Ely");
  addArrayOfPoints(`/assets/data/poi.json`,true);
  addPlaces(`/assets/data/places.json`,true);
  addWarningSpots('/assets/data/warning.geojson');
  //zoom to 
  map.flyTo([lat,lng],level)
}
