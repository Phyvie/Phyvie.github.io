import {loadExternalTemplate, createFragmentFromTemplate} from "../../../CSS_JS/URL-Fetching-And-Templates/template-manager.js";
import {initializeProjectHeaderSection} from "../../../CSS_JS/project-header-section/project-header-section.js";

async function initialize()
{
    const projectHeaderSectionPath = "../../../CSS_JS/project-header-section/project-header-section.html";
    const projectHeaderTemplate = await loadExternalTemplate(projectHeaderSectionPath, "project-header-section-template");
    
    const targetElement = document.getElementById('project-header-section-container');
    
    if (projectHeaderTemplate && targetElement)
    {
        const fragment = createFragmentFromTemplate(projectHeaderTemplate);
        const projectHeaderSection = fragment.querySelector('.project-header-section');

        if (projectHeaderSection) {
            targetElement.appendChild(projectHeaderSection);

            const projectDataURL = new URL("../project_data.json", import.meta.url).href;
            await initializeProjectHeaderSection(projectHeaderSection, projectDataURL,
                {
                    "initialiseWebGLBuild": true
                    , "webGLIFrameURL": new URL("../../../CSS_JS/UnityWebGL/lightbox/lightbox-webGL-iframe.html", import.meta.url).href
                });
        }
    }
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    await initialize();
}
