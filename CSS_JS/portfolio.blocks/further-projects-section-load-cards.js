import {
    FindProjectCardTemplate,
    CreateProjectCard,
    SetupProjectCardsInteraction,
    LoadProjectCardData
} from "../common.blocks/project-card.js";

async function CreateProjectCards() {
    let CardParent = document.getElementById('further-projects-section__cards-grid');

    let projects = [
        {folder: 'Lone_Signal', 'grid-area': 'big1'},
        {folder: 'Music_Box', 'grid-area': 'big2'},
        {folder: 'Play_My_Math', 'grid-area': 'small1'},
        {folder: 'ADHD_Podcast', 'grid-area': 'small2'},
        {folder: 'Dont_Brake', 'grid-area': 'small3'},
        {folder: 'Bevoiced', 'grid-area': 'small4'}
    ]

    for (let project of projects) {
        try {
            //create the project card from the template
            let projectCardFragment = CreateProjectCard('further-projects-section__' + project.folder);
            let projectCard = projectCardFragment.querySelector('.project-card');

            CardParent.appendChild(projectCardFragment);
            projectCard.style.gridArea = project['grid-area'];

            //find the project.json file
            const response = await fetch(`Data/Projects/${project.folder}/project_data.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();

            LoadProjectCardData(projectCard, jsonData);
        } catch (error) {
            console.error(`Error loading project ${project.folder}:`, error);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    FindProjectCardTemplate();
    await CreateProjectCards();
    SetupProjectCardsInteraction();
});