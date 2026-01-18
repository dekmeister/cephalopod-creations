// Tentacle animation and colour shifting controls

let animationEnabled = true;
let colourShiftInterval = null;
let toggleButton = null;

/**
 * Organic colour shifting on the body
 */
function shiftColours() {
    const hue = (Date.now() / 50) % 360;
    document.documentElement.style.setProperty('--cuttlefish-hue', hue);
}

/**
 * Start colour shifting animation
 */
function startColourShift() {
    if (colourShiftInterval) return;
    colourShiftInterval = setInterval(shiftColours, 100);
}

/**
 * Stop colour shifting animation
 */
function stopColourShift() {
    if (colourShiftInterval) {
        clearInterval(colourShiftInterval);
        colourShiftInterval = null;
    }
}

/**
 * Toggle animations on/off
 */
function toggleAnimations() {
    animationEnabled = !animationEnabled;
    const container = document.getElementById('cuttlefish-container');

    if (animationEnabled) {
        container?.classList.remove('animations-disabled');
        startColourShift();
        if (toggleButton) {
            toggleButton.innerHTML = '<span class="toggle-icon">⏸</span>';
            toggleButton.setAttribute('aria-label', 'Pause animations');
        }
    } else {
        container?.classList.add('animations-disabled');
        stopColourShift();
        if (toggleButton) {
            toggleButton.innerHTML = '<span class="toggle-icon">▶</span>';
            toggleButton.setAttribute('aria-label', 'Play animations');
        }
    }

    console.log('Animations', animationEnabled ? 'enabled' : 'disabled');
}

/**
 * Initialize animation controls
 */
export function initAnimation(enabled) {
    animationEnabled = enabled;

    // Get toggle button
    toggleButton = document.getElementById('animation-toggle');

    if (!toggleButton) {
        console.warn('Animation toggle button not found');
        return;
    }

    // Set initial state
    const container = document.getElementById('cuttlefish-container');
    if (animationEnabled) {
        container?.classList.remove('animations-disabled');
        startColourShift();
        toggleButton.innerHTML = '<span class="toggle-icon">⏸</span>';
        toggleButton.setAttribute('aria-label', 'Pause animations');
    } else {
        container?.classList.add('animations-disabled');
        toggleButton.innerHTML = '<span class="toggle-icon">▶</span>';
        toggleButton.setAttribute('aria-label', 'Play animations');
    }

    // Attach toggle button listener
    toggleButton.addEventListener('click', toggleAnimations);

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        animationEnabled = false;
        container?.classList.add('animations-disabled');
        stopColourShift();
        console.log('Animations disabled due to prefers-reduced-motion');
    }

    console.log('Animation initialized. Enabled:', animationEnabled);
}
