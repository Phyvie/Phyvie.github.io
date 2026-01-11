/**
 * Creates Project Cards and sets up their interactivity.
 * Uses load-data-refs.js to load data from .json files into the project cards.
 * Not an autonomous script, must be imported by another script to work (e.g. further-projects-section-load-cards.js)
 */
import {loadDataRefs} from "./load-data-refs.js";

let TEMPLATE_PROJECT_CARD;
export function FindProjectCardInHtml()
{
    if (TEMPLATE_PROJECT_CARD)
    {
        console.warn("FindProjectCardInHtml: template already set -> now overwriting");
    }

    TEMPLATE_PROJECT_CARD = document.getElementById('template--project-card');
    if (!TEMPLATE_PROJECT_CARD) {
        console.warn("FindProjectCardInHtml: template not found");
    }
}

export async function FindProjectCardTemplateInDocument(templateDocumentPath){
    if (templateDocumentPath === undefined)
    {
        console.error("FindProjectCardTemplateInDocument: templateDocumentPath is undefined");
        return null;
    }

    if (TEMPLATE_PROJECT_CARD)
    {
        console.warn("AddProjectTemplateToDocumentFromFilePath: template already set -> aborting");
        return TEMPLATE_PROJECT_CARD;
    }

    const response = await fetch(templateDocumentPath);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const templateHTML = await response.text();

    // Create a temporary div to parse the HTML, because templateHTML is a string not a DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateHTML;

    // Extract the template element
    const templateElement = tempDiv.querySelector('#template--project-card');
    if (!templateElement) {
        throw new Error("Template with id 'template--project-card' not found in external file");
    }

    return templateElement;
}

export function SetProjectCardTemplateAndAddToHTML(template)
{
    document.head.appendChild(template);
    TEMPLATE_PROJECT_CARD = template;
}

export function CreateProjectCard() {
    if (!TEMPLATE_PROJECT_CARD) {
        console.error("CreateProjectCard: template is not set");
    }
    return TEMPLATE_PROJECT_CARD.content.cloneNode(true);
}

/*
 * sets up the foldout of the overlay when the user clicks on the info button
 */
export function LoadProjectCardData(projectCard, jsonFile)
{
    if (!projectCard || !jsonFile) {
        console.error("LoadProjectCardData: missing required parameters");
        return;
    }
    
    if (!jsonFile["project-title"]) {
        console.warn("LoadProjectCardData: project data missing title");
    }
    
    console.log("loading data for project card: " + jsonFile["project-title"]);
    loadDataRefs(projectCard, jsonFile);
}

export function SetupProjectCardInteraction(projectCard)
{
    if (!projectCard) {
        console.error("SetupProjectCardInteraction: projectCard is null");
        return;
    }

    let thumbnail =projectCard.querySelector("[data-ref='image:thumbnail']")
    let trailer = projectCard.querySelector("[data-ref='video:trailer']");

    SetupInfoButtonOverlay(projectCard);
    wireImageToVideo(thumbnail, trailer);
    wireOverlayToVideo(trailer);
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

function wireImageToVideo(image, video) {
    if (!image || !video)
    {
        console.warn("wireImageToVideo: invalid arguments");
        return;
    }

    if (!video.src)
    {
        console.warn("wireImageToVideo: video source not set");
        return;
    }

    image.classList.add("media--hover-scale");
    image.style.display = "block";
    video.style.display = "none";
    video.controls = true;

    image.addEventListener("click", () => {
        image.style.display = "none";
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

    let overlayBottom = projectCard.querySelector('.overlay__bottom');
    if (!overlayBottom)
    {
        console.warn("wireOverlayToVideo: overlay__bottom element not found");
    }

    let overlayTitle = projectCard.querySelector('.overlay__project-title');
    if (!overlayTitle)
    {
        console.warn("wireOverlayToVideo: overlay__title element not found");
    }

    video.addEventListener("play", () => {
        overlayBottom?.classList.add('--inactive');
        overlayTitle?.classList.add('--inactive');
    });

    video.addEventListener("pause", () => {
        overlayBottom?.classList.remove('--inactive');
        overlayTitle?.classList.remove('--inactive')
    });
}
