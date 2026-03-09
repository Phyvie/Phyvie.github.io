import {fetchHTMLElementFromURL} from "../CSS_JS/URL-Fetching-And-Templates/HTML_URL_Utility.js";
import {initialiseNavBar} from "./NavBar.js";

export async function addNavBar() {
    const navbarElement = await fetchHTMLElementFromURL(import.meta.resolve('./NavBar.html'), ".navbar")

    if (!navbarElement)
    {
        console.error("addNavBar failed to load navBar");
        return;
    }

    navbarElement.querySelectorAll("[data-rel-link]").forEach(
        linkElement => {
            let absoluteLink = new URL(linkElement.getAttribute("data-rel-link"), import.meta.url).href;
            linkElement.href = absoluteLink;
        }
    )

    await document.querySelector('body').insertAdjacentHTML('afterbegin', navbarElement.outerHTML);
    initialiseNavBar();
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', addNavBar);
}
else
{
    addNavBar();
}