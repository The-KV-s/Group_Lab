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
