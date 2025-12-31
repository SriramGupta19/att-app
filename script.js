<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Create Event</title>
    <link rel="stylesheet" href="style.css">
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
</head>
<body>

<div class="container">
    <h1>Create Attendance Event</h1>
    
    <input type="text" id="eventName" placeholder="Event Name (e.g., Math 101)">
    <div id="map"></div> <label>Allowed Radius: <span id="radiusVal">50</span> meters</label>
    <input type="range" id="radiusSlider" min="10" max="500" value="50">

    <button id="createBtn">Create Event & Generate QR</button>

    <div id="qr-section" style="display:none; text-align:center;">
        <h3>Scan to Attend:</h3>
        <canvas id="qr-code"></canvas>
        <p><strong>Link:</strong> <a id="eventLink" href="#" target="_blank">Open Link</a></p>
    </div>
</div>

<script type="module">
    import { db, collection, addDoc, Timestamp } from './script.js';

    let map, marker, circle;
    // Default location (e.g., New York)
    let currentLat = 40.7128;
    let currentLng = -74.0060; 

    // Initialize Leaflet Map
    function initMap() {
        // 1. Create Map
        map = L.map('map').setView([currentLat, currentLng], 18);

        // 2. Add OpenStreetMap Tiles (The visual map)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // 3. Add Draggable Marker
        marker = L.marker([currentLat, currentLng], {draggable: true}).addTo(map);

        // 4. Add Radius Circle
        circle = L.circle([currentLat, currentLng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3,
            radius: 50
        }).addTo(map);

        // 5. Update Circle when Marker moves
        marker.on('drag', function(e) {
            var newPos = e.target.getLatLng();
            circle.setLatLng(newPos);
        });

        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                map.setView([lat, lng], 18);
                marker.setLatLng([lat, lng]);
                circle.setLatLng([lat, lng]);
            });
        }
    }

    // Run Map Init
    initMap();

    // Slider Logic
    const slider = document.getElementById("radiusSlider");
    slider.addEventListener("input", () => {
        const rad = parseInt(slider.value);
        document.getElementById("radiusVal").innerText = rad;
        circle.setRadius(rad);
    });

    // Save Event Logic
    document.getElementById("createBtn").addEventListener("click", async () => {
        const name = document.getElementById("eventName").value;
        if(!name) return alert("Please enter an event name");

        // Get coordinates from Leaflet Marker
        const lat = marker.getLatLng().lat;
        const lng = marker.getLatLng().lng;
        const radius = parseInt(slider.value);

        try {
            const docRef = await addDoc(collection(db, "events"), {
                name: name,
                latitude: lat,
                longitude: lng,
                radius: radius,
                isActive: true,
                createdAt: Timestamp.now()
            });

            // Generate Link
            const baseUrl = window.location.href.replace('admin.html', 'index.html');
            const attendanceUrl = `${baseUrl}?eventId=${docRef.id}`;

            // Render QR
            const qr = new QRious({
                element: document.getElementById('qr-code'),
                value: attendanceUrl,
                size: 200
            });

            document.getElementById("qr-section").style.display = "block";
            const linkTag = document.getElementById("eventLink");
            linkTag.href = attendanceUrl;
            linkTag.innerText = "Click to Test Attendance";
            
            alert("Event Created Successfully!");

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error creating event. Check console.");
        }
    });
</script>
</body>
</html>
