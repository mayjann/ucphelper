export function initVolumeSlider() {
    const slider = document.getElementById('AutoUpdateNotifySoundVolume');
    if (!slider) return;

    function updateSliderBackground() {
        const value = slider.value;
        slider.style.background = `linear-gradient(to right, #4fc3f7 0%, #4fc3f7 ${value}%, #444 ${value}%, #444 100%)`;
    }

    slider.addEventListener('input', updateSliderBackground);
    updateSliderBackground();
}