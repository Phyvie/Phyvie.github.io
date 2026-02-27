import {TryLoadJson} from "../common.blocks/load-data-refs.js";

import {
    AppendProjectCardToElement,
    LoadProjectCardData,
    SetupProjectCardInteraction,
} from "../project-card/project-card.js";
import {GetPathFromPortfolioRoot} from "../../PortfolioRootPath.js";

async function CreateProjectCards() {
    let CardParent = document.getElementById('further-projects-section__cards-grid');
    if (!CardParent)
    {
        console.error("Failed to find further-projects-section__cards-grid element; aborting CreateProjectCards");
        return;
    }

    let projects = [
        {folder: 'Lone_Signal'},
        {folder: 'Music_Box'},
        {folder: 'Monster_Match'},
        {folder: 'Gragoon'},
        {folder: 'Dont_Brake'},
        {folder: 'Bevoiced'}
    ]

    const ProjectFolderURL = GetPathFromPortfolioRoot("_./Projects/");
    for (let project of projects) {
        try {
            //create the project card & attach it
            let projectCard = AppendProjectCardToElement(CardParent);
            projectCard.id = project.folder;

            // projectCard.style.gridArea = project['grid-area'];

            //find the project.json file
            const projectDataURL = new URL(`${project.folder}/project_data.json`, ProjectFolderURL).href;
            const jsonData = await TryLoadJson(projectDataURL);
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
    await CreateProjectCards();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnce);
}
else
{
    initializeOnce();
}
