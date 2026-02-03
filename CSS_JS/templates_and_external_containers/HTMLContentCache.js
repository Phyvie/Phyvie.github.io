/**
 * ContentManager - Pure content caching and loading service
 *
 * purpose: keep the content-caching-backend independent of the frontend-UI that accesses it
 *
 * responsibilities:
 * - keep a map links->html-content
 *
 * connections:
 * - any frontend script that needs to access from another html-page. e.g., external-html-container.js
 */
class HTMLContentCache {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    async loadContentFromUrl(url)
    {
        // Check cache first
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        // Check if already loading
        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url);
        }

        // Create a new loading promise
        const loadPromise = this._fetchAndExtract(url)
            .then(content => {
                this.cache.set(url, content);
                this.loadingPromises.delete(url);
                return content;
            })
            .catch(error => {
                this.loadingPromises.delete(url);
                throw error;
            });

        this.loadingPromises.set(url, loadPromise);
        return loadPromise;
    }

    /**
     * Load content from a file and extract a section
     * @param {string} filePath - Path to HTML file
     * @param {string} sectionId - ID of section to extract
     * @returns {Promise<string>} HTML content
     */
    async loadContentFromPathAndId(filePath, sectionId) {
        return await this.loadContentFromUrl(`${filePath}#${sectionId}`);
    }

    /**
     * Fetch and extract section from HTML file
     * */
    async _fetchAndExtract(fullUrl) {
        let url;
        try {
            url = new URL(fullUrl, window.location.origin); // Handle relative URLs
        } catch (error) {
            throw new Error(`Invalid URL format: ${fullUrl}`);
        }
        
        const sectionId = url.hash.slice(1);
        const baseUrl = url.origin + url.pathname + url.search;

        if (!sectionId) {
            throw new Error(`No section ID found in URL: ${fullUrl}. Expected format: 'path#sectionId'`);
        }

        try {
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error(`HTMLContentCache-Error: HTTP ${response.status}: Failed to load ${baseUrl}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const element = doc.getElementById(sectionId);
            if (!element) {
                // List available IDs for debugging
                const availableIds = Array.from(doc.querySelectorAll('[id]')).map(el => el.id);
                throw new Error(`Element #${sectionId} not found in ${baseUrl}. Available IDs: ${availableIds.length > 0 ? availableIds.join(', ') : 'none'}`);
            }

            return element.outerHTML;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error(`Network error: Could not fetch ${baseUrl}. Check your internet connection.`);
            }
            throw error;
        }
    }

    validateUrl(url) {
        try {
            new URL(url, window.location.origin);
            return url.includes('#');
        } catch {
            return false;
        }
    }

    /*
     * requests is an array of objects named url; e.g.:
       const requests = [
            { url: "path/to/file1.html#section1" },
            { url: "path/to/file2.html#section2" },
            { url: "path/to/file3.html#section3" }
        ];
     */
    async preload(requests) {
        const promises = requests.map(
            ({url}) =>
                this.loadContentFromUrl(url).catch(() => null)
        );
        await Promise.all(promises);
    }
    
    clearCache(filePath = null, sectionId = null) {
        if (!filePath) {
            this.cache.clear();
        } else if (!sectionId) {
            // Clear all sections from this file
            for (const key of this.cache.keys()) {
                if (key.startsWith(`${filePath}#`)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.delete(`${filePath}#${sectionId}`);
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            cachedItems: this.cache.size,
            loadingItems: this.loadingPromises.size,
            cacheKeys: Array.from(this.cache.keys())
        };
    }
}

export default new HTMLContentCache();