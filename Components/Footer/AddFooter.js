import {fetchElementFromURL} from "../URL-Fetching-And-Templates/cross-html-engine.js";
import {initialiseFooter} from "./Footer.js";

export async function addFooter() {
    const footerElement = await fetchElementFromURL(import.meta.resolve('./Footer.html'), ".footer")

    if (!footerElement)
    {
        console.error("addFooter failed to load footer");
        return;
    }

    await document.querySelector('body').insertAdjacentHTML('beforeend', footerElement.outerHTML);
    initialiseFooter();
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', addFooter);
}
else
{
    addFooter();
}