/**
 * Creates Project Cards and sets up their interactivity.
 * Uses load-data-refs.js to load data from .json files into the project cards.
 * Not an autonomous script, must be imported by another script to work (e.g. further-projects-section-load-cards.js)
 */
import {loadDataRefs} from "./load-data-refs.js";

let TEMPLATE_PROJECT_CARD;
export function FindProjectCardTemplate(){
    TEMPLATE_PROJECT_CARD = document.getElementById('template--project-card');
    if (!TEMPLATE_PROJECT_CARD) {
        console.error("FindProjectCardTemplate: template not found");
    }
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
