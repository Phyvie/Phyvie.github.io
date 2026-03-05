import {TryLoadJson} from "../common.blocks/load-data-refs.js";

import {
    AppendProjectCardToElement,
    LoadProjectCardData,
    SetupProjectCardInteraction,
} from "../project-card/project-card.js";
import {GetPathFromPortfolioRoot} from "../../PortfolioRootPath.js";
import {addFilterTagToElement, createFilterTag} from "../filter-tags/filter-tags.js";

async function CreateProjectCards() {
    let CardParent = document.getElementById('further-projects-section__cards-container');
    if (!CardParent)
    {
        console.error("Failed to find further-projects-section__cards-grid element; aborting CreateProjectCards");
        return;
    }

    let projects = [
        {folder: 'Lone_Signal'},
        {folder: 'Music_Box'},
        {folder: 'Moebius_Magnus'},
        {folder: 'Monster_Match'},
        {folder: 'Gragoon'},
        {folder: 'Bevoiced'},
        {folder: 'Rotations'},
        // {folder: 'Solitaire'},
        // {folder: 'Dont_Brake'},
    ]

    const ProjectFolderURL = GetPathFromPortfolioRoot("_./Projects/");
    for (let project of projects) {
        try {
            //create the project card & attach it
            let projectCard = AppendProjectCardToElement(CardParent);
            projectCard.id = project.folder;
            projectCard.classList.add('further-projects-section__project-item--flex');

            //find the project.json file
            const projectDataURL = new URL(`${project.folder}/project_data.json`, ProjectFolderURL).href;
            const jsonData = await TryLoadJson(projectDataURL);
            if (jsonData === null) {
                continue;
            }

            //load the data & make the card interactive
            LoadProjectCardData(projectCard, jsonData);
            SetupProjectCardInteraction(projectCard);

            const filterTags = jsonData.tags;
            if (!filterTags) {
                console.warn(`No tags found in project ${project.folder}`);
                continue;
            }
            for (const project_tag of filterTags)
            {
                let newTag = createFilterTag(project_tag.name, project_tag.relevance);
                if (!newTag)
                {
                    console.error(`Failed to create filter tag ${project_tag} for project ${project.folder}`);
                    continue;
                }
                addFilterTagToElement(projectCard, newTag);
            }

            const projectCardUnfoldButton = projectCard.querySelector('[data-more-info-button]');
            if (projectCardUnfoldButton)
            {
                projectCardUnfoldButton.addEventListener("click", () => {
                    if (projectCard.style.gridRow === "span 2")
                    {
                        projectCard.style.gridRow = "span 1";
                    }
                    else
                    {
                        projectCard.style.gridRow = "span 2";
                    }
                })
            }
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
