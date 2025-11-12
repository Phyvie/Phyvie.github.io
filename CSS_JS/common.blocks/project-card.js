function SetupProjectCards()
{
    const projectCards = document.querySelectorAll('.project-card');
    for (const card of projectCards) {SetupProjectCard(card); }
}

function SetupProjectCard(projectCard)
{
    const infoButton = projectCard.querySelector('.info-button-icon.overlay__top-right');
    const infoContainer = projectCard.querySelector('.overlay__right');

    infoButton.addEventListener('click', () => {
        infoContainer.classList.toggle('overlay__right--inactive');
    });
}

document.addEventListener('DOMContentLoaded', SetupProjectCards);
