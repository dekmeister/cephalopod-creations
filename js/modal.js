// Modal open/close/populate logic

import { pauseJSAnimations, resumeJSAnimations } from './animation.js';

let modalElement = null;
let modalTitle = null;
let modalDescription = null;
let modalLink = null;
let modalClose = null;
let cuttlefishContainer = null;
let lastFocusedElement = null;

/**
 * Trap focus within modal for accessibility
 */
function trapFocus(e) {
    if (!modalElement || modalElement.hasAttribute('hidden')) return;

    const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

/**
 * Open modal with site information
 */
export function openModal(siteData) {
    if (!modalElement) return;

    // Store last focused element to restore later
    lastFocusedElement = document.activeElement;

    // Populate modal content
    modalTitle.textContent = siteData.title;
    modalDescription.textContent = siteData.description;
    modalLink.href = siteData.url;
    modalLink.textContent = `Visit ${siteData.title} →`;

    // Show modal
    modalElement.removeAttribute('hidden');

    // Pause animations (CSS and JS)
    if (cuttlefishContainer) {
        cuttlefishContainer.classList.add('animation-paused');
    }
    pauseJSAnimations();

    // Add focus trap listener
    document.addEventListener('keydown', trapFocus);

    // Focus the close button for accessibility
    setTimeout(() => modalClose?.focus(), 100);
}

/**
 * Close modal and resume animations
 */
export function closeModal() {
    if (!modalElement) return;

    // Hide modal
    modalElement.setAttribute('hidden', '');

    // Resume animations (CSS and JS)
    if (cuttlefishContainer) {
        cuttlefishContainer.classList.remove('animation-paused');
    }
    resumeJSAnimations();

    // Remove focus trap listener
    document.removeEventListener('keydown', trapFocus);

    // Restore focus to element that triggered modal
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

/**
 * Initialize modal event listeners
 */
export function initModal() {
    // Get DOM elements
    modalElement = document.getElementById('modal');
    modalTitle = document.querySelector('.modal-title');
    modalDescription = document.querySelector('.modal-description');
    modalLink = document.querySelector('.modal-link');
    modalClose = document.querySelector('.modal-close');
    cuttlefishContainer = document.getElementById('cuttlefish-container');

    if (!modalElement) {
        console.error('Modal element not found');
        return;
    }

    // Close button click
    modalClose?.addEventListener('click', closeModal);

    // Click outside modal content (on overlay)
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalElement.hasAttribute('hidden')) {
            closeModal();
        }
    });

    console.log('Modal initialized');
}
