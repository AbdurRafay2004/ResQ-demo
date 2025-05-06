document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = document.getElementById('mode-icon');
    const modeText = document.getElementById('mode-text');
    const offlineMessage = document.getElementById('offline-message');

    let isOnline = true;
    let map;
    const distressSignals = [];
    const crimeHotspots = [
        { lat: 23.807610, lng: 90.369018 },
        { lat: 23.807895, lng: 90.373577 }
    ];

    mapboxgl.accessToken = 'pk.eyJ1IjoidGFoc2luMjAwNCIsImEiOiJjbTlyemV4dngxdXZzMmlzYTgxZ3Q3enFyIn0.9n4fWcTg66Oe7wIRp4Vd7g';

    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat')) || 23.7104;
    const lng = parseFloat(urlParams.get('lng')) || 90.4074;

    function initMap() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        map = new mapboxgl.Map({
            container: 'map',
            style: isOnline ? 'mapbox://styles/mapbox/streets-v11' : '',
            center: [lng, lat],
            zoom: 13,
            interactive: true,
            dragPan: true, // Enable panning for all devices
            touchZoomRotate: true, // Enable pinch-zoom and rotation
            touchPitch: true, // Enable two-finger pitch
            cooperativeGestures: isMobile // Require two-finger gestures on mobile
        });

        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
        }));

        // Show touch hint on mobile until a valid gesture is detected
        if (isMobile) {
            const touchHint = document.getElementById('touch-hint');
            if (touchHint) {
                let gestureDetected = false;
                touchHint.classList.remove('hidden');
                map.on('touchstart', (e) => {
                    if (e.points.length >= 2 && !gestureDetected) {
                        gestureDetected = true;
                        touchHint.classList.add('hidden');
                    }
                });
            }
        }

        if (urlParams.get('lat') && urlParams.get('lng')) {
            addDistressSignal({ lngLat: { lng, lat } });
        }

        addCrimeHotspots();

        map.on('click touchend', (e) => {
            if (e.originalEvent.type === 'touchend' && e.originalEvent.touches.length > 1) return;
            addDistressSignal(e);
        });

        loadDistressSignals();
    }

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

    function saveDistressSignal(lat, lng) {
        const signals = JSON.parse(localStorage.getItem('distressSignals') || '[]');
        signals.push({ lat, lng, timestamp: Date.now() });
        localStorage.setItem('distressSignals', JSON.stringify(signals));
    }

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

    modeIcon.textContent = '📶';
    modeText.textContent = 'Online Mode';
    modeToggle.classList.remove('bg-red-600', 'hover:bg-red-700');
    modeToggle.classList.add('bg-green-600', 'hover:bg-green-700');
    offlineMessage.classList.add('hidden');
    initMap();

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
            map.setStyle('');
        }
    });
});