import {loadDataRefs, TryLoadJson} from "../common.blocks/load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../URL-Fetching-And-Templates/cross-html-engine.js";

import {embedWebGLIFrame, startEmbeddedGame} from "../UnityWebGL/unity-embed-webGL-iframe.js";
import {createSwitchableContentContainer} from "../common.blocks/switchable-content-container.js";

import HTMLContentCache from "../URL-Fetching-And-Templates/HTML-content-cache.js";
import {IsLightboxOpen, CloseLightbox, OpenLightbox, SetLightboxStyle, fullscreenStyle} from "../lightbox/lightbox.js";

export async function initializeProjectHeaderSection(headerSection, projectDataURL,
     config = {
         "initialiseWebGLBuild": false
         , "webglIframeURL": ""
         , "hasWorkflowContainer": false
         , "workflowContainerId": ""
         , "displayWebpageLink": false
     })
{
    let jsonData = await TryLoadJson(projectDataURL);
    if (!jsonData)
    {
        console.error("Failed to load project data from: " + projectDataURL);
        return;
    }
    jsonData = resolveRelativeUrlsInJson(projectDataURL, jsonData);
    loadDataRefs(headerSection, jsonData, projectDataURL);

    const MediaScrollContainer = headerSection.querySelector('.scroll-container');
    const ContentContainer = MediaScrollContainer.querySelector('.scroll-container__content-container');
    const ScrollContainerBottomNavigation = headerSection.querySelector('.scroll-container__bottom-navigation-line');
    const VideoScroller = headerSection.querySelector('[data-scriptName="video-toggle"]');
    const Thumbnail = MediaScrollContainer.querySelector('img');
    const Video = MediaScrollContainer.querySelector('video');
    const FullscreenButton = MediaScrollContainer.querySelector('[data-scriptName="fullscreen-button"]');
    const PageLinkButtons = headerSection.querySelector('[data-scriptName="project-page-buttons"]');

    let webGLIFrame = null;

    function initializeThumbnailAndVideo() {
        if (Video) {
            Video.addEventListener('click', (event) => {
                Video.paused ? Video.play() : Video.pause();
            });
        }

        if (MediaScrollContainer && Video)
        {
            MediaScrollContainer.addEventListener('click', (event) => {
                if (event.target === VideoScroller)
                {
                    if (Video) {
                        Video.paused ? Video.play() : Video.pause();
                    }
                }
                else if (event.target.classList.contains('scroll-container__bot-nav-line-button'))
                {
                    if (Video) {
                        Video.pause();
                    }
                }
            })
        }

        if (Thumbnail && Video) {
            Thumbnail.style.cursor = "pointer";
            Thumbnail.addEventListener('mouseenter', () => {
                Thumbnail.style.transform = "scale(1.15)";
            })

            Thumbnail.addEventListener('mouseleave', () => {
                Thumbnail.style.transform = "scale(1)";
            })

            Video.style.display = "none";
            Thumbnail.addEventListener('click', () => {
                Video.play();
            })

            Video.addEventListener('play', () => {
                Thumbnail.style.display = "none";
                Video.style.display = "block";
            })

            Video.addEventListener('ended', () => {
                Thumbnail.style.display = "block";
                Video.style.display = "none";
            })
        }
    }
    initializeThumbnailAndVideo();

    function initializeFullscreen() {
        if (FullscreenButton) {
            FullscreenButton.addEventListener('click', () => {
                if (IsLightboxOpen()) {
                    MediaScrollContainer.classList.remove('--height-contained');
                    CloseLightbox();
                } else {
                    MediaScrollContainer.classList.add('--height-contained');
                    OpenLightbox(MediaScrollContainer);
                    SetLightboxStyle(fullscreenStyle);
                }
            })
        }
    }
    initializeFullscreen();

    async function initializeWebGLBuild() {
        if (!config.initialiseWebGLBuild) return;
        if (!jsonData.webGLConfig)
        {
            console.error("Failed to find WebGL config in project data");
            return;
        }

        let webGLContainer = document.createElement('div');
        webGLContainer.classList.add("project-header-section__WebGL-Build");
        webGLContainer.classList.add("scroll-container__item");
        ContentContainer.appendChild(webGLContainer);

        webGLIFrame = await embedWebGLIFrame(webGLContainer, config.webGLIFrameURL, jsonData.webGLConfig);

        let webGLScroller = document.createElement('div');
        webGLScroller.classList.add("scroll-container__bot-nav-line-button");
        webGLScroller.setAttribute("data-scroll", ".project-header-section__WebGL-Build");
        webGLScroller.innerText = "Try Yourself";
        ScrollContainerBottomNavigation.appendChild(webGLScroller);

        MediaScrollContainer.addEventListener('click', (event) => {
            if (event.target === webGLScroller)
            {
                if (webGLIFrame) {
                    startEmbeddedGame(webGLIFrame);
                }
            }
            else if (event.target.classList.contains('scroll-container__bot-nav-line-button'))
            {
                // If any other button is clicked, we could potentially stop the game or mute it,
                // but startEmbeddedGame doesn't seem to have a stop equivalent here.
            }
        });
    }
    await initializeWebGLBuild();

    function initializeDevVideo(){
        if (!config.initialiseDevVideo) return;
        if (!jsonData.devVideo)
        {
            console.error("Failed to find dev video in project data");
            return;
        }

        let devVideoContainer = document.createElement('div');
        devVideoContainer.classList.add("project-header-section__dev-video-container");
        devVideoContainer.classList.add("scroll-container__item");
        ContentContainer.appendChild(devVideoContainer);

        let devVideoScroller = document.createElement('div');
        devVideoScroller.classList.add("scroll-container__bot-nav-line-button");
        devVideoScroller.setAttribute("data-scroll", ".project-header-section__dev-video-container");
        devVideoScroller.innerText = "▶ Dev Journey";
        ScrollContainerBottomNavigation.appendChild(devVideoScroller);

        let devVideo = document.createElement('video');
        devVideo.classList.add("project-header-section__dev-video");
        devVideo.setAttribute("src", jsonData.devVideo.src);
        devVideo.controls = true;
        devVideoContainer.appendChild(devVideo);

        MediaScrollContainer.addEventListener('click', (event) => {
            if (event.target === devVideoScroller)
            {
                if (devVideo) {
                    devVideo.paused ? devVideo.play() : devVideo.pause();
                }
            }
            else if (event.target.classList.contains('scroll-container__bot-nav-line-button'))
            {
                if (devVideo) {
                    devVideo.pause();
                }
            }
        })
    }
    initializeDevVideo();

    function initializeWorkflowContainer() {
        if (config.hasWorkflowContainer) {
            if (config.workflowContainerId && document.getElementById(config.workflowContainerId)) {
                createSwitchableContentContainer(HTMLContentCache, config.workflowContainerId);
            } else {
                console.error("Failed to find workflow container with id: " + config.workflowContainerId);
            }
        }
    }
    initializeWorkflowContainer();

    function initializeProjectPageButtons(){
        if (!PageLinkButtons)
        {
            console.error("Failed to find project page buttons");
        }
        if (config.displayWebpageLink)
        {
            if (!jsonData["project-page"])
            {
                console.error("Failed to find project-page in project data");
                return;
            }
            PageLinkButtons.style.display = "flex";
            PageLinkButtons.innerHTML +=
                "<a class=\"project-header-section__link tag tag--link-arrow\" data-ref=\"link:project-page\"> behind the scenes </a>";
            loadDataRefs(PageLinkButtons, jsonData);
        }
        else
        {
            PageLinkButtons.style.display = "none";
        }
    }
    initializeProjectPageButtons();
}
