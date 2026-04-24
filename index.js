import {makeURLsAbsolute, reinitializeScripts} from "./CSS_JS/URL-Fetching-And-Templates/cross-html-engine.js";
import {loadExternalTemplate, createFragmentFromTemplate} from "./CSS_JS/URL-Fetching-And-Templates/template-manager.js";
import {initializeProjectHeaderSection} from "./CSS_JS/project-header-section/project-header-section.js";

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

    const projectHeaderSectionPath = "./CSS_JS/project-header-section/project-header-section.html";
    const projectHeaderTemplate = await loadExternalTemplate(projectHeaderSectionPath, "project-header-section-template");

    if (!projectHeaderTemplate)
    {
        console.error("load_highlight_sections: Failed to fetch project-header-section.html");
        return;
    }

    const fragment = createFragmentFromTemplate(projectHeaderTemplate);
    const projectHeaderSection = fragment.querySelector('.project-header-section');

    if (!projectHeaderSection)
    {
        console.error("load_highlight_sections: Failed to find .project-section in template");
        return;
    }
    let separator = document.createElement('hr');
    separator.classList.add('main__separator');
    aboutMeSection.after(separator);

    separator.after(projectHeaderSection);

    const projectDataURL = new URL("./Projects/Rotations/project_data.json", import.meta.url).href;
    const webglIframeURL = new URL("./Projects/Rotations/CSS_JS/rotations-unity-webgl-iframe.html", import.meta.url).href;
    await initializeProjectHeaderSection(projectHeaderSection, projectDataURL, webglIframeURL, 'rotations-workflow');
    projectHeaderSection.classList.add('main__panel');
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    initialize();
}