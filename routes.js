
/*
 GEO 4422 - Texas State Sports Map
 Parking and Walking Routes
*/

// Parking and walking routes will be
// displayed on the existing group map.

var parkingLayer = L.layerGroup().addTo(map);
var walkingLayer = L.layerGroup().addTo(map);

// Parking locations will be added using
// verified coordinates from campus maps.

var parkingLots = [];

// Walking paths use coordinates in
// [latitude, longitude] order for Leaflet.

var walkingRoutes = [];

// Display parking markers
function showParking() {

  parkingLayer.clearLayers();

  parkingLots.forEach(function(lot) {

    var marker = L.marker(lot.coordinates)
      .addTo(parkingLayer);

    marker.bindPopup(
      "<b>" + lot.name + "</b><br>" +
      "Sport: " + lot.sport
    );

  });

}

// Display walking paths and distances
function showRoutes() {

  walkingLayer.clearLayers();

  walkingRoutes.forEach(function(route) {

    var line = L.polyline(route.coordinates, {
      color: colorFor(route.sport),
      weight: 5
    }).addTo(walkingLayer);

    // Measure each segment of the path
    // using Turf.js.

    var distance = 0;

    for (var i = 0; i < route.coordinates.length - 1; i++) {

      var start = turf.point([
        route.coordinates[i][1],
        route.coordinates[i][0]
      ]);

      var end = turf.point([
        route.coordinates[i + 1][1],
        route.coordinates[i + 1][0]
      ]);

      distance += turf.distance(
        start,
        end,
        { units: "meters" }
      );

    }

    line.bindPopup(
      "<b>" + route.name + "</b><br>" +
      "Sport: " + route.sport + "<br>" +
      "Walking distance: " +
      Math.round(distance) + " meters"
    );

  });

}

// Show the parking and routes
showParking();
showRoutes();

