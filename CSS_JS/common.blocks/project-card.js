/**
 * responsible for creating the project cards in the further-projects-section and filling them with data from the corresponding .json files
 * 0ZyKa currently double responsibility; 1. general abstract implementation of creating project cards and 2. loading the data from the database to arrange the layout of the grid
 */

let TEMPLATE_PROJECT_CARD;
export function FindProjectCardTemplate(){
    TEMPLATE_PROJECT_CARD = document.getElementById('template--project-card');
}

export function SetupProjectCardsInteraction()
{
    const projectCards = document.querySelectorAll('.project-card');
    for (const card of projectCards) {SetupProjectCardInteraction(card); }
}

export function CreateProjectCard() {
    return TEMPLATE_PROJECT_CARD.content.cloneNode(true);
}

/*
 * sets up the foldout of the overlay when the user clicks on the info button
 */
function SetupProjectCardInteraction(projectCard)
{
    const infoButton = projectCard.querySelector('.info-button-icon.overlay__top-right');
    const infoContainer = projectCard.querySelector('.overlay__right--A');

    infoButton.addEventListener('click', () => {
        infoContainer.classList.toggle('overlay__right--inactive');
    });
}

export function LoadProjectCardData(projectCard, jsonFile)
{
    console.log("loading data for project card: " + projectCard.id + " from " + jsonFile + "; project-name: " + jsonFile["project-title"]);
}
