// Main entry point for the Cuttlefish Index application
import { loadSites } from './data-loader.js';
import { generateCuttlefish } from './cuttlefish.js';
import { initModal, openModal } from './modal.js';
import { initAnimation } from './animation.js';

/**
 * Attach click handlers to tentacles
 */
function attachTentacleHandlers(sites) {
    sites.forEach(site => {
        const tentacle = document.getElementById(`tentacle-${site.id}`);
        if (!tentacle) {
            console.warn(`Tentacle not found for site: ${site.id}`);
            return;
        }

        // Click handler
        const handleClick = (e) => {
            e.preventDefault();
            openModal(site);
        };

        // Mouse and keyboard events
        tentacle.addEventListener('click', handleClick);
        tentacle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(e);
            }
        });
    });
}

async function init() {
    try {
        // Load site data
        const data = await loadSites();

        // Generate the cuttlefish SVG
        const container = document.getElementById('cuttlefish-container');
        generateCuttlefish(container, data.sites);

        // Initialize modal functionality
        initModal();

        // Attach click handlers to tentacles
        attachTentacleHandlers(data.sites);

        // Initialize animation controls
        initAnimation(data.settings.animationEnabled);

    } catch (error) {
        console.error('Failed to initialize application:', error);
        const container = document.getElementById('cuttlefish-container');
        container.innerHTML = '<div class="error-message">Failed to load the cuttlefish. Please refresh the page.</div>';
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
