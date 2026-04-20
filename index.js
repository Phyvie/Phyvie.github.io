import {fetchElementFromURL, makeURLsAbsolute, reinitializeScripts} from "./CSS_JS/URL-Fetching-And-Templates/cross-html-engine.js";

async function initialize()
{
    await load_highlight_sections();
}

async function load_highlight_sections()
{
    const aboutMeSection = document.getElementById('about-me');
    if (!aboutMeSection)
    {
        console.error("load_highlight_sections: Failed to find #about-me section.");
        return;
    }

    const rotationsPath = "./Projects/Rotations/Rotations.html";
    const rotationSection = await fetchElementFromURL(rotationsPath, "#project-header-section", true);
    if (rotationSection)
    {
        let separator = document.createElement('hr');
        separator.classList.add('main__separator');
        aboutMeSection.after(separator);

        separator.after(rotationSection);
        reinitializeScripts(rotationSection);
    }
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    initialize();
}