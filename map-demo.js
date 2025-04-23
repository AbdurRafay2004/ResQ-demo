document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = document.getElementById('mode-icon');
    const modeText = document.getElementById('mode-text');
    const onlineMap = document.getElementById('online-map');
    const offlineMap = document.getElementById('offline-map');
    const offlineMessage = document.getElementById('offline-message');

    let isOnline = true;

    // Set initial state to online mode
    modeIcon.textContent = '📶';
    modeText.textContent = 'Online Mode';
    modeToggle.classList.remove('bg-red-600', 'hover:bg-red-700');
    modeToggle.classList.add('bg-green-600', 'hover:bg-green-700');
    onlineMap.classList.remove('hidden');
    offlineMap.classList.add('hidden');
    offlineMessage.classList.add('hidden');

    modeToggle.addEventListener('click', () => {
        isOnline = !isOnline;

        if (isOnline) {
            modeIcon.textContent = '📶';
            modeText.textContent = 'Online Mode';
            modeToggle.classList.remove('bg-red-600', 'hover:bg-red-700');
            modeToggle.classList.add('bg-green-600', 'hover:bg-green-700');
            onlineMap.classList.remove('hidden');
            offlineMap.classList.add('hidden');
            offlineMessage.classList.add('hidden');
        } else {
            modeIcon.textContent = '🚫';
            modeText.textContent = 'Offline Mode';
            modeToggle.classList.remove('bg-green-600', 'hover:bg-green-700');
            modeToggle.classList.add('bg-red-600', 'hover:bg-red-700');
            onlineMap.classList.add('hidden');
            offlineMap.classList.remove('hidden');
            offlineMessage.classList.remove('hidden');
        }
    });
});