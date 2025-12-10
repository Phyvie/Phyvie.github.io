function SetupProjectCards()
{
    const projectCards = document.querySelectorAll('.project-card');
    for (const card of projectCards) {SetupProjectCard(card); }
}

function SetupProjectCard(projectCard)
{
    const infoButton = projectCard.querySelector('.info-button-icon.overlay__top-right');
    const infoContainer = projectCard.querySelector('.overlay__right--A');

    infoButton.addEventListener('click', () => {
        infoContainer.classList.toggle('overlay__right--inactive');
    });
}

let projectCardTemplate;
function FindProjectCardTemplate(){
    projectCardTemplate = document.getElementById('project-card--template');
}

function CreateProjectCard(name) {
    let projectCard = projectCardTemplate.content.cloneNode(true);
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

document.addEventListener('DOMContentLoaded', () =>
    {
        FindProjectCardTemplate();
        CreateProjectCards();
        SetupProjectCards();
    });
