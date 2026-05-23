import {fetchElementFromURL} from "../URL-Fetching-And-Templates/cross-html-engine.js";
import {initialiseNavBar} from "./NavBar.js";

export async function addNavBar() {
    const navbarElement = await fetchElementFromURL(import.meta.resolve('./NavBar.html'), ".navbar")

    if (!navbarElement)
    {
        console.error("addNavBar failed to load navBar");
        return;
    }

    // navbarElement.querySelectorAll("[data-rel-link]").forEach(
    //     linkElement => {
    //         let relativeLink = linkElement.href;
    //         linkElement.href = new URL(relativeLink, import.meta.url).href;
    //     }
    // )

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