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

var point = turf.point([-97.941764, 29.888539]);
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
L.geoJson(point).addTo(map);
var polygonLayer = L.geoJSON(polygon).addTo(map);
map.fitBounds(polygonLayer.getBounds());


// Chance's Turf.js distance function
function calculateDistance() {

    // Two locations in San Marcos
    var point1 = turf.point([-97.9384, 29.8884]);
    var point2 = turf.point([-97.9414, 29.8827]);

    // Calculate distance in miles
    var distance = turf.distance(point1, point2, {
        units: 'miles'
    });

    // Add the two points to the map
    L.marker([29.8884, -97.9384])
        .addTo(map)
        .bindPopup('Point 1');

    L.marker([29.8827, -97.9414])
        .addTo(map)
        .bindPopup('Point 2');

    // Draw a line between the points
    L.polyline([
        [29.8884, -97.9384],
        [29.8827, -97.9414]
    ])
        .addTo(map)
        .bindPopup(
            'Distance: ' + distance.toFixed(2) + ' miles'
        );
}


// Run Chance's Turf.js function
calculateDistance();

// Kat's midpoint function

.addTo(map);
const point1 = turf.point([-97.9384, 29.8884]);
const point2 = turf.point([-97.9414, 29.8827]);

const midpoint = turf.midpoint(point1, point2);
