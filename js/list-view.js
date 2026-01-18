/**
 * List View Module
 * Provides a plaintext list view of all sites as an alternative to the interactive cuttlefish
 */

/**
 * Populates the list view with site data
 * @param {Array} sites - Array of site objects from sites.json
 */
export function populateListView(sites) {
    const listElement = document.getElementById('site-list');
    if (!listElement) {
        console.error('List view element not found');
        return;
    }

    // Clear existing content
    listElement.innerHTML = '';

    // Generate list items
    sites.forEach(site => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.href = site.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const title = document.createElement('strong');
        title.textContent = site.title;

        const description = document.createTextNode(` — ${site.description}`);

        link.appendChild(title);
        link.appendChild(description);
        li.appendChild(link);

        listElement.appendChild(li);
    });
}

/**
 * Initializes the list view toggle functionality
 */
export function initListView() {
    const listViewElement = document.getElementById('list-view');
    const toggleButton = document.getElementById('list-toggle');
    const closeButton = document.querySelector('.list-view-close');

    if (!listViewElement || !toggleButton) {
        console.error('List view elements not found');
        return;
    }

    // Open list view
    const openListView = () => {
        listViewElement.hidden = false;
        toggleButton.setAttribute('aria-expanded', 'true');

        // Focus the close button when opened
        if (closeButton) {
            closeButton.focus();
        }
    };

    // Close list view
    const closeListView = () => {
        listViewElement.hidden = true;
        toggleButton.setAttribute('aria-expanded', 'false');

        // Return focus to toggle button
        toggleButton.focus();
    };

    // Toggle button click
    toggleButton.addEventListener('click', () => {
        if (listViewElement.hidden) {
            openListView();
        } else {
            closeListView();
        }
    });

    // Close button click
    if (closeButton) {
        closeButton.addEventListener('click', closeListView);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !listViewElement.hidden) {
            closeListView();
        }
    });

    // Close on overlay click (clicking outside the content)
    listViewElement.addEventListener('click', (e) => {
        if (e.target === listViewElement) {
            closeListView();
        }
    });

    console.log('List view initialized');
}
