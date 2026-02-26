import {loadDataRefs, TryLoadJson} from "../../../CSS_JS/common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../../../CSS_JS/URL-Fetching-And-Templates/HTML_URL_Utility.js";

import {embedWebGLIFrame, minimalWebGLIFramePath, startEmbeddedGame} from "../../../CSS_JS/UnityWebGL/unity-embed-webGL-iframe.js";
import {createSwitchableContentContainer} from "../../../CSS_JS/common.blocks/switchable_content_container.js";

import HTMLContentCache from "../../../CSS_JS/URL-Fetching-And-Templates/HTMLContentCache.js";

async function initialize()
{
    let headerSection = document.getElementById('rotations')
    let jsonData = await TryLoadJson(new URL("../project_data.json", import.meta.url).href);
    if (!jsonData)
    {
        console.error("Failed to load project_data.json");
        return;
    }
    jsonData = resolveRelativeUrlsInJson('./project_data.json', jsonData);

    loadDataRefs(headerSection, jsonData);

    let webGLIFrame = embedWebGLIFrame(headerSection.querySelector('#WebGL-Build'), minimalWebGLIFramePath, jsonData.WebGLConfig);

    const scrollContainer = headerSection.querySelector('.scroll-container');
    const VideoScroller = headerSection.querySelector('[data-scriptName="video-toggle"]');
    const WebGLScroller = scrollContainer.querySelector('[data-scriptName="webgl-scroller"]');
    const video = scrollContainer.querySelector('video');

    scrollContainer.addEventListener('click', (event) => {
        if (event.target === WebGLScroller)
        {
            startEmbeddedGame(webGLIFrame);
        }
        if (event.target === VideoScroller)
        {
            video.paused ? video.play() : video.pause();
        }
        /* help the user by automatically pausing when they switch to smth else, such that no more audio is running in the background; though it also disabled them from listening while trying themselves what they listen to */
        else /* if(event.target !== VideoScroller) */
        {
            video.pause();
        }
    });
    video.addEventListener('click', (event) => {
        video.paused ? video.play() : video.pause();
    });

    /* on the main-page I need to create the switchableContentContainer to show the different contribution, while on the rotation-page the switchableContentContainer doesn't exist */
    if (document.querySelector('.rotations-workflow') === null)
    {
        return;
    }
    createSwitchableContentContainer(HTMLContentCache, 'rotations-workflow');
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    await initialize();
}
