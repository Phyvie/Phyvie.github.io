import {TryLoadJson} from "../common.blocks/load-data-refs.js";

const TEMPLATE_PROJECT_CARD_PATH = '../../Data/Projects/Project-Card-Template.html';

import {
    LoadProjectCardTemplate,
    CreateProjectCard,
    LoadProjectCardData,
    SetupProjectCardInteraction,
} from "../common.blocks/project-card.js";

async function CreateProjectCards() {
    let CardParent = document.getElementById('further-projects-section__cards-grid');
    if (!CardParent)
    {
        console.error("Failed to find further-projects-section__cards-grid element; aborting CreateProjectCards");
        return;
    }

    let projects = [
        {folder: 'Lone_Signal', 'grid-area': 'big2'},
        {folder: 'Music_Box', 'grid-area': 'big1'},
        {folder: 'Monster_Match', 'grid-area': 'small1'},
        {folder: 'Gragoon', 'grid-area': 'small2'},
        {folder: 'Dont_Brake', 'grid-area': 'small3'},
        {folder: 'Bevoiced', 'grid-area': 'small4'}
    ]

    for (let project of projects) {
        try {
            //create the project card & attach it
            let projectCardFragment = CreateProjectCard('further-projects-section__' + project.folder);
            let projectCard = projectCardFragment.querySelector('.project-card');
            CardParent.appendChild(projectCardFragment);
            projectCard.style.gridArea = project['grid-area'];

            //find the project.json file
            const jsonData = await TryLoadJson(`/Data/Projects/${project.folder}/project_data.json`);
            if (jsonData === null) {
                continue;
            }

            //load the data & make the card interactive
            LoadProjectCardData(projectCard, jsonData);
            SetupProjectCardInteraction(projectCard);
        } catch (error) {
            console.error(`Error loading project ${project.folder}:`, error);
        }
    }
}

async function initializeOnce()
{
    const projectCardTemplate = await LoadProjectCardTemplate(TEMPLATE_PROJECT_CARD_PATH);
    if (!projectCardTemplate)
    {
        console.error("Failed to load project card template");
        return;
    }
    await CreateProjectCards();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnce);
}
else
{
    initializeOnce();
}
