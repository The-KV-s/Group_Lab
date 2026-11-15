var map = L.map('map').setView([29.8884, -97.9384], 14);

var mapLink = '<a href="https://www.openstreetmap.org">OpenStreetMap</a>';
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

map.locate({
  setView: true,
  maxZoom: 16,
  enableHighAccuracy: true,
  timeout: 10000
});

map.on('locationfound', (e) => {
  L.marker(e.latlng).addTo(map)
    .bindPopup('You are here (within ' + Math.round(e.accuracy) + ' m)')
    .openPopup();
  L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
});

map.on('locationerror', (e) => {
  console.warn('Could not get location:', e.message);
});

//Basemap switcher from streets to satellite option
var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18
});

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 18
});

L.control.layers({ 'Streets': streets, 'Satellite': satellite }).addTo(map);

//Scale bar
L.control.scale().addTo(map);

//Legend (Hopefully)
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
// Venue locations converted from Bobcat_Athletics_Facilities.kml
// Same data as venues.geojson, stored as a JS variable so the map also works
// when index.html is opened directly from your computer.
const venuesData = {
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
