import {TryLoadJson} from "../../../CSS_JS/common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../../../CSS_JS/URL-Fetching-And-Templates/cross-html-engine.js";
import {embedWebGLIFrame, startEmbeddedGame} from "../../../CSS_JS/UnityWebGL/unity-embed-webGL-iframe.js";

async function initialize()
{
    const LightboxWebGLBuild = document.querySelector('#lightbox-WebGL-build');
    const LightboxWebGLOverlay = LightboxWebGLBuild?.querySelector('.lightbox__overlay');
    const LightboxContent = LightboxWebGLBuild?.querySelector('.lightbox__content');
    const OpenProjectButton = document.querySelector('[data-scriptName="open-project-button"]');
    const LightboxCloseButton = LightboxWebGLBuild.querySelector(".lightbox__close-btn");
    const HeaderContainer = document.querySelector('.project-header-section-container');

    if (!OpenProjectButton || !HeaderContainer || !LightboxWebGLBuild || !LightboxWebGLOverlay || !LightboxContent || !LightboxCloseButton)
    {
        console.error("lightbox-webGL-build missing element", {OpenProjectButton, HeaderContainer, LightboxWebGLBuild, LightboxWebGLOverlay, LightboxContent, LightboxCloseButton});
        return;
    }

    //load-data-refs to get the build-path-data
    const absoluteJsonURL = new URL("../project_data.json", import.meta.url).href;
    const jsonData = await TryLoadJson(absoluteJsonURL);
    const resolvedJsonData = resolveRelativeUrlsInJson(absoluteJsonURL, jsonData);
    // loadDataRefs(OpenProjectButton, resolvedJsonData);

    const WebGLIFrame = await embedWebGLIFrame(LightboxContent, new URL("./rotations-unity-webgl-iframe.html", import.meta.url).href, resolvedJsonData.webGLConfig);
    if (!WebGLIFrame)
    {
        console.error("Failed to embed WebGL iframe");
        return;
    }

    OpenProjectButton.addEventListener('click', () => {
        LightboxWebGLOverlay.classList.add('--active');
        startEmbeddedGame(WebGLIFrame);
    });

    LightboxCloseButton.addEventListener('click', () => {
        LightboxWebGLOverlay.classList.remove('--active');
    })

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the header is NOT intersecting, it means we have scrolled past it
            // We check if it's not intersecting and the top is less than or equal to 0 (scrolled past or exactly at top)
            if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
                OpenProjectButton.classList.add('open-project-button--visible');
            } else {
                OpenProjectButton.classList.remove('open-project-button--visible');
            }
        });
    }, {
        threshold: 0,
        rootMargin: "0px"
    });

    observer.observe(HeaderContainer);
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    initialize();
}
