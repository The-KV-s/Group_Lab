
var parkingLayer = L.layerGroup().addTo(map);
var walkingLayer = L.layerGroup().addTo(map);

// Approximate parking locations.
// Coordinates are [latitude, longitude].
// Confirm exact lot entrances before final submission.

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
    name: "R13 - Strahan Reserve",
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

// Associate parking areas with sports facilities.
// These are draft connections, not verified sidewalks.

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

// Create parking markers
parkingLots.forEach(function(lot) {

  var marker = L.circleMarker(lot.coordinates, {
    radius: 8,
    color: "#ffffff",
    weight: 2,
    fillColor: "#333333",
    fillOpacity: 1
  });

  marker.addTo(parkingLayer);

  marker.bindPopup(
    "<b>" + lot.name + "</b><br>" +
    "Approximate parking location"
  );

  marker.bindTooltip(lot.name);

});

// Find each facility and draw its connection
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

  // A straight connection between approximate parking
  // and the existing facility point.
  // This is NOT a verified pedestrian path.

  var coordinates = [
    lot.coordinates,
    venueCoordinates
  ];

  var line = L.polyline(coordinates, {
    color: colorFor(route.sport),
    weight: 4,
    opacity: 0.85,
    dashArray: "8, 7"
  });

  line.addTo(walkingLayer);

  // Turf.js measures straight-line distance here,
  // not the actual walking distance.

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

  // Google Maps can provide actual walking directions.
  var directions =
    "https://www.google.com/maps/dir/?api=1" +
    "&origin=" + encodeURIComponent(lot.name + ", San Marcos, TX") +
    "&destination=" +
    encodeURIComponent(
      venue.properties.name + ", " +
      venue.properties.address
    ) +
    "&travelmode=walking";

  line.bindPopup(
    "<b>" + route.sport + "</b><br>" +
    "Parking: " + lot.name + "<br>" +
    "Facility: " + venue.properties.name + "<br>" +
    "Straight-line distance: " +
    distanceMeters + " meters<br>" +
    "<small>Approximate connection, not a verified walking path.</small><br>" +
    '<a href="' + directions +
    '" target="_blank" rel="noopener">' +
    "Get Walking Directions</a>"
  );

});

// Add the new layers to the existing layer control
map.eachLayer(function(layer) {
  // Existing layers remain unchanged.
});

// Add a simple control for showing and hiding routes
var routeControl = L.control({ position: "topleft" });

routeControl.onAdd = function() {

  var div = L.DomUtil.create("div", "route-control");

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
    "Use popup links for walking directions.</small>";

  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);

  return div;
};

routeControl.addTo(map);

// Parking visibility
document.getElementById("showParking").onchange = function() {

  if (this.checked) {
    map.addLayer(parkingLayer);
  } else {
    map.removeLayer(parkingLayer);
  }

};

// Route visibility
document.getElementById("showWalking").onchange = function() {

  if (this.checked) {
    map.addLayer(walkingLayer);
  } else {
    map.removeLayer(walkingLayer);
  }

};
