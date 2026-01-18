// Tentacle animation and colour shifting controls

import { generateMantleFin } from './cuttlefish.js';

let animationEnabled = true;
let colourShiftInterval = null;
let finAnimationInterval = null;
let finPhase = 0;
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
 * Animate the fin by updating its wave phase
 */
function animateFin() {
    finPhase += 0.15;

    const fin = document.querySelector('.cuttlefish-fin');
    if (!fin) return;

    // Generate new path data with updated phase
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generateMantleFin(finPhase);
    const newPath = tempDiv.querySelector('path');

    if (newPath) {
        fin.setAttribute('d', newPath.getAttribute('d'));
    }
}

/**
 * Start fin animation
 */
function startFinAnimation() {
    if (finAnimationInterval) return;
    finAnimationInterval = setInterval(animateFin, 80);
}

/**
 * Stop fin animation
 */
function stopFinAnimation() {
    if (finAnimationInterval) {
        clearInterval(finAnimationInterval);
        finAnimationInterval = null;
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
        startFinAnimation();
        if (toggleButton) {
            toggleButton.innerHTML = '<span class="toggle-icon">⏸</span>';
            toggleButton.setAttribute('aria-label', 'Pause animations');
        }
    } else {
        container?.classList.add('animations-disabled');
        stopColourShift();
        stopFinAnimation();
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
        startFinAnimation();
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
        stopFinAnimation();
        console.log('Animations disabled due to prefers-reduced-motion');
    }

    console.log('Animation initialized. Enabled:', animationEnabled);
}

/**
 * Pause JS-driven animations (for modal)
 */
export function pauseJSAnimations() {
    stopColourShift();
    stopFinAnimation();
}

/**
 * Resume JS-driven animations (for modal)
 */
export function resumeJSAnimations() {
    if (animationEnabled) {
        startColourShift();
        startFinAnimation();
    }
}
