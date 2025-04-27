var map;
var layerControl;
var POIs = {};
var warnings = {};
var polys = [];


function _routeMarkerOnClick(e){
  console.log("route clicked")
}
function _poiMarkerOnClick(e){
  console.log("poi clicked")
}
async function addRoute(sourceData,name,lineColor){
  const response = await fetch(sourceData);
  const data = await response.json();

  let routeLayer = L.geoJSON(data, {
      style: function (feature) {
          return {color: lineColor, weight:4};
      }
  })
  routeLayer.bindTooltip(function (layer) {
      let uri = layer.feature.properties.uri;
      let pop = `>${layer.feature.properties.name}`;
      return pop;
  })
  routeLayer.addEventListener('click', _routeMarkerOnClick);
  routeLayer.eachLayer(lay=> {polys.push(lay)});
  layerControl.addOverlay(routeLayer, name);
  routeLayer.addTo(map);
}

async function getPOI(url){
  const response = await fetch(url);
  if(response.status == 200){
      var pois = new L.LayerGroup();
      var poiCount = 0;
      const responseJson = await response.json();
      let result = responseJson["features"];
      result.forEach(element => {
              let poiColor = "rgb(200, 0, 200)";
              let marker = L.circleMarker([element.geometry.coordinates[1],element.geometry.coordinates[0]],{radius:4,color:poiColor});
              marker.bindTooltip(decodeURI(element.properties.name));
              marker.properties = element;
              marker.addEventListener('click', _poiMarkerOnClick);
              marker.addTo(pois);
              poiCount ++ ;
              POIs[element.label] = element;
      });
      layerControl.addOverlay(pois, `points of interest: (${poiCount})`);
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
  addRoute(`/grow/assets/data/OuseValleyWay.geojson`,"OuseValleyWay","rgb(230, 100, 0)");
  getPOI(`/grow/assets/data/poi.geojson`);
}