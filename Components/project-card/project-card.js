/**
 * Creates Project Cards and sets up their interactivity.
 * Uses load-data-refs.js to load data from .json files into the project cards.
 * Not an autonomous script, must be imported by another script to work (e.g. further-projects-section.js)
 */

import {loadDataRefs} from "../load-data-refs.js";
import {
    loadExternalTemplate,
    addTemplateToDocument,
    createFragmentFromTemplate,
    appendTemplateCopyToElement
} from "../URL-Fetching-And-Templates/template-manager.js";

const PROJECT_CARD_TEMPLATE_PATH = new URL("./Project-Card-Template.html", import.meta.url).href;
const PROJECT_CARD_TEMPLATE_ID = "template--project-card";
let TEMPLATE_PROJECT_CARD;

export async function LoadProjectCardTemplate(templatePath, templateId)
{
    if (TEMPLATE_PROJECT_CARD)
    {
        console.warn("loadProjectCardTemplate: template already loaded; aborting second load");
        return TEMPLATE_PROJECT_CARD;
    }

    TEMPLATE_PROJECT_CARD = await loadExternalTemplate(templatePath, templateId);

    if (!TEMPLATE_PROJECT_CARD)
    {
        console.error("loadProjectCardTemplate: failed to load template");
        return;
    }

    addTemplateToDocument(TEMPLATE_PROJECT_CARD);
    return TEMPLATE_PROJECT_CARD;
}

export function CreateProjectCardFragment() {y
    if (!TEMPLATE_PROJECT_CARD) {
        console.error("CreateProjectCard: template is not set");
        return null;
    }
    return createFragmentFromTemplate(TEMPLATE_PROJECT_CARD);
}

export function AppendProjectCardToElement(element)
{
    return appendTemplateCopyToElement(element, TEMPLATE_PROJECT_CARD);
}

export function LoadProjectCardData(projectCard, jsonFile, baseUrl = null)
{
    if (!projectCard || !jsonFile) {
        console.error("LoadProjectCardData: missing required parameters");
        return;
    }
    
    if (!jsonFile["project-title"]) {
        console.warn("LoadProjectCardData: project data missing title");
    }
    
    loadDataRefs(projectCard, jsonFile, baseUrl);
}

export function SetupProjectCardInteraction(projectCard)
{
    if (!projectCard) {
        console.error("SetupProjectCardInteraction: projectCard is null");
        return;
    }

    let thumbnail =projectCard.querySelector("[data-scriptName='project-card__thumbnail']")
    let trailer = projectCard.querySelector("[data-scriptName='project-card__video']");
    let playButton = projectCard.querySelector("[data-scriptName='project-card__play-button']");

    wireImageToVideo(thumbnail, trailer, playButton);
    wireOverlayToVideo(trailer);

    // SetupInfoButtonOverlay(projectCard); //alt layout where the description is shown when the user clicks on the info-button in the top-left
    // SetupFoldable(projectCard); //alt layout with Foldable
}

function SetupInfoButtonOverlay(projectCard)
{
    const infoButton = projectCard.querySelector('.overlay__info-button');
    const infoContainer = projectCard.querySelector('.overlay__scroll-in--right');

    if (!infoButton || !infoContainer)
    {
        console.warn("SetupInfoButtonOverlay: missing required elements");
        return;
    }

    infoButton.addEventListener('click', () => {
        infoContainer.classList.toggle('--inactive');
    });
}

function wireImageToVideo(image, video, playButton = null) {
    if (!image || !video || !playButton)
    {
        console.warn("wireImageToVideo: invalid arguments");
        return;
    }

    if (!video.src)
    {
        console.warn("wireImageToVideo: video source not set");
        return;
    }

    image.classList.add("project-card__thumbnail--interactive");
    image.style.display = "block";
    playButton.style.display = "block";
    video.style.display = "none";
    video.controls = true;

    image.addEventListener("click", () => {
        image.style.display = "none";
        playButton.style.display = "none";
        video.style.display = "block";

        // Attempt to play; ignore errors from autoplay policies
        const p = video.play();
        if (p && typeof p.catch === "function") {
            p.catch(() => {
            });
        }
    });

    // Optional: when the video ends, swap back to the image
    video.addEventListener("ended", () => {
        image.style.display = "block";
        playButton.style.display = "block";
        video.style.display = "none";
    });
}

function wireOverlayToVideo(video)
{
    if (!video)
    {
        console.warn("wireOverlayToVideo: no video element provided");
        return;
    }

    let projectCard = video.closest('.project-card');
    if (!projectCard)
    {
        console.warn("wireOverlayToVideo: project card not found");
        return;
    }

    let overlayedElements = [];

    let overlayTitle = projectCard.querySelector('.overlay__project-title');
    if (!overlayTitle)
    {
        console.warn("wireOverlayToVideo: overlay__title element not found");
    }
    overlayedElements.push(overlayTitle);

    let overlayMainRole = projectCard.querySelector('.overlay__main-role');
    if (!overlayMainRole)
    {
        console.warn("wireOverlayToVideo: overlay__main-role element not found");
    }
    overlayedElements.push(overlayMainRole);

    video.addEventListener("mouseenter", () => {
        overlayMainRole?.classList.add("--video-controls-active");
    })
    video.addEventListener("mouseleave", () => {
        overlayMainRole?.classList.remove("--video-controls-active");
    })

    video.addEventListener("play", () => {
        for (let el of overlayedElements)
        {
            el.classList.add('--inactive');
        }
    });

    video.addEventListener("pause", () => {
        for (let el of overlayedElements)
        {
            el.classList.remove('--inactive');
        }
    });
}

async function initialize()
{
    await LoadProjectCardTemplate(PROJECT_CARD_TEMPLATE_PATH, PROJECT_CARD_TEMPLATE_ID);
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initialize);
}
else
{
    await initialize();
}
