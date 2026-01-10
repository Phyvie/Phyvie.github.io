/**
 * Creates Project Cards and sets up their interactivity.
 * Uses load-data-refs.js to load data from .json files into the project cards.
 * Not an autonomous script, must be imported by another script to work (e.g. further-projects-section-load-cards.js)
 */
import {loadDataRefs} from "./load-data-refs.js";

let TEMPLATE_PROJECT_CARD;
export function FindProjectCardTemplate(){
    TEMPLATE_PROJECT_CARD = document.getElementById('template--project-card');
}

export function CreateProjectCard() {
    return TEMPLATE_PROJECT_CARD.content.cloneNode(true);
}

/*
 * sets up the foldout of the overlay when the user clicks on the info button
 */
export function LoadProjectCardData(projectCard, jsonFile)
{
    console.log("loading data for project card: " + jsonFile["project-title"]);
    loadDataRefs(projectCard, jsonFile);
}

export function SetupProjectCardInteraction(projectCard)
{
    SetupInfoButtonOverlay(projectCard);
    wireImageToVideo(projectCard.querySelector("[data-ref='image:thumbnail']"), projectCard.querySelector("[data-ref='video:trailer']"));
}

function SetupInfoButtonOverlay(projectCard)
{
    const infoButton = projectCard.querySelector('.overlay__info-button.overlay__top-right');
    const infoContainer = projectCard.querySelector('.overlay__scroll-in');

    infoButton.addEventListener('click', () => {
        infoContainer.classList.toggle('overlay__scroll-in--inactive-right');
    });
}

function wireImageToVideo(img, vid) {
    if (!img || !vid)
    {
        console.warn("wireImageToVideo: invalid arguments");
        return;
    }

    if (!vid.src)
    {
        console.warn("wireImageToVideo: video source not set");
        return;
    }

    img.classList.add("media--hover-scale");
    img.style.display = "block";
    vid.style.display = "none";

    img.addEventListener("click", () => {
        img.style.display = "none";
        vid.style.display = "block";

        // Attempt to play; ignore errors from autoplay policies
        const p = vid.play();
        if (p && typeof p.catch === "function") {
            p.catch(() => {
            });
        }
    });

    // Optional: when the video ends, swap back to the image
    vid.addEventListener("ended", () => {
        img.style.display = "block";
        vid.style.display = "none";
    });
}

