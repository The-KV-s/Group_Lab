
var parkingLayer = L.layerGroup().addTo(map);
var walkingLayer = L.layerGroup().addTo(map);

var parkingLots = [
  { name: "Stadium West Parking", coordinates: [29.8898, -97.9270] },
  { name: "Stadium East Parking", coordinates: [29.8914, -97.9228] },
  { name: "Aquarena Parking", coordinates: [29.8892, -97.9306] },
  { name: "UEC Parking", coordinates: [29.8882, -97.9337] },
  { name: "Strahan Parking", coordinates: [29.8882, -97.9320] },
  { name: "Soccer Complex Parking", coordinates: [29.8894, -97.9525] },
  { name: "Tennis Complex Parking", coordinates: [29.8910, -97.9365] },
  { name: "Kissing Tree Parking", coordinates: [29.8380, -97.9960] }
];

var routeData = [
  {
    sport: "Football",
    parking: 0,
    minutes: "6",
    path: [
      [29.8898, -97.9270],
      [29.8902, -97.9267],
      [29.8906, -97.9264],
      [29.8909, -97.9259]
    ]
  },
  {
    sport: "Football",
    parking: 1,
    minutes: "2",
    path: [
      [29.8914, -97.9228],
      [29.8912, -97.9235],
      [29.8911, -97.9243]
    ]
  },
  {
    sport: "Basketball / Volleyball",
    parking: 3,
    minutes: "2",
    path: [
      [29.8882, -97.9337],
      [29.8884, -97.9333],
      [29.8886, -97.9330]
    ]
  },
  {
    sport: "Basketball / Volleyball",
    parking: 4,
    minutes: "5",
    path: [
      [29.8882, -97.9320],
      [29.8884, -97.9318],
      [29.8887, -97.9320],
      [29.8888, -97.9324]
    ]
  },
  {
    sport: "Baseball",
    parking: 2,
    minutes: "4",
    path: [
      [29.8892, -97.9306],
      [29.8889, -97.9302],
      [29.8885, -97.9296],
      [29.8881, -97.9289]
    ]
  },
  {
    sport: "Baseball",
    parking: 0,
    minutes: "14",
    path: [
      [29.8898, -97.9270],
      [29.8891, -97.9268],
      [29.8886, -97.9272],
      [29.8881, -97.9277]
    ]
  },
  {
    sport: "Softball",
    parking: 2,
    minutes: "3",
    path: [
      [29.8892, -97.9306],
      [29.8889, -97.9301],
      [29.8886, -97.9298]
    ]
  },
  {
    sport: "Softball",
    parking: 0,
    minutes: "13",
    path: [
      [29.8898, -97.9270],
      [29.8891, -97.9270],
      [29.8886, -97.9277],
      [29.8884, -97.9285]
    ]
  },
  {
    sport: "Soccer",
    parking: 5,
    minutes: "3",
    path: [
      [29.8894, -97.9525],
      [29.8891, -97.9526],
      [29.8889, -97.9522],
      [29.8889, -97.9519]
    ]
  },
  {
    sport: "Tennis",
    parking: 6,
    minutes: "5",
    path: [
      [29.8910, -97.9365],
      [29.8911, -97.9362],
      [29.8912, -97.9359]
    ]
  },
  {
    sport: "Track & Field",
    parking: 1,
    minutes: "6",
    path: [
      [29.8914, -97.9228],
      [29.8912, -97.9225],
      [29.8910, -97.9223]
    ]
  },
  {
    sport: "Golf",
    parking: 7,
    minutes: "1",
    path: [
      [29.8380, -97.9960],
      [29.8381, -97.9958],
      [29.8382, -97.9956]
    ]
  }
];

parkingLots.forEach(function(lot) {
  L.circleMarker(lot.coordinates, {
    radius: 8,
    color: "#555555",
    weight: 3,
    fillColor: "#ffffff",
    fillOpacity: 1
  })
  .addTo(parkingLayer)
  .bindPopup(
    "<b>" + lot.name + "</b><br>" +
    "Approximate parking location"
  )
  .bindTooltip(lot.name);
});

routeData.forEach(function(route) {
  var venue = venuesData.features.find(function(feature) {
    return feature.properties.sport === route.sport;
  });

  if (!venue) {
    return;
  }

  var lot = parkingLots[route.parking];

  var destination = [
    venue.geometry.coordinates[1],
    venue.geometry.coordinates[0]
  ];

  var path = route.path.slice();
  path.push(destination);

  var line = L.polyline(path, {
    color: colorFor(route.sport),
    weight: 6,
    opacity: 0.9,
    dashArray: "10, 7"
  }).addTo(walkingLayer);

  var turfCoordinates = path.map(function(point) {
    return [point[1], point[0]];
  });

  var turfLine = turf.lineString(turfCoordinates);

  var distance = turf.length(turfLine, {
    units: "kilometers"
  });

  var distanceMeters = Math.round(distance * 1000);

  var directions =
    "https://www.google.com/maps/dir/?api=1" +
    "&origin=" +
    encodeURIComponent(
      lot.coordinates[0] + "," + lot.coordinates[1]
    ) +
    "&destination=" +
    encodeURIComponent(
      destination[0] + "," + destination[1]
    ) +
    "&travelmode=walking";

  line.bindPopup(
    "<b>" + route.sport + " Walking Guide</b><br><br>" +
    "<b>Parking:</b> " + lot.name + "<br>" +
    "<b>Destination:</b> " +
    venue.properties.name + "<br>" +
    "<b>Approximate guideline length:</b> " +
    distanceMeters + " meters<br>" +
    "<b>Reference walking time:</b> " +
    route.minutes + " minutes<br><br>" +
    "<small>This line is a general walking guide. " +
    "Follow posted signs and designated crossings. " +
    "The walking time is based on reference directions, " +
    "not calculated from this line.</small><br><br>" +
    '<a href="' + directions +
    '" target="_blank" rel="noopener">' +
    "<b>Get Step-by-Step Walking Directions</b></a>"
  );

  line.on("click", function(e) {
    line.openPopup(e.latlng);
  });
});

var routeControl = L.control({
  position: "topleft"
});

routeControl.onAdd = function() {
  var div = L.DomUtil.create("div", "route-control");

  div.innerHTML =
    '<div class="route-control-title">Map Options</div>' +
    '<label class="route-option">' +
      '<span>Parking Lots</span>' +
      '<input type="checkbox" id="showParking" checked>' +
      '<span class="route-switch"></span>' +
    '</label>' +
    '<label class="route-option">' +
      '<span>Walking Routes</span>' +
      '<input type="checkbox" id="showWalking" checked>' +
      '<span class="route-switch"></span>' +
    '</label>' +
    '<div class="route-control-note">' +
      'Routes are approximate guides.<br>' +
      'Click a route for walking directions.' +
    '</div>';

  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);

  return div;
};

routeControl.addTo(map);

document.getElementById("showParking").onchange = function() {
  if (this.checked) {
    map.addLayer(parkingLayer);
  } else {
    map.removeLayer(parkingLayer);
  }
};

document.getElementById("showWalking").onchange = function() {
  if (this.checked) {
    map.addLayer(walkingLayer);
  } else {
    map.removeLayer(walkingLayer);
  }
};

var routeLegend = document.querySelector(".legend");

if (routeLegend) {
  var legendItems = routeLegend.querySelectorAll("i");
  var lastItem = legendItems[legendItems.length - 1];

  if (lastItem) {
    lastItem.style.background = "none";
    lastItem.style.border = "none";
    lastItem.style.borderTop = "3px dashed #555555";
    lastItem.style.height = "0";
    lastItem.style.marginTop = "8px";
  }
}
