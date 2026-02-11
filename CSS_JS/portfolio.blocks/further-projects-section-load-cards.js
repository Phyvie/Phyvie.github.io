import {TryLoadJson} from "../common.blocks/load-data-refs.js";

const TEMPLATE_PROJECT_CARD_PATH = './CSS_JS/project-card/Project-Card-Template.html';

import {
    LoadProjectCardTemplate,
    AppendProjectCardToElement,
    LoadProjectCardData,
    SetupProjectCardInteraction,
} from "../project-card/project-card.js";

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
            let projectCard = AppendProjectCardToElement(CardParent);
            projectCard.style.gridArea = project['grid-area'];

            //find the project.json file
            const jsonData = await TryLoadJson(`/Projects/${project.folder}/project_data.json`);
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
    await LoadProjectCardTemplate(TEMPLATE_PROJECT_CARD_PATH, 'template--project-card');
    await CreateProjectCards();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnce);
}
else
{
    initializeOnce();
}
