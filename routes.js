
var parkingLayer = L.layerGroup().addTo(map);
var walkingLayer = L.layerGroup().addTo(map);

// Parking locations
// Coordinates are approximate and should be verified.

var parkingLots = [
  {
    name: "P10W - Stadium West",
    coordinates: [29.8898, -97.9270]
  },
  {
    name: "P10E - Stadium East",
    coordinates: [29.8914, -97.9228]
  },
  {
    name: "P9 - Aquarena Lot",
    coordinates: [29.8892, -97.9306]
  },
  {
    name: "P8 - UEC Parking",
    coordinates: [29.8882, -97.9337]
  },
  {
    name: "R13 - Strahan Parking",
    coordinates: [29.8882, -97.9320]
  },
  {
    name: "Soccer Complex Parking",
    coordinates: [29.8894, -97.9525]
  },
  {
    name: "Tennis Complex Parking",
    coordinates: [29.8910, -97.9365]
  },
  {
    name: "Kissing Tree Parking",
    coordinates: [29.8380, -97.9960]
  }
];

// Match parking lots to sports facilities

var routeData = [
  { sport: "Football", parking: 0 },
  { sport: "Football", parking: 1 },

  { sport: "Basketball / Volleyball", parking: 3 },
  { sport: "Basketball / Volleyball", parking: 4 },

  { sport: "Baseball", parking: 2 },
  { sport: "Baseball", parking: 0 },

  { sport: "Softball", parking: 2 },
  { sport: "Softball", parking: 0 },

  { sport: "Soccer", parking: 5 },

  { sport: "Tennis", parking: 6 },

  { sport: "Track & Field", parking: 1 },

  { sport: "Golf", parking: 7 }
];

// Display parking markers using the
// existing parking symbol from the legend

parkingLots.forEach(function(lot) {

  var marker = L.circleMarker(lot.coordinates, {
    radius: 8,
    color: "#555555",
    weight: 3,
    fillColor: "#ffffff",
    fillOpacity: 1
  }).addTo(parkingLayer);

  marker.bindPopup(
    "<b>" + lot.name + "</b><br>" +
    "Approximate parking location"
  );

  marker.bindTooltip(lot.name);

});

// Draw routes and calculate distances

routeData.forEach(function(route) {

  var venue = venuesData.features.find(function(feature) {
    return feature.properties.sport === route.sport;
  });

  if (!venue) {
    return;
  }

  var lot = parkingLots[route.parking];

  var venueCoordinates = [
    venue.geometry.coordinates[1],
    venue.geometry.coordinates[0]
  ];

  var coordinates = [
    lot.coordinates,
    venueCoordinates
  ];

  // Draw the route connection

  var line = L.polyline(coordinates, {
    color: colorFor(route.sport),
    weight: 6,
    opacity: 0.9,
    dashArray: "8, 7"
  }).addTo(walkingLayer);

  // Calculate direct distance using Turf.js

  var start = turf.point([
    lot.coordinates[1],
    lot.coordinates[0]
  ]);

  var end = turf.point([
    venueCoordinates[1],
    venueCoordinates[0]
  ]);

  var distance = turf.distance(start, end, {
    units: "kilometers"
  });

  var distanceMeters = Math.round(distance * 1000);

  // Create walking directions using
  // parking and facility coordinates

  var directions =
    "https://www.google.com/maps/dir/?api=1" +
    "&origin=" +
    encodeURIComponent(
      lot.coordinates[0] + "," + lot.coordinates[1]
    ) +
    "&destination=" +
    encodeURIComponent(
      venueCoordinates[0] + "," + venueCoordinates[1]
    ) +
    "&travelmode=walking";

  // Route popup

  line.bindPopup(
    "<b>" + route.sport + " Directions</b><br><br>" +
    "<b>Parking:</b> " + lot.name + "<br>" +
    "<b>Destination:</b> " +
    venue.properties.name + "<br>" +
    "<b>Direct distance:</b> " +
    distanceMeters + " meters<br><br>" +
    "<small>Displayed connection is approximate.</small><br><br>" +
    '<a href="' + directions +
    '" target="_blank" rel="noopener">' +
    "<b>Get Walking Directions</b></a>"
  );

  // Open the popup when a route is clicked

  line.on("click", function(e) {
    line.openPopup(e.latlng);
  });

});

// Create controls for showing and hiding layers

var routeControl = L.control({
  position: "topleft"
});

routeControl.onAdd = function() {

  var div = L.DomUtil.create(
    "div",
    "route-control"
  );

  div.style.background = "white";
  div.style.padding = "10px";
  div.style.border = "2px solid #777";
  div.style.borderRadius = "5px";

  div.innerHTML =
    "<b>Parking and Routes</b><br><br>" +
    '<label><input type="checkbox" id="showParking" checked>' +
    " Parking Lots</label><br>" +
    '<label><input type="checkbox" id="showWalking" checked>' +
    " Route Connections</label><br><br>" +
    "<small>Dashed lines are approximate.<br>" +
    "Click a route for walking directions.</small>";

  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);

  return div;
};

routeControl.addTo(map);

// Show or hide parking markers

document.getElementById("showParking").onchange = function() {

  if (this.checked) {
    map.addLayer(parkingLayer);
  } else {
    map.removeLayer(parkingLayer);
  }

};

// Show or hide route connections

document.getElementById("showWalking").onchange = function() {

  if (this.checked) {
    map.addLayer(walkingLayer);
  } else {
    map.removeLayer(walkingLayer);
  }

};
