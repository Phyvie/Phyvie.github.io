import {loadDataRefs, TryLoadJson} from "../../../CSS_JS/common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../../../CSS_JS/URL-Fetching-And-Templates/HTML_URL_Utility.js";

import {embedWebGLIFrame, minimalWebGLIFramePath, startEmbeddedGame} from "../../../CSS_JS/UnityWebGL/unity-embed-webGL-iframe.js";
import {createSwitchableContentContainer} from "../../../CSS_JS/common.blocks/switchable_content_container.js";

import HTMLContentCache from "../../../CSS_JS/URL-Fetching-And-Templates/HTMLContentCache.js";
import {isLightboxOpen, closeLightbox, openLightbox} from "../../../CSS_JS/lightbox/lightbox.js";

async function initialize()
{
    let headerSection = document.getElementById('rotations')
    let absoluteJsonURL = new URL("../project_data.json", import.meta.url).href;
    let jsonData = await TryLoadJson(absoluteJsonURL);
    if (!jsonData)
    {
        console.error("Failed to load project_data.json");
        return;
    }
    jsonData = resolveRelativeUrlsInJson(absoluteJsonURL, jsonData);

    loadDataRefs(headerSection, jsonData);

    let webGLIFrame = embedWebGLIFrame(headerSection.querySelector('[data-scriptName="webgl-build"]'), minimalWebGLIFramePath, jsonData.WebGLConfig);

    const MediaScrollContainer = headerSection.querySelector('.scroll-container');
    const VideoScroller = headerSection.querySelector('[data-scriptName="video-toggle"]');
    const WebGLScroller = MediaScrollContainer.querySelector('[data-scriptName="webgl-scroller"]');
    const Video = MediaScrollContainer.querySelector('video');
    const FullscreenButton = MediaScrollContainer.querySelector('[data-scriptName="fullscreen-button"]');

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
            if (isLightboxOpen())
            {
                MediaScrollContainer.classList.remove('--height-contained');
                closeLightbox();
            }
            else
            {
                MediaScrollContainer.classList.add('--height-contained');
                openLightbox(MediaScrollContainer);
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
