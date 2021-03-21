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
var logding = null;


// Database Queries
// Get all lodging sites
var sqlQuery = "SELECT * FROM lodging_wgs";

// Set CARTO Username
var cartoDBUserName = "roebling";

// Function to add all coffee shops
function showAll(){
    if(mymap.hasLayer(logding)){
        mymap.removeLayer(logding);
    };
    // Get CARTO selection as GeoJSON and Add to Map
    $.getJSON("https://"+cartoDBUserName+".carto.com/api/v2/sql?format=GeoJSON&q="+sqlQuery, function(data) {
        coffeeShopLocations = L.geoJson(data,{
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.price + '</em></p>');
                layer.cartodb_id=feature.properties.cartodb_id;
            }
        }).addTo(mymap);
    });
};


// Run showAll function automatically when document loads
$( document ).ready(function() {
  showAll();
});
