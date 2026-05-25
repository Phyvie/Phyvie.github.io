import {createFragmentFromTemplate, loadExternalTemplate} from "../Components/URL-Fetching-And-Templates/template-manager.js";
import {initializeProjectHeaderSection} from "../Components/project-header-section/project-header-section.js";

async function initialize() {
    await load_highlight_sections();
}

async function load_highlight_sections() {
    const highlightSection = document.getElementById('main__highlight_projects');
    if (!highlightSection)
    {
        console.error("load_highlight_sections: Failed to find #main__highlight_projects section.");
        return;
    }

    const projectHeaderSectionPath = "./Components/project-header-section/project-header-section.html";
    const projectHeaderTemplate = await loadExternalTemplate(projectHeaderSectionPath, "project-header-section-template");

    if (!projectHeaderTemplate) {
        console.error("load_highlight_sections: Failed to fetch project-header-section.html");
        return;
    }

    const highlightProjectsStart = highlightSection.querySelector('[data-scriptName="highlight-projects-start"]');
    let lastProject = highlightProjectsStart;
    for (const section of [
        {
            "jsonPath": new URL('../Projects/Rotations/project_data.json', import.meta.url).href
            , "config":
                {
                    "displayWebpageLink": true
                    , "initialiseWebGLBuild": true
                    , "webGLIFrameURL": new URL("../Components/UnityWebGL/lightbox/lightbox-webGL-iframe.html", import.meta.url).href
                }
        },
        {
            "jsonPath": new URL('../Projects/Moebius_Magnus/project_data.json', import.meta.url).href
            , "config":
                {
                    "displayWebpageLink": true,
                    "initialiseDevVideo": true
                }
        }]) {
        try {
            const fragment = createFragmentFromTemplate(projectHeaderTemplate);
            const projectHeaderSection = fragment.querySelector('.project-header-section');

            if (!projectHeaderSection) {
                console.error("load_highlight_sections: Failed to find .project-section in template");
                return;
            }

            const separator = document.createElement('hr');
            separator.classList.add('main__highlight-projects-separator');
            lastProject.after(separator);

            separator.after(projectHeaderSection);
            lastProject = projectHeaderSection;

            projectHeaderSection.classList.add('main__panel');

            await initializeProjectHeaderSection(projectHeaderSection, section.jsonPath, section.config);
        } catch (error) {
            console.error("load_highlight_sections: Failed to initialize project-header-section");
            console.error(error);
            continue;
        }
    }
    highlightProjectsStart.remove();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}