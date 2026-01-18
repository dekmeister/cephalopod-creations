/**
 * Load site data from JSON file with error handling
 */
export async function loadSites() {
    try {
        const response = await fetch('data/sites.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data.sites || !Array.isArray(data.sites)) {
            throw new Error('Invalid data format: sites array not found');
        }

        // Filter out malformed entries and warn
        const validSites = data.sites.filter((site, index) => {
            const isValid = site.id && site.title && site.url && site.description;
            if (!isValid) {
                console.warn(`Skipping malformed site at index ${index}:`, site);
            }
            return isValid;
        });

        return {
            settings: data.settings || { animationEnabled: true },
            sites: validSites
        };

    } catch (error) {
        console.error('Failed to load sites.json:', error);
        throw error; // Re-throw to be handled by caller
    }
}