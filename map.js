
// =========================================================
// Texas State Sports Map  ·  GEO 4422 group project
// =========================================================

// ---------- Sports and their colors ----------
// Each sport's venue, parking, and route share one color.
// (The legend needs this list. It was missing before, which stopped the script.)
var sports = [
  { sport: 'Football',                color: '#b5382a' },
  { sport: 'Basketball / Volleyball', color: '#1f6fb2' },
  { sport: 'Baseball',                color: '#7a4fb5' },
  { sport: 'Softball',                color: '#d4880f' },
  { sport: 'Soccer',                  color: '#0e8a7d' },
  { sport: 'Tennis',                  color: '#5f8a1f' },
  { sport: 'Track & Field',           color: '#c2457a' },
  { sport: 'Golf',                    color: '#6d4c41' }
];

function colorFor(sportName) {
  var match = sports.find(function (s) { return s.sport === sportName; });
  return match ? match.color : '#555555';
}

// ---------- Map ----------
var map = L.map('map').setView([29.8884, -97.9384], 14);

// Basemaps
// Esri World Street Map: free, no API key, works from local files and GitHub Pages
var streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 19
}).addTo(map);

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 19
});

// Venue locations converted from Bobcat_Athletics_Facilities.kml
// Same data as venues.geojson, stored as a JS variable so the map also works
// when index.html is opened directly from your computer.
var venuesData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "UFCU Stadium",
        "sport": "Football",
        "address": "1100 Aquarena Springs Drive, San Marcos, TX",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.9255206, 29.8910287] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Strahan Arena at the University Events Center",
        "sport": "Basketball / Volleyball",
        "address": "106 Charles Austin Drive, San Marcos, TX",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.932646, 29.888649] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Bobcat Ballpark",
        "sport": "Baseball",
        "address": "225 Charles Austin Drive, San Marcos, TX",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.9282343, 29.8879182] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Bobcat Softball Stadium",
        "sport": "Softball",
        "address": "225 Charles Austin Drive, San Marcos, TX 78666",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.929334, 29.888301] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Bobcat Soccer Complex",
        "sport": "Soccer",
        "address": "1001 Academy Street, San Marcos, TX",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.95175, 29.889194] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Tennis Complex",
        "sport": "Tennis",
        "address": "700 Peques Street, San Marcos, TX",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.9357284, 29.8912807] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Texas State Track and Field",
        "sport": "Track & Field",
        "address": "1100 Aquarena Springs Drive, San Marcos, TX 78666",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.922006, 29.891203] }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Kissing Tree Golf Club",
        "sport": "Golf",
        "address": "201 Kissing Tree Ln, San Marcos, TX 78666",
        "url": "https://txstatebobcats.com/"
      },
      "geometry": { "type": "Point", "coordinates": [-97.9954337, 29.838241] }
    }
  ]
};

// ---------- Venues (color-coded pins) ----------
var venuesLayer = L.geoJSON(venuesData, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 10,
      fillColor: colorFor(feature.properties.sport),
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.95
    });
  },
  onEachFeature: function (feature, layer) {
    var p = feature.properties;
    layer.bindPopup(
      '<b>' + p.name + '</b><br>Sport: ' + p.sport + '<br>' + p.address + '<br>' +
      '<a href="' + p.url + '" target="_blank" rel="noopener">Official sports / ticket page ↗</a>'
    );
    layer.bindTooltip(p.name);
  }
}).addTo(map);

// Zoom the map to fit all the pins
map.fitBounds(venuesLayer.getBounds(), { padding: [30, 30] });

// ---------- Layer switcher ----------
L.control.layers(
  { 'Streets': streets, 'Satellite': satellite },
  { 'Venues': venuesLayer }
).addTo(map);

// ---------- Scale bar ----------
L.control.scale().addTo(map);

// ---------- Legend ----------
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  sports.forEach(function (s) {
    div.innerHTML += '<i style="background:' + s.color + '"></i>' + s.sport + '<br>';
  });
  div.innerHTML += '<i style="background:#fff;border:3px solid #555;border-radius:50%"></i>Parking<br>';
  div.innerHTML += '<i style="background:#555;border-radius:50%"></i>Venue<br>';
  div.innerHTML += '<i style="background:#555;height:4px"></i>Walking route';
  return div;
};
legend.addTo(map);

// ---------- "You are here" (optional) ----------
// setView is false so the map stays on the venues instead of jumping to your location.
// Note: browsers only allow location on https:// pages (like GitHub Pages), not local files.
map.locate({ setView: false, enableHighAccuracy: true, timeout: 10000 });

map.on('locationfound', function (e) {
  L.marker(e.latlng).addTo(map)
    .bindPopup('You are here (within ' + Math.round(e.accuracy) + ' m)');
  L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
});

map.on('locationerror', function (e) {
  console.warn('Could not get location:', e.message);
});
 
