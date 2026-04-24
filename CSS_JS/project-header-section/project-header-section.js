import {loadDataRefs, TryLoadJson} from "../common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../URL-Fetching-And-Templates/cross-html-engine.js";

import {embedWebGLIFrame, startEmbeddedGame} from "../UnityWebGL/unity-embed-webGL-iframe.js";
import {createSwitchableContentContainer} from "../common.blocks/switchable-content-container.js";

import HTMLContentCache from "../URL-Fetching-And-Templates/HTML-content-cache.js";
import {IsLightboxOpen, CloseLightbox, OpenLightbox, SetLightboxStyle, fullscreenStyle} from "../lightbox/lightbox.js";

export async function initializeProjectHeaderSection(headerSection, projectDataURL, webglIframeURL, workflowContainerId = null)
{
    let jsonData = await TryLoadJson(projectDataURL);
    if (!jsonData)
    {
        console.error("Failed to load project data from: " + projectDataURL);
        return;
    }
    jsonData = resolveRelativeUrlsInJson(projectDataURL, jsonData);

    loadDataRefs(headerSection, jsonData);

    const MediaScrollContainer = headerSection.querySelector('.scroll-container');
    const VideoScroller = headerSection.querySelector('[data-scriptName="video-toggle"]');
    const WebGLScroller = MediaScrollContainer.querySelector('[data-scriptName="webgl-scroller"]');
    const Thumbnail = MediaScrollContainer.querySelector('img');
    const Video = MediaScrollContainer.querySelector('video');
    const FullscreenButton = MediaScrollContainer.querySelector('[data-scriptName="fullscreen-button"]');

    if (jsonData.webGLConfig && WebGLScroller)
    {
        let webGLIFrame = await embedWebGLIFrame(headerSection.querySelector('[data-scriptName="webgl-build"]'), webglIframeURL, jsonData.webGLConfig);
    }

    if (Thumbnail && Video)
    {
        Video.style.display = "none";
        Thumbnail.addEventListener('click', () => {
            Video.play();
        })

        Video.addEventListener('play', () => {
            Thumbnail.style.display = "none";
            Video.style.display = "block";
        })

        Video.addEventListener('ended', () =>{
            Thumbnail.style.display = "block";
            Video.style.display = "none";
        })
    }

    if (MediaScrollContainer) {
        MediaScrollContainer.addEventListener('click', (event) => {
            if (event.target === WebGLScroller)
            {
                if (webGLIFrame) {
                    startEmbeddedGame(webGLIFrame);
                }
            }
            if (event.target === VideoScroller)
            {
                if (Video) {
                    Video.paused ? Video.play() : Video.pause();
                }
            }
            else
            {
                if (Video) {
                    Video.pause();
                }
            }
        });
    }

    if (Video) {
        Video.addEventListener('click', (event) => {
            Video.paused ? Video.play() : Video.pause();
        });
    }


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

    if (workflowContainerId && document.getElementById(workflowContainerId))
    {
        createSwitchableContentContainer(HTMLContentCache, workflowContainerId);
    }
}
