import {loadDataRefs, TryLoadJson} from "../../../CSS_JS/common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../../../CSS_JS/URL-Fetching-And-Templates/cross-html-engine.js";

import {embedWebGLIFrame, startEmbeddedGame} from "../../../CSS_JS/UnityWebGL/unity-embed-webGL-iframe.js";
import {createSwitchableContentContainer} from "../../../CSS_JS/common.blocks/switchable-content-container.js";

import HTMLContentCache from "../../../CSS_JS/URL-Fetching-And-Templates/HTML-content-cache.js";
import {IsLightboxOpen, CloseLightbox, OpenLightbox, SetLightboxStyle, fullscreenStyle} from "../../../CSS_JS/lightbox/lightbox.js";

async function initialize()
{
    let headerSection = document.getElementById('project-header-section');
    let absoluteJsonURL = new URL("../project_data.json", import.meta.url).href;
    let jsonData = await TryLoadJson(absoluteJsonURL);
    if (!jsonData)
    {
        console.error("Failed to load project_data.json");
        return;
    }
    jsonData = resolveRelativeUrlsInJson(absoluteJsonURL, jsonData);

    loadDataRefs(headerSection, jsonData);

    const MediaScrollContainer = headerSection.querySelector('.scroll-container');
    const VideoScroller = headerSection.querySelector('[data-scriptName="video-toggle"]');
    const WebGLScroller = MediaScrollContainer.querySelector('[data-scriptName="webgl-scroller"]');
    const Video = MediaScrollContainer.querySelector('video');
    const FullscreenButton = MediaScrollContainer.querySelector('[data-scriptName="fullscreen-button"]');

    let webGLIFrame = await embedWebGLIFrame(headerSection.querySelector('[data-scriptName="webgl-build"]'), new URL("./rotations-unity-webgl-iframe.html", import.meta.url).href, jsonData.WebGLConfig);

    MediaScrollContainer.addEventListener('click', (event) => {
        if (event.target === WebGLScroller)
        {
            startEmbeddedGame(webGLIFrame);
        }
        if (event.target === VideoScroller)
        {
            Video.paused ? Video.play() : Video.pause();
        }
        /* help the user by automatically pausing when they switch to smth else, such that no more audio is running in the background; though it also disabled them from listening while trying themselves what they listen to */
        else /* if(event.target !== VideoScroller) */
        {
            Video.pause();
        }
    });
    Video.addEventListener('click', (event) => {
        Video.paused ? Video.play() : Video.pause();
    });


    if (FullscreenButton)
    {
        FullscreenButton.addEventListener('click', () => {
            if (IsLightboxOpen())
            {
                MediaScrollContainer.classList.remove('--height-contained');
                CloseLightbox();
            }
            else
            {
                MediaScrollContainer.classList.add('--height-contained');
                OpenLightbox(MediaScrollContainer);
                SetLightboxStyle(fullscreenStyle);
            }
        })
    }

    /* on the main-page I need to create the switchableContentContainer to show the different contribution, while on the rotation-page the switchableContentContainer doesn't exist */
    if (document.querySelector('#rotations-workflow'))
    {
        createSwitchableContentContainer(HTMLContentCache, 'rotations-workflow');
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
