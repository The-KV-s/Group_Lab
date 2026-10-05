// Create the map (centered on San Marcos, TX)
const map = L.map('map').setView([29.8833, -97.9414], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
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
