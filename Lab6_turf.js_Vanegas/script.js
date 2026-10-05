var map = L.map('map').setView([29.8884, -97.9384], 14);

var mapLink = '<a href="https://www.openstreetmap.org">OpenStreetMap</a>';
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
}).addTo(map);


const resultLayer = L.layerGroup().addTo(map);

function bufferMarker() {
  resultLayer.clearLayers();

  const lng = -97.9414;
  const lat = 29.8833;


  const point = turf.point([lng, lat]);
  const buffered = turf.buffer(point, 1, { units: 'kilometers' });


  L.marker([lat, lng]).addTo(resultLayer);
  const bufferLayer = L.geoJSON(buffered, {
    style: { color: '#3388ff', fillOpacity: 0.2 }
  }).addTo(resultLayer);

  map.fitBounds(bufferLayer.getBounds());
  document.getElementById('info').textContent = 'Buffered marker by 1 km.';
}
