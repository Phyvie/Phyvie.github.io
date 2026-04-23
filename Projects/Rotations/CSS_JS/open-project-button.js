import {loadDataRefs, TryLoadJson} from "../../../CSS_JS/common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../../../CSS_JS/URL-Fetching-And-Templates/cross-html-engine.js";
import {OpenLightbox} from "../../../CSS_JS/lightbox/lightbox.js";
import {startEmbeddedGame} from "../../../CSS_JS/UnityWebGL/unity-embed-webGL-iframe.js";

function initialize()
{
    const OpenProjectButton = document.querySelector('[data-scriptName="open-project-button"]');
    const HeaderSection = document.querySelector('#project-header-section');

    if (OpenProjectButton && HeaderSection)
    {
        // Load data-refs for the button if not already loaded by another script
        // Note: rotations-header-section.js might already call loadDataRefs on the header, 
        // but the button is outside the header in Rotations.html.
        const absoluteJsonURL = new URL("../project_data.json", import.meta.url).href;
        TryLoadJson(absoluteJsonURL).then(jsonData => {
            if (jsonData) {
                const resolvedJsonData = resolveRelativeUrlsInJson(absoluteJsonURL, jsonData);
                loadDataRefs(OpenProjectButton, resolvedJsonData);
            }
        });

        OpenProjectButton.addEventListener('click', () => {
            let WebGLBuildContainer = document.querySelector('#WebGL-Build');
            OpenLightbox(WebGLBuildContainer, false);
            let WebGLIFrame = WebGLBuildContainer.querySelector('iframe');
            if (WebGLIFrame)
            {
                startEmbeddedGame(WebGLIFrame);
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the header is NOT intersecting, it means we have scrolled past it
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    OpenProjectButton.classList.add('open-project-button--visible');
                } else {
                    OpenProjectButton.classList.remove('open-project-button--visible');
                }
            });
        }, {
            threshold: 0
        });

        observer.observe(HeaderSection);
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
