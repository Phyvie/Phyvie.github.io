/* Create Containers that can switch their content based on clicking on a button
 *
 * purpose:
 * frontend class that manages a content-container that can switch content based on clicks on accessors
 *
 * responsibilities:
 * - switch the content of a content-container based on loading content from elsewhere (typically HTMLContentCache)
 * - set up the clicking on accessors
 *
 * connections:
 * - backend content cache (typically HTMLContentCache)
 */

// NOWZyKa workflow: checkout how easy/complicated it is to create a new content-container, as well as how bug-safe it is

class SwitchableContentContainer {
    constructor() {
        this.contentCache = null;  // Initialize as null instead of HTMLContentCache
        this.contentContainer = null;
        this.activeAccessor = null;
        this.options = {};
        this.currentUrl = null;  // Move declaration here
        this.isDestroyed = false;  // Add cleanup tracking
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
        this.setupClickListener();
        this.setupGlobalEvents();
    }

    setupClickListener() {
        // Store reference for cleanup
        this.clickHandler = async (event) => {
            if (this.isDestroyed) return;
            
            const clickedAccessor = event.target.closest('[data-cached-content]');
            if (!clickedAccessor) return;
            
            // Check if this accessor targets our container
            const targetContainerId = clickedAccessor.getAttribute('data-content-container-id');
            if (targetContainerId !== this.contentContainer.id) { return; }

            event.preventDefault();
            await this.handleAccessorClick(clickedAccessor);
        };
        
        document.addEventListener('click', this.clickHandler);
    }

    setupGlobalEvents() {
        // setup keyboard-events or something like that
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
        //special case: set content inactive if the user wants to undo active accessor via clicking again the active accessor
        if (this.activeAccessor && this.activeAccessor === newAccessor)
        {
            this.contentContainer.innerHTML = "";
            this.activeAccessor.classList.remove("tag--active");
            this.activeAccessor = null;
            this.contentContainer.classList.add("project-section__workflow--collapsed");
            return;
        }

        if (this.activeAccessor)
        {
            this.activeAccessor.classList.remove("tag--active");
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
            this.reinitializeScripts(container);
        }
        catch (error)
        {
            console.error('Failed to load content:', error);
            container.innerHTML = `<p>Error: ${error.message}</p>`;
            container.classList.remove("--loading");
        }
    }

    reinitializeScripts(targetElement)
    {
        const scripts = targetElement.querySelectorAll('script');
        for (const oldScript of scripts)
        {
            this.reinitializeScript(oldScript);
        }
    }

    reinitializeScript(oldScript)
    {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(
            attribute => newScript.setAttribute(attribute.name, attribute.value)
        )

        if (oldScript.textContent)
        {
            newScript.textContent = oldScript.textContent;
        }

        oldScript.parentNode.replaceChild(newScript, oldScript)
    }

    destroy() {
        this.isDestroyed = true;
        if (this.clickHandler) {
            document.removeEventListener('click', this.clickHandler);
        }
        this.contentContainer = null;
        this.contentCache = null;
        this.activeAccessor = null;
    }
}

const activeContainers = new Map();

export function createSwitchableContentContainer(HTMLContentCache, containerID, options = {})
{
    if (activeContainers.has(containerID)) {
        console.warn('Trying to initialize multi SwitchableContentContainer with the same ID: ' + containerID + '. Returning already existing instance. ')
        return activeContainers.get(containerID);
    }

    const container = new SwitchableContentContainer();
    container.init(HTMLContentCache, containerID, options);
    activeContainers.set(containerID, container);

    // imho logically reading this from 1. to 5. is easier than top-to-bottom
    container.destroy =
    (function (originalDestroyFunction) // 4. create a function that can return a wrapped-destroy-function
        {
            //3. return the wrapped function
            return function ()
            {
                // 1. call the original destroy function
                originalDestroyFunction.call(this);
                // 2. add extra functionality
                activeContainers.delete(containerID);
            }
        }
    )(container.destroy); // 5. call the newly created function with the original destroy passed in to create the wrappedDestroyFunction

    return container;
}