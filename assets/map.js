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
function _obstacleOnClick(e){
  console.log(e.sourceTarget.properties)
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
function _fishOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.properties.image}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.properties.name}" title = "${e.sourceTarget.properties.name}">
     <div class="card-img-overlay">
       <div class="row justify-content-evenly"><div class="col"><a target="_blank" href="${e.sourceTarget.properties.link}" class="h3" style="font-family: 'Cantora One', Arial; font-weight: 700; vertical-align: baseline; color:white; text-shadow:-1px 1px 0 #000, 1px 1px 0 #000; ">${e.sourceTarget.properties.name}</a></div><div class="col-3"></div></div>
     </div>
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(e.sourceTarget.properties.details)}</li>
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
function _chatOnClick(e){
  popup_text = `
    <div class="card mb-4">
      <img src="${e.sourceTarget.properties.image}" class="card-img-top" alt="${e.sourceTarget.properties.heading}">
      <div class="card-body">
        <h5 class="card-title">${e.sourceTarget.properties.heading}</h5>
        <p class="card-text">${e.sourceTarget.properties.about}</p>
        <audio controls>
          <source src="${e.sourceTarget.properties.filepath}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
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
    //var pois = new L.LayerGroup();
    var pois = L.markerClusterGroup({maxClusterRadius:20});
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
  let my_icon = L.icon({iconUrl: `/assets/images/warning.png`,iconSize: [24, 24], iconAnchor: [12,24]});
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
      //var pois = new L.LayerGroup();
      var pois = L.markerClusterGroup({maxClusterRadius:20});
      var poiCount = 0;
      const responseJson = await response.json();
      responseJson.forEach(element => {
        let my_icon = L.icon({iconUrl: `/assets/images/swimming.png`,iconSize: [24, 24], iconAnchor: [12,24]});
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
        let my_icon = L.icon({iconUrl: `/assets/images/boating.png`,iconSize: [24, 24], iconAnchor: [12,24]});
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
async function addObstacles(url,obstacle_type,icon=`/assets/images/warning.png`){
  const response = await fetch(url);
  if(response.status == 200){
      //var pois = new L.LayerGroup();
      var pois = L.markerClusterGroup({maxClusterRadius:20});
      var poiCount = 0;
      const responseJson = await response.json();
      responseJson.forEach(element => {
        let my_icon = L.icon({iconUrl: icon,iconSize: [24, 24], iconAnchor: [12,24]});
        if(element.id){
          if(element.properties.obstacle_type == obstacle_type){
            let marker = L.marker([element.geometry.coordinates[1],element.geometry.coordinates[0]],{icon:my_icon});
            marker.bindTooltip(decodeURI(element.properties.obstacle_type));
            marker.properties = element.properties;
            marker.addEventListener('click', _obstacleOnClick);
            marker.addTo(pois);
            poiCount ++ ;
            POIs[element.name] = element;
          }
        }
      });
      layerControl.addOverlay(pois, `${obstacle_type}: (${poiCount})`);
      pois.addTo(map);
  }  
}
async function addAnglingSpots(url){
  const response = await fetch(url);
  if(response.status == 200){
      //var pois = new L.LayerGroup();
      var pois = L.markerClusterGroup({maxClusterRadius:20});
      var poiCount = 0;
      const responseJson = await response.json();
      responseJson.forEach(element => {
        let my_icon = L.icon({iconUrl: `/assets/images/angling.png`,iconSize: [24, 24], iconAnchor: [12,24]});
        let marker = L.marker([element.lat,element.lng],{icon:my_icon});
        marker.bindTooltip(decodeURI(element.name));
        marker.properties = element;
        marker.addEventListener('click', _fishOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[element.name] = element;
      });
      layerControl.addOverlay(pois, `angling: (${poiCount})`);
      pois.addTo(map);
  }  
}
async function addChats(url){
  const response = await fetch(url);
  if(response.status == 200){
    //var pois = new L.LayerGroup();
    var pois = L.markerClusterGroup({maxClusterRadius:20});
    var poiCount = 0;
    const responseJson = await response.json();
    Object.entries(responseJson).forEach((element) => {
      const [id, chats] = element;
      chats.forEach(chat=>{
        let my_icon = L.icon({iconUrl: `/assets/images/audio.png`,iconSize: [24, 24], iconAnchor: [12,24]});
        let marker = L.marker([chat.latitude,chat.longitude],{icon:my_icon});
        marker.bindTooltip(decodeURI(chat.heading));
        marker.properties = chat;
        marker.addEventListener('click', _chatOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        POIs[chat.heading] = chat;
      });
    });
    layerControl.addOverlay(pois, `audio: (${poiCount})`);
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
        let my_icon = L.icon({iconUrl: `/assets/images/poi.png`,iconSize: [24, 24], iconAnchor: [12,24]});
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
function loadPaddles(){
  let a = loadMap();
  addLine(`/assets/data/GreatOuse.geojson`,"Great Ouse");
  addObstacles(`/assets/data/obstacles.geojson`,"weir",'/assets/images/weir.png');
  addObstacles(`/assets/data/obstacles.geojson`,"ford",'/assets/images/water.png');
  addObstacles(`/assets/data/obstacles.geojson`,"lock",'/assets/images/weir.png');
  addObstacles(`/assets/data/obstacles.geojson`,"waterfall",'/assets/images/water.png');
  addObstacles(`/assets/data/obstacles.geojson`,"dam",'/assets/images/weir.png');
  addObstacles(`/assets/data/obstacles.geojson`,"complex_barrier",'/assets/images/weir.png');
  addObstacles(`/assets/data/obstacles.geojson`,"mill",'/assets/images/sluice.png');
  addObstacles(`/assets/data/obstacles.geojson`,"sluice",'/assets/images/sluice.png');
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
  addChats(`/assets/data/recordings.json`,false);
  const myRePlace = RegExp('.+place=(\\w+)', 'g');
  if(myArray = myRePlace.exec(window.location.href)){showPic(myArray[1]);}
  const myReChat = RegExp('.+chat=(\\w+)', 'g');
  if(myArray = myReChat.exec(window.location.href)){showChat(myArray[1]);}
}
function loadOVWLeg(lat,lng,level){
  let a = loadMap();
  addLine(`/assets/data/HeadwatersSyreshamtoBedford.geojson`,"Headwaters: Syresham to Bedford");
  addLine(`/assets/data/NavigationBedfordtoEarith.geojson`,"Navigation: Bedford to Earith");
  addLine(`/assets/data/FensEarithtoEly.geojson`,"Fens: Earith to Ely");
  addArrayOfPoints(`/assets/data/poi.json`,true);
  addPlaces(`/assets/data/places.json`,true);
  addWarningSpots('/assets/data/warning.geojson');
  addChats('/assets/data/recordings.json',true);
  //zoom to 
  map.flyTo([lat,lng],level)
}
function loadAngling(){
  let a = loadMap();
  addLine(`/assets/data/GreatOuse.geojson`,"Great Ouse");
  addAnglingSpots(`/assets/data/angling.json`);
}
async function addPics(url,show=true){
  const response = await fetch(url);
  if(response.status == 200){
      //var pois = new L.LayerGroup();
      var pois = L.markerClusterGroup({maxClusterRadius:20});
      var poiCount = 0;
      const responseJson = await response.json();
      let sparseList = [];
      Object.entries(responseJson).forEach((element) => {
        const [id, place] = element;
        if(place.lat){
        let poiColor = "rgb(250, 100, 100)";
        let my_icon = L.icon({iconUrl: "/assets/images/place.png",iconSize: [24, 24], iconAnchor: [12,24]});
        //if(place.GPSLongitudeRef == "W"){place.lng = - place.lng}
        let marker = L.marker([place.lat,place.lng],{icon:my_icon});
        let name = decodeURIComponent(id.substring(id.lastIndexOf("/")+1,id.length-4));
        sparseList.push({"id":poiCount,"name":name,"url":id,"lat":place.lat,"lng":place.lng})
        marker.bindTooltip(decodeURI(`${place.id} ${place.name}`));
        marker.properties = place;
        marker.addEventListener('click', _picOnClick);
        marker.addTo(pois);
        poiCount ++ ;
        }
      });
      console.log(sparseList);
      layerControl.addOverlay(pois, `places: (${poiCount})`);
      if(show){
        pois.addTo(map);
      }
  }  
}
async function showPic(placeId,show=true){
  const response = await fetch(`/assets/data/picture_data_lean.json`);
  if(response.status == 200){
      const responseJson = await response.json();
      Object.entries(responseJson).forEach((element) => {
        const [id, place] = element;
        if(placeId==place.id){
          popup_text = `
          <div class="card mb-3">
          <img src="${place.url}" class="img-fluid rounded-start" style="max-height:250px" alt="${place.name}" title = "${place.name}">
          <ul class="list-group list-group-flush">
          <li class="list-group-item">${decodeURIComponent(place.name)}</li>
          </ul>
          </div>`
          popup = L.popup().setLatLng([place.lat,place.lng]).setContent(popup_text).openOn(map); 
          document.getElementById("map").focus();
        }
      });

  }  
}
async function showChat(chatId,show=true){
  const response = await fetch(`/assets/data/recordings.json`);
  if(response.status == 200){
      const responseJson = await response.json();
      Object.entries(responseJson).forEach((element) => {
        const [id, chat] = element;
        if(chatId==id){
          popup_text = `
            <div class="card mb-4">
              <img src="${chat[0].image}" class="card-img-top" alt="${chat[0].heading}">
              <div class="card-body">
                <h5 class="card-title">${chat[0].heading}</h5>
                <p class="card-text">${chat[0].about}</p>
              </div>
              <audio controls>
                <source src="${chat[0].filepath}" type="audio/mpeg">
                Your browser does not support the audio element.
               </audio>
            </div>`
          popup = L.popup().setLatLng([chat[0].latitude,chat[0].longitude]).setContent(popup_text).openOn(map); 
          document.getElementById("map").focus();
        }
      });

  }  
}
function _picOnClick(e){
  popup_text = `
    <div class="card mb-3">
     <img src="${e.sourceTarget.properties.url}" class="img-fluid rounded-start" style="max-height:250px" alt="${e.sourceTarget.properties.title}" title = "${e.sourceTarget.properties.title}">
     <ul class="list-group list-group-flush">
      <li class="list-group-item">${decodeURIComponent(`${e.sourceTarget.properties.id}: ${e.sourceTarget.properties.name}`)}</li>
     </ul>
    </div>`
  popup = L.popup().setLatLng([e.latlng.lat,e.latlng.lng]).setContent(popup_text).openOn(map); 
}
function loadPics(){
  let a = loadMap();
  addLine(`/assets/data/GreatOuse.geojson`,"Great Ouse");
  addPics(`/assets/data/picture_data_lean.json`);
}
async function findMissingPics(){
 const response = await fetch(`/assets/data/picture_data_lean.json`);
  if(response.status == 200){
      const responseJson = await response.json();
      Object.entries(responseJson).forEach((element) => {
        const [id, place] = element;
        getPic(place.url) 
      })
    } 
}
async function getPic(pic){
  let response = await fetch(pic);
  if(response.status !=200){
  console.log(`${response.status}: ${pic}`)
  }
}
async function getLatestCSOInfo() {
    let url = "https://services3.arcgis.com/VCOY1atHWVcDlvlJ/arcgis/rest/services/stream_service_outfall_locations_view/FeatureServer/0/query?outFields=*&where=Status%3D1&f=geojson"
    const response = await fetch(url);
    if(response.status == 200){
        var CSOs = new L.LayerGroup();
        var dischargingCSOs = new L.LayerGroup();
        var offlineCSOs = new L.LayerGroup();
        var inMaintenanceCSOs = new L.LayerGroup();
        var CSOsCount = 0, dischargingCSOsCount = 0, offlineCSOsCount = 0, inMaintenanceCSOsCount = 0;
        const responseJson = await response.json();
        let result = responseJson["features"];
        CSOsCount = result.length;
        result.forEach(element => {
            let csoColor = "rgb(50, 100, 0)";
            if(element.properties.status == 1){csoColor =  "rgb(100, 50, 0)";}
            let marker = L.circleMarker([element.properties.Latitude, element.properties.Longitude],{radius:4,color:csoColor});
            marker.bindTooltip(decodeURI(element.properties.Id));
            marker.properties = element;
            marker.addEventListener('click', _CsoMarkerOnClick);
            marker.addTo(CSOs);
        });
        layerControl.addOverlay(CSOs, `Discharging CSOs (${CSOsCount})`);
    }
}