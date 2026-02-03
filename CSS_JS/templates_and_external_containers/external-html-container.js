/*
 * Create caches of content from external HTML files and load them into an element at runtime
 *
 * purpose:
 * - add content to a page from another page, such that the original page remains clean
 *
 * responsibilities:
 * - load external html content into a cache
 * - replace html.inner of an element with some cached value
 *
 * connections:
 * - HTML-loading-utility.js for loading a different HTML-file
 */

import {loadHTMLFromURL} from "./HTML-loading-utility.js";

class ExternalHtmlContainer {
    constructor()
    {
        this.htmlCache = new Map();
        this.contentCache = new Map();
        this.contentContainer = null;
    }

    async init(contentContainerId, linkRoot) {
        this.setContentContainer(contentContainerId);
        await this.initializeContentCache(linkRoot);
    }

    setContentContainer(contentContainerId)
    {
        this.contentContainer = document.getElementById(contentContainerId);
        if (!this.contentContainer)
        {
            console.error("setContentContainer: contentContainer with id " + contentContainerId + " not found");
        }
    }

    async initializeContentCache(linkRootID)
    {
        const linkRootElement = document.getElementById(linkRootID);
        if (!linkRootElement)
        {
            console.error("preloadCache: linkRootElement with id " + linkRootID + " not found");
            return;
        }

        const cache_accessors = linkRootElement.querySelectorAll('[data-cached-content]');
        for (const accessor of cache_accessors)
        {
            const refName = accessor.getAttribute('data-cached-content');
            const [pageURL, elementID] = refName.split('#');

            let htmlPage;
            if (this.htmlCache.has(pageURL))
            {
                htmlPage = this.htmlCache.get(pageURL);
            }
            else
            {
                htmlPage = await loadHTMLFromURL(pageURL);
            }

            if (!htmlPage)
            {
                console.error("preloadCache: failed to load html from " + pageURL);
                continue;
            }

            const linkedElement = htmlPage.getElementById(elementID);
            if (!linkedElement)
            {
                console.error("preloadCache: element with id " + elementID + " not found in " + pageURL);
                continue;
            }

            this.contentCache.set(refName, linkedElement.innerHTML);

            accessor.addEventListener('click', (event) =>
            {
                this.contentContainer.innerHTML = linkedElement.innerHTML;
            });
        }
    }
}

export async function createExternalHTMLContainer(contentContainerId, linkRoot)
{
    const container = new ExternalHtmlContainer();
    await container.init(contentContainerId, linkRoot);
    return container;
}

export function reinitializeScripts(targetElement)
{
    const scripts = targetElement.querySelectorAll('script');
    for (const oldScript of scripts)
    {
        reinitializeScript(oldScript);
    }
}

export function reinitializeScript(oldScript)
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