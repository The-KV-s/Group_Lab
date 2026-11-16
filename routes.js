(function () {
  "use strict";
(function () {
  "use strict";

  if (
    typeof map === "undefined" ||
    typeof L === "undefined" ||
    typeof turf === "undefined" ||
    typeof venuesData === "undefined"
  ) {
    console.error("Missing map, Leaflet, Turf, or venue data.");
    return;
  }

  // Public sidewalk GIS layer
  var sidewalkURL =
    "https://smgis.sanmarcostx.gov/arcgis/rest/services/" +
    "AllDataProd/Trans_prod/MapServer/23/query";

  var sidewalkLayer = L.geoJSON(null, {
    style: {
      color: "#246b75",
      weight: 3,
      opacity: 0.7
    }
  }).addTo(map);

  var routeLayer = L.layerGroup().addTo(map);

  var drawing = false;
  var routePoints = [];
  var selectedVenue = "";

  // Parking references for the eight sports
  // Coordinates must be verified before placing markers.

  var parkingLots = [
    { id: "P9", sports: ["Baseball", "Softball"] },
    { id: "P10W", sports: ["Baseball", "Softball"] },
    { id: "P8", sports: ["Basketball / Volleyball"] },
    { id: "R13", sports: ["Basketball / Volleyball"] },
    { id: "P10E", sports: ["Football", "Track & Field"] },
    { id: "P12", sports: ["Football"] },
    { id: "Soccer Parking", sports: ["Soccer"] },
    { id: "Peques Parking", sports: ["Tennis"] },
    { id: "Golf Parking", sports: ["Golf"] }
  ];

  // Show messages in the control panel
  function status(message) {
    document.getElementById("routeStatus").textContent = message;
  }

  // Load public sidewalk data
  function loadSidewalks() {
    status("Loading public sidewalks...");

    var bounds = map.getBounds();
    var bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ].join(",");

    var params = new URLSearchParams({
      geometry: bbox,
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "*",
      outSR: "4326",
      returnGeometry: "true",
      f: "geojson"
    });

    fetch(sidewalkURL + "?" + params.toString())
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data.features)) {
          throw new Error("Invalid sidewalk data");
        }

        sidewalkLayer.clearLayers();
        sidewalkLayer.addData(data);

        status(
          "Loaded " + data.features.length +
          " sidewalk features. Routes are not yet verified."
        );
      })
      .catch(function (error) {
        status("Unable to load sidewalks: " + error.message);
      });
  }

  // Calculate distance of a drawn route
  function calculateDistance() {
    if (routePoints.length < 2) return 0;

    var coordinates = routePoints.map(function (p) {
      return [p.lng, p.lat];
    });

    return turf.length(
      turf.lineString(coordinates),
      { units: "kilometers" }
    );
  }

  // Draw the route on the map
  function updateRoute() {
    routeLayer.clearLayers();

    if (routePoints.length === 0) return;

    routePoints.forEach(function (point) {
      L.circleMarker(point, {
        radius: 4,
        color: "#a32929",
        fillOpacity: 1
      }).addTo(routeLayer);
    });

    if (routePoints.length < 2) return;

    var line = L.polyline(routePoints, {
      color: "#a32929",
      weight: 6
    }).addTo(routeLayer);

    var km = calculateDistance();
    var meters = Math.round(km * 1000);
    var miles = (km * 0.621371).toFixed(2);

    line.bindPopup(
      "<b>Draft Walking Route</b><br>" +
      "Venue: " + selectedVenue + "<br>" +
      "Distance: " + meters + " meters<br>" +
      "Distance: " + miles + " miles<br>" +
      "Route not yet verified."
    );

    status("Draft route distance: " + meters + " meters");
  }

  // Click the map to add route points
  map.on("click", function (event) {
    if (!drawing) return;

    routePoints.push(event.latlng);
    updateRoute();
  });

  // Export the route as GeoJSON
  function exportRoute() {
    if (routePoints.length < 2) {
      alert("Draw a route with at least two points first.");
      return;
    }

    var coordinates = routePoints.map(function (p) {
      return [p.lng, p.lat];
    });

    var geojson = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {
          venue: selectedVenue,
          status: "Draft - not verified",
          distance_m: Math.round(calculateDistance() * 1000)
        },
        geometry: {
          type: "LineString",
          coordinates: coordinates
        }
      }]
    };

    var blob = new Blob(
      [JSON.stringify(geojson, null, 2)],
      { type: "application/geo+json" }
    );

    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    link.href = url;
    link.download = "txst-walking-route.geojson";
    link.click();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // Create the route control panel
  var control = L.control({ position: "topright" });

  control.onAdd = function () {
    var div = L.DomUtil.create("div", "route-panel");

    div.style.cssText =
      "background:white;color:#222;padding:12px;" +
      "border-radius:6px;max-width:250px;" +
      "box-shadow:0 1px 6px #777;text-align:left;" +
      "font:13px Arial,sans-serif;";

    div.innerHTML =
      "<b>TXST Walking Routes</b><br><br>" +
      '<select id="routeVenue" style="width:100%">' +
      '<option value="">Select a facility</option>' +
      "</select><br><br>" +
      '<button id="loadSidewalks">Load Sidewalks</button> ' +
      '<button id="drawRoute">Start Drawing</button><br><br>' +
      '<button id="clearRoute">Clear Route</button> ' +
      '<button id="exportRoute">Export GeoJSON</button>' +
      '<p id="routeStatus">No routes mapped yet.</p>';

    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    return div;
  };

  control.addTo(map);

  // Populate the dropdown from the group's venue data
  var venueSelect = document.getElementById("routeVenue");

  venuesData.features.forEach(function (feature) {
    var option = document.createElement("option");
    option.value = feature.properties.name;
    option.textContent = feature.properties.name;
    venueSelect.appendChild(option);
  });

  venueSelect.addEventListener("change", function () {
    selectedVenue = this.value;

    var venue = venuesData.features.find(function (feature) {
      return feature.properties.name === selectedVenue;
    });

    if (venue) {
      map.setView([
        venue.geometry.coordinates[1],
        venue.geometry.coordinates[0]
      ], 17);
    }
  });

  document.getElementById("loadSidewalks")
    .addEventListener("click", loadSidewalks);

  document.getElementById("drawRoute")
    .addEventListener("click", function () {
      drawing = !drawing;
      this.textContent = drawing ? "Stop Drawing" : "Start Drawing";
      status(drawing ?
        "Click along the sidewalk to draw your route." :
        "Drawing paused.");
    });

  document.getElementById("clearRoute")
    .addEventListener("click", function () {
      routePoints = [];
      updateRoute();
      status("Route cleared.");
    });

  document.getElementById("exportRoute")
    .addEventListener("click", exportRoute);

})();

