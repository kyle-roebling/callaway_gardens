//Set up carto creds
var client = new carto.Client({
  apiKey: '41d897ac97b65274e38225da74568e07c13d04e3',
  username: 'roebling'
});

//Set up map variable
var mymap = L.map('mapid').setView([32.83736, -84.85368], 13);

//Add basemap to application
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia3JvZWJsaW5nIiwiYSI6ImNqeXczaGplMjB3YjgzYmxyZGU1OG90bXUifQ.ItIrq8YGHvZIilkcx-U8Ag'
}).addTo(mymap);


// Global Variables
var map_layers = new L.LayerGroup();
var lodging;
var dining;
var lakes;
var trails;
var activities;


// Database Queries
// Get all data elements
var sqlQuery_lodging = "SELECT * FROM lodging_wgs";
var sqlQuery_dining = "SELECT * FROM dining_wgs";
var sqlQuery_lakes = "SELECT * FROM lakes_wgs";
var sqlQuery_trails = "SELECT * FROM trails_wgs";
var sqlQuery_activities = "SELECT * FROM activities_wgs";

// Set CARTO Username
var cartoDBUserName = "roebling";

// Function to add all layers
function showAll(){

    $.when(ajax1(), ajax2(), ajax3(), ajax4(), ajax5()).done(function(a1, a2, a3, a4, a5){

      //Add search bar to top right corner
      var controlSearch = new L.Control.Search({
        position:'topright',
        layer: map_layers,
        propertyName: 'name',
        initial: false,
        zoom: 18,
        marker: false
      });

      mymap.addControl( controlSearch );
  });

    // Get CARTO selection as GeoJSON and Add lodging to the map
    function ajax1(){

        $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQuery_lodging, function(data) {
          lodging = L.geoJson(data,{
              onEachFeature: function (feature, layer) {
                  layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.price + '</em></p>');
                  layer.cartodb_id=feature.properties.cartodb_id;
              }
          }).addTo(mymap);
          map_layers.addLayer(lodging);
        });

    }

    function ajax2(){
        // Get CARTO selection as GeoJSON and Add dining to the map
        $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQuery_dining, function(data) {
            dining = new L.geoJson(data,{
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.price + '</em></p>');
                    layer.cartodb_id=feature.properties.cartodb_id;
                }
            }).addTo(mymap);
            map_layers.addLayer(dining);
        });
      };

    function ajax3(){
        // Get CARTO selection as GeoJSON and activities to the map
        $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQuery_activities, function(data) {
            activities = L.geoJson(data,{
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.status + '</em></p>');
                    layer.cartodb_id=feature.properties.cartodb_id;
                }
            }).addTo(mymap);
            map_layers.addLayer(activities);
        });
      }

    function ajax4(){
        // Get CARTO selection as GeoJSON and Add trails to the map
        $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQuery_trails, function(data) {
            trails = L.geoJson(data,{
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.time + '</em></p>');
                    layer.cartodb_id=feature.properties.cartodb_id;
                }
            }).addTo(mymap);
            map_layers.addLayer(trails);
        });
    }

    function ajax5(){
        // Get CARTO selection as GeoJSON and Add lakes to the map
        $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQuery_lakes, function(data) {
            lakes = L.geoJson(data,{
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.fishing + '</em></p>');
                    layer.cartodb_id=feature.properties.cartodb_id;
                }
            }).addTo(mymap);
            map_layers.addLayer(lakes);
        });
      };
  };


// Function to set user's current location
$(document).ready(function(){
  $("#location_id").click(function(){
    mymap.locate({setView: true, maxZoom: 13});

    function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng).addTo(mymap)

    L.circle(e.latlng, radius).addTo(mymap);
  }

  mymap.on('locationfound', onLocationFound);
  });
});


// Function to set map back to home location at Callaway Gardens
$(document).ready(function(){
  $("#home_id").click(function(){
    mymap.setView([32.83736, -84.85368], 13);
  });
});

// Run showAll function automatically when document loads
$( document ).ready(function() {
  showAll();
});
