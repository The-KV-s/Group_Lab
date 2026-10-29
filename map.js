var map = L.map('map').setView([29.8884, -97.9384], 14);

var mapLink = '<a href="https://www.openstreetmap.org">OpenStreetMap</a>';
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
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
