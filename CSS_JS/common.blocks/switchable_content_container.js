/* script for creating ContentContainer that can switch their content to content from another HTML-page
 *
 * how to use:
 * - add "data-cached-content="page-url#elementid" & "data-content-container-id="id_of_content-container"" to any element that should trigger a content switch
 * - call createSwitchableContentContainer(HTMLContentCache, containerID, options) to initialise the interactivity
 */

/*
 * Manager for SwitchableContentContainers
 *
 * purpose: Centralise
 *
 * responsibilities:
 * - create&register container (destruct & unregister)
 * - listen for global clicks on accessors and switch content accordingly
 *
 * connections:
 * SwitchAbleContentContainer (see below)
 */
class SwitchableContentContainerManager {
    constructor() {
        this.containers = new Map();
        this.isListening = false;
        this.globalClickHandler = this.handleGlobalClick.bind(this);
    }

    createContainer(HTMLContentCache, containerID, options = {}) {
        // Check for duplicates
        if (this.containers.has(containerID)) {
            console.warn(`SwitchableContentContainer with ID '${containerID}' already exists. Returning existing instance.`);
            return this.containers.get(containerID);
        }

        const container = new Switchable_content_container();
        container.init(HTMLContentCache, containerID, options);
        
        this.registerContainer(containerID, container);
        return container;
    }

    registerContainer(containerId, containerInstance) {
        this.containers.set(containerId, containerInstance);
        this.startListening();
        
        // Wrap the container's destroy method to clean up registration
        const originalDestroy = containerInstance.destroy.bind(containerInstance);
        containerInstance.destroy = () => {
            originalDestroy();
            this.unregisterContainer(containerId);
        };
    }

    unregisterContainer(containerId) {
        this.containers.delete(containerId);
        if (this.containers.size === 0) {
            this.stopListening();
        }
    }

    startListening() {
        if (!this.isListening) {
            document.addEventListener('click', this.globalClickHandler);
            this.isListening = true;
        }
    }

    stopListening() {
        if (this.isListening) {
            document.removeEventListener('click', this.globalClickHandler);
            this.isListening = false;
        }
    }

    async handleGlobalClick(event) {
        const clickedAccessor = event.target.closest('[data-cached-content]');
        if (!clickedAccessor) return;

        const targetContainerId = clickedAccessor.getAttribute('data-content-container-id');
        if (!targetContainerId) return;

        const container = this.containers.get(targetContainerId);
        if (!container || container.isDestroyed) return;

        event.preventDefault();
        await container.handleAccessorClick(clickedAccessor);
    }
}

const globalEventManager = new SwitchableContentContainerManager();

/* Content Containers that can switch their content based on user input
 *
 * purpose:
 * frontend class that manages a content-container that can switch content based on clicks on accessors
 *
 * responsibilities:
 * - switch the content of a content-container based on loading content from elsewhere (typically HTMLContentCache)
 *
 * connections:
 * - SwitchableContentEventManager -> forwards clicks to the SwitchableContentContainer
 * - backend content cache (typically HTMLContentCache)
 */
class Switchable_content_container {
    constructor() {
        this.contentCache = null;
        this.contentContainer = null;
        this.activeAccessor = null;
        this.options = {};
        this.currentUrl = null;
        this.isDestroyed = false;
    }

    init(HTMLContentCache, contentContainerID, options = {}) {
        if (!contentContainerID) {
            throw new Error('contentContainerID is required');
        }
        
        this.contentCache = HTMLContentCache;
        this.contentContainer = document.getElementById(contentContainerID);
        
        if (!this.contentContainer) {
            throw new Error(`Element with ID '${contentContainerID}' not found`);
        }
        
        this.options = options;
        // Note: registration happens in the manager's createContainer method
    }

    async handleAccessorClick(clickedAccessor) {
        if (this.isHandlingClick) {return; }
        this.isHandlingClick = true;

        try
        {
            await this.switchActiveAccessor(this.contentContainer, clickedAccessor);
        }
        finally
        {
            //timeout so that accidental double-clicks are avoided
            setTimeout(() => {this.isHandlingClick = false;}, 100);
        }
    }

    async switchActiveAccessor(container, newAccessor)
    {
        if (this.activeAccessor)
        {
            this.activeAccessor.classList.remove("tag--active");
        }

        //special case: set content inactive if the user wants to undo active accessor via clicking again the active accessor
        if (this.activeAccessor === newAccessor)
        {
            this.contentContainer.innerHTML = "";
            this.activeAccessor = null;
            this.contentContainer.classList.add("project-section__workflow--collapsed");
            return;
        }

        this.activeAccessor = newAccessor;
        this.activeAccessor.classList.add("tag--active");
        await this.loadContent(this.contentContainer, newAccessor.getAttribute("data-cached-content"));
        this.contentContainer.classList.remove("project-section__workflow--collapsed");
    }

    async loadContent(container, contentUrl) {
        if (!container || !(container instanceof HTMLElement)) {
            console.error("ContentContainer->loadContent: container is not an HTMLElement");
            return;
        }

        // Prevent loading if already loading the same URL
        if (this.currentUrl === contentUrl && container.classList.contains("--loading")) {
            return;
        }

        this.currentUrl = contentUrl;
        container.innerHTML = "Loading...";
        container.classList.add("--loading");

        try
        {
            const content = await this.contentCache.loadContentFromUrl(contentUrl);
            
            // Check if URL changed while loading (race condition protection)
            if (this.currentUrl !== contentUrl) {
                return;
            }
            
            container.innerHTML = content;
            container.classList.remove("--loading");
            this.reinitializeScripts(container, contentUrl);
        }
        catch (error)
        {
            console.error('Failed to load content:', error);
            container.innerHTML = `<p>Error: ${error.message}</p>`;
            container.classList.remove("--loading");
        }
    }

    reinitializeScripts(targetElement, originalURL)
    {
        const scripts = targetElement.querySelectorAll('script');
        for (const oldScript of scripts)
        {
            this.reinitializeScript(oldScript, originalURL);
        }
    }

    reinitializeScript(oldScript, originalURL)
    {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(
            attribute => newScript.setAttribute(attribute.name, attribute.value)
        )

        if (oldScript.textContent)
        {
            if (oldScript.type === 'module')
            {
                const absoluteOriginalURL = new URL(originalURL, document.baseURI).href;

                const URLAdjustedCode = oldScript.textContent.replace(
                    /(from\s+['"])([^'"]+)(['"])/g,
                    (match, prefix, path, suffix) =>
                    {
                        const absoluteUrl = new URL(path, absoluteOriginalURL).href;
                        return prefix + absoluteUrl + suffix;
                    }
                )

                const blob = new Blob([URLAdjustedCode], {type: 'application/javascript'});
                newScript.src = URL.createObjectURL(blob);
            }
            else
            {
                newScript.textContent = oldScript.textContent;
            }
        }

        oldScript.parentNode.replaceChild(newScript, oldScript)
    }

    destroy() {
        this.isDestroyed = true;
        this.contentContainer = null;
        this.contentCache = null;
        this.activeAccessor = null;
        // Note: unregistration happens via the wrapped destroy method
    }
}

// Factory function - delegate to the manager
export function createSwitchableContentContainer(HTMLContentCache, containerID, options = {}) {
    return globalEventManager.createContainer(HTMLContentCache, containerID, options);
}
