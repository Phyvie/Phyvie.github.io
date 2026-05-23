/*
 * A Collection of classes that help with loading Content from one HTML-document into another HTML-document
 *
 * purpose:
 * - collect generic function for HTML-loading into a single place to make them accessible from anywhere
 *
 * responsibilities:
 * - see functions
 *
 * connections:
 * - none
 */

export async function fetchElementFromURLAsString(url, adjustURLs = true)
{
    try
    {
        const response = await fetch(url);
        if (!response.ok)
        {
            throw new Error("Failed to fetch " + url + ": " + response.statusText);
        }

        let htmlContent = await response.text();
        if (adjustURLs)
        {
            htmlContent = await makeURLsAbsolute(htmlContent, url);
        }
        return htmlContent;
    }
    catch (error)
    {
        console.error("fetchElementFromURLAsString: failed to load " + url + "\n" + error);
        return null;
    }
}

export async function fetchElementFromURL(url, querySelector = null, makeURLsAbsolute = true)
{
    try
    {
        const htmlContent = await fetchElementFromURLAsString(url, makeURLsAbsolute);
        if (!htmlContent) return null;
        
        const parser = new DOMParser();
        const sourceDoc = parser.parseFromString(htmlContent, "text/html");
        let targetElement = sourceDoc;
        if (querySelector)
        {
            targetElement = sourceDoc.querySelector(querySelector);
            if (!targetElement)
            {
                throw new Error("Failed to find element with selector " + querySelector);
            }
        }
        return targetElement;
    }
    catch (error)
    {
        console.error("fetchElementFromURL: failed to load " + url + "\n" + error);
        return null;
    }
}

export async function makeURLsAbsolute(content, originalRootURL)
{
    const absoluteOriginalURL = new URL(originalRootURL, document.baseURI).href;

    if (typeof content === 'object' && content !== null)
    {
        return resolveRelativeUrlsInJson(absoluteOriginalURL, content);
    }

    let adjustedContent = content;

    //replace imports for scripts
    adjustedContent = adjustedContent.replace(
        /(from\s+['"])([^'"]+)(['"])/g,
        (match, prefix, path, suffix) => {
            const absoluteUrl = new URL(path, absoluteOriginalURL).href;
            return prefix + absoluteUrl + suffix;
        }
    );

    //replace src and href for images & stylesheets
    adjustedContent = adjustedContent.replace(
        /(href|src)\s*=\s*['"]?([^'"]+)['"]?/g, (match, prefix, path) => {
        const absoluteURL = new URL(path, absoluteOriginalURL).href;
        return prefix + '="' + absoluteURL + '"';
    })
    return adjustedContent;
}

/**
 * Re-executes scripts within a container (essential for injected HTML)
 */
export function reinitializeScripts(targetElement)
{
    const scripts = targetElement.querySelectorAll('script');
    for (const oldScript of scripts)
    {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(
            attribute => newScript.setAttribute(attribute.name, attribute.value)
        )

        if (oldScript.textContent)
        {
            if (oldScript.type === 'module')
            {
                // Note: If using the blob approach, we'd need to ensure URLAdjustedCode is available.
                // Assuming the user wants a simple re-execution:
                const blob = new Blob([oldScript.textContent], {type: 'application/javascript'});
                newScript.src = URL.createObjectURL(blob);
            }
            else
            {
                newScript.textContent = oldScript.textContent;
            }
        }

        oldScript.parentNode.replaceChild(newScript, oldScript)
    }
}

export function scrollIFrameToPosition(iframe_id, scroll_id){
    const iframe = document.getElementById(iframe_id);
    if (!iframe)
    {
        console.error("scrollIFrameToPosition: iframe with id " + iframe_id + " not found");
        return;
    }
    const iframe_document = iframe.contentWindow.document;
    if (!iframe_document)
    {
        console.error("scrollIFrameToPosition: iframe_document not found");
        return;
    }

    const scroll_element = iframe_document.getElementById(scroll_id);
    if (!scroll_element)
    {
        console.error("scrollIFrameToPosition: scroll_element with id " + scroll_id + " not found");
        return;
    }

    iframe.contentWindow.scrollTo(scroll_element.offsetLeft, scroll_element.offsetTop);
}

export function resolveRelativeUrlsInJson(absoluteJsonURL, jsonData) {
    // Deep clone the data to avoid modifying the original
    const resolvedData = structuredClone(jsonData);

    function processObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        }

        for (let key in obj) {
            if (typeof obj[key] === 'string' &&
                (obj[key].startsWith('./') || obj[key].startsWith('../'))) {
                try {
                    obj[key] = new URL(obj[key], absoluteJsonURL).href;
                } catch (e) {
                    console.warn(`Could not resolve URL: ${obj[key]}`, e);
                }
            }
            else if (typeof obj[key] === 'object') {
                processObject(obj[key]);
            }
        }
    }

    processObject(resolvedData);
    return resolvedData;
}