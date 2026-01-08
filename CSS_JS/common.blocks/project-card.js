/**
 * responsible for creating the project cards in the further-projects-section and filling them with data from the corresponding .json files
 */

let CONFIG_FURTHER_PROJECTS;
async function loadProjectConfig()
{
    const response = await fetch('./././Data/Projects/further-projects-database.json');
    CONFIG_FURTHER_PROJECTS = await response.json();

    setCSSCustomProperties();
}

function setCSSCustomProperties()
{

}


let TEMPLATE_PROJECT_CARD;
function FindProjectCardTemplate(){
    TEMPLATE_PROJECT_CARD = document.getElementById('template--project-card');
}

function SetupProjectCards()
{
    const projectCards = document.querySelectorAll('.project-card');
    for (const card of projectCards) {SetupProjectCard(card); }
}

function CreateProjectCard(name) {
    let projectCard = TEMPLATE_PROJECT_CARD.content.cloneNode(true);
    projectCard.querySelector('.project-card').classList.add(name);
    return projectCard;
}

//+ZyKa should figure out a more modular structure for this & probably put the project-card-template into another html file
function CreateProjectCards()
{
    let CardParent = document.getElementById('further-projects-section__cards-grid');

    let projects = ['first-proj', 'second-proj', 'third-proj', 'fourth-proj', 'fifth-proj', 'sixth-proj']

    for(name of projects)
    {
        let project = CreateProjectCard('further-projects-section__' + name);
        CardParent.appendChild(project);
    }
}

/*
 * sets up the foldout of the overlay when the user clicks on the info button
 */
function SetupProjectCard(projectCard)
{
    const infoButton = projectCard.querySelector('.info-button-icon.overlay__top-right');
    const infoContainer = projectCard.querySelector('.overlay__right--A');

    infoButton.addEventListener('click', () => {
        infoContainer.classList.toggle('overlay__right--inactive');
    });
}

document.addEventListener('DOMContentLoaded', () =>
    {
        FindProjectCardTemplate();
        CreateProjectCards();
        SetupProjectCards();
    });
