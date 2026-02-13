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

export async function fetchHTMLElementFromURL(url)
{
    try
    {
        const response = await fetch(url);
        if (!response.ok)
        {
            throw new Error("Failed to fetch " + url + ": " + response.statusText);
        }

        const htmlContent = await response.text();
        const parser = new DOMParser();
        const sourceDoc = parser.parseFromString(htmlContent, "text/html");
        return sourceDoc;
    }
    catch (error)
    {
        console.error("fetchHTMLFromURL: failed to load " + url + "\n" + error);
        return null;
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
