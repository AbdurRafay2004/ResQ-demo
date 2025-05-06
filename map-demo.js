document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = document.getElementById('mode-icon');
    const modeText = document.getElementById('mode-text');
    const offlineMessage = document.getElementById('offline-message');

    let isOnline = true;
    let map;
    const distressSignals = []; // Store distress signals
    const crimeHotspots = [
        { lat: 23.807610, lng: 90.369018 },
        { lat: 23.807895, lng: 90.373577 }
    ]; // Sample crime hotspots

    // Replace with your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoidGFoc2luMjAwNCIsImEiOiJjbTlyemV4dngxdXZzMmlzYTgxZ3Q3enFyIn0.9n4fWcTg66Oe7wIRp4Vd7g'; //your mapbox acces token

    // Parse query parameters from emergency activation
    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat')) || 23.7104; // Default to Dhaka
    const lng = parseFloat(urlParams.get('lng')) || 90.4074;

    // Initialize Mapbox map
    function initMap() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        map = new mapboxgl.Map({
            container: 'map',
            style: isOnline ? 'mapbox://styles/mapbox/streets-v11' : '', // No style for offline
            center: [lng, lat],
            zoom: 13,
            interactive: true,
            dragPan: !isMobile, // Enable single-finger panning
            touchZoomRotate: true, // Enable pinch-zoom and rotation
            //touchPitch: true // Optional: Enable two-finger pitch adjustment
        });

        // Add navigation controls (zoom and rotation)
        map.addControl(new mapboxgl.NavigationControl());

        //center the map on the user’s current location using Mapbox’s geolocation control
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
        }));

        // Add distress signal from emergency activation
        if (urlParams.get('lat') && urlParams.get('lng')) {
            addDistressSignal({ lngLat: { lng, lat } });
        }

        // Add crime hotspots
        addCrimeHotspots();

        // Handle map click to place distress signals
        map.on('click touchend', (e) => {
            if (e.originalEvent.type === 'touchend' && e.originalEvent.touches.length > 1) return; // Ignore multi-finger touches
            addDistressSignal(e);
        });

        // Load offline signals
        loadDistressSignals();
    }

    // Add distress signal
    function addDistressSignal(e) {
        const { lng, lat } = e.lngLat;
        const marker = new mapboxgl.Marker({
            color: '#ff0000'
        })
            .setLngLat([lng, lat])
            .addTo(map);
        distressSignals.push({ lng, lat, marker });
        saveDistressSignal(lat, lng);
    }

    // Add crime hotspots
    function addCrimeHotspots() {
        crimeHotspots.forEach(hotspot => {
            new mapboxgl.Marker({
                color: '#ff0000',
                scale: 0.8
            })
                .setLngLat([hotspot.lng, hotspot.lat])
                .addTo(map);
        });
    }

    // Save distress signal to localStorage
    function saveDistressSignal(lat, lng) {
        const signals = JSON.parse(localStorage.getItem('distressSignals') || '[]');
        signals.push({ lat, lng, timestamp: Date.now() });
        localStorage.setItem('distressSignals', JSON.stringify(signals));
    }

    // Load distress signals from localStorage
    function loadDistressSignals() {
        const signals = JSON.parse(localStorage.getItem('distressSignals') || '[]');
        signals.forEach(signal => {
            const marker = new mapboxgl.Marker({
                color: '#ff0000'
            })
                .setLngLat([signal.lng, signal.lat])
                .addTo(map);
            distressSignals.push({ lng: signal.lng, lat: signal.lat, marker });
        });
    }

    // Set initial state to online mode
    modeIcon.textContent = '📶';
    modeText.textContent = 'Online Mode';
    modeToggle.classList.remove('bg-red-600', 'hover:bg-red-700');
    modeToggle.classList.add('bg-green-600', 'hover:bg-green-700');
    offlineMessage.classList.add('hidden');
    initMap();

    // Toggle between online and offline modes
    modeToggle.addEventListener('click', () => {
        isOnline = !isOnline;

        if (isOnline) {
            modeIcon.textContent = '📶';
            modeText.textContent = 'Online Mode';
            modeToggle.classList.remove('bg-red-600', 'hover:bg-red-700');
            modeToggle.classList.add('bg-green-600', 'hover:bg-green-700');
            offlineMessage.classList.add('hidden');
            map.setStyle('mapbox://styles/mapbox/streets-v11');
        } else {
            modeIcon.textContent = '🚫';
            modeText.textContent = 'Offline Mode';
            modeToggle.classList.remove('bg-green-600', 'hover:bg-green-700');
            modeToggle.classList.add('bg-red-600', 'hover:bg-red-700');
            offlineMessage.classList.remove('hidden');
            map.setStyle(''); // Remove style for offline
        }
    });
});