//create a function to define the radius of the circle
function radiusSize(magnitude) {
    return parseFloat(magnitude) * 10;
}

// create a function to select the color for each circle
// let colors = ['#33cc33','#99ff66', '#ffff99', '#ff9966', '#ff3300', '#ff9900', '#cc3300' ]
function colorSelect(mag){
    var color;
    if(mag <= 1){
            color = '#33cc33';
        }else if (mag <= 2){
            color = '#99ff66';
        }else if (mag <= 3){
            color = '#ffff99';
        }else if (mag <= 4){
            color = '#ff9966';
        }else if (mag <= 5){
            color = '#ff3300';
        }else if (mag <= 6){
            color = '#cc3300';
        }else {
            color = '#800000';
        }
    return color
}

// createt empty laygroups in order to append the json data from the api calls
let earthquakes = new L.LayerGroup();
let plates = new L.LayerGroup();

// Define the urls for the GeoJson API call
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let platesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json';

// Use the d3 function to call the API url and create the data and add it to the layer groups
// start with the usgs earthquake data
d3.json(earthquakeUrl, function(d){
    let earthquakeData = d.features;

    L.geoJson(earthquakeData, {
        onEachFeature: function(feature, layer){
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><h4> Magnitude:" + feature.properties.mag + "</h4><p>" 
            + new Date(feature.properties.time) + "</p>")
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: 'black',
                stroke: 1,
                fillColor: colorSelect(feature.properties.mag),
                fillOpacity: 0.5, 
                radius: radiusSize(feature.properties.mag)
            })
        }
    }).addTo(earthquakes);
});

// get the geojson with the techtonic plate data and append it to the layergroup
d3.json(platesURL, function(d){
    let plateData = d.features;

    L.geoJSON(plateData, {
        style:{
            weight:2,
            color: '#990033'
        }
      }).addTo(plates);
      
})

// define the tilelayers for the map
var monochrome = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token={accessToken}", {
    accessToken: API_KEY
});

var satellite = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token={accessToken}", {
    accessToken: API_KEY
});

var terrain = L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token={accessToken}", {
    accessToken: API_KEY
});

// create the map with the terrain and earthquakes as the default layers
var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [terrain, earthquakes]
});   

// define a baseMaps object to hold our base layers for the control
var baseMaps = {
    "Monochrome": monochrome,
    "Terrain Map": terrain,
    "Satellite Map": satellite,
};

// define the overlayMaps object for the control
var overlayMaps = {
    'Earthquakes': earthquakes,
    'Fault Lines': plates,
};

// create the layer control with collapse turned off
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
}).addTo(map);

// create a legend for the magnitude of the earthquakes and append it to the map
var legend = L.control({ position: "bottomright"});
legend.onAdd = function() {
var div = L.DomUtil.create("div", "legend");
var labels=["0-1","1-2", "2-3", "3-4","4-5", "5-6", "6+"];

var grades = [0,1,2,3,4,5,7];
div.innerHTML='<div><b>Magnitude</b></div';
for(var i=0; i <grades.length; i++){
    div.innerHTML = div.innerHTML + '<i style="background:' + colorSelect(grades[i]) + '"></i> ' + labels[i] +'<br>';
  }
return div;
};
legend.addTo(map);