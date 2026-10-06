var map = L.map('map').setView([29.8884, -97.9384], 14);

var mapLink =
    '<a href="https://www.openstreetmap.org">OpenStreetMap</a>';

L.tileLayer
(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18
    }
)
.addTo(map);

var point = turf.point([29.888539, -97.941764]);
var polygon = turf.polygon([
  [
    [-98.00, 29.82],
    [-97.85, 29.82],
    [-97.85, 29.94],
    [-98.00, 29.94],
    [-98.00, 29.82],
  ],
]);

var area = turf.area(polygon);
console.log(area);
