import {TryLoadJson} from "../common.blocks/load-data-refs.js";

import {
    AppendProjectCardToElement,
    LoadProjectCardData,
    SetupProjectCardInteraction,
} from "../project-card/project-card.js";
import {GetPathFromPortfolioRoot} from "../../PortfolioRootPath.js";
import {addFilterTagToElement, createFilterTag} from "../filter-tags/filter-tags.js";
import {fetchElementFromURL, makeURLsAbsolute, resolveRelativeUrlsInJson} from "../URL-Fetching-And-Templates/cross-html-engine.js";
import {OpenLightbox} from "../lightbox/lightbox.js";
import {loadExternalTemplate, createFragmentFromTemplate} from "../URL-Fetching-And-Templates/template-manager.js";
import {initializeProjectHeaderSection} from "../project-header-section/project-header-section.js";

const HEADER_SECTION_TEMPLATE_PATH = GetPathFromPortfolioRoot("_./CSS_JS/project-header-section/project-header-section.html");
const HEADER_SECTION_TEMPLATE_ID = "project-header-section-lightbox-template";
let HEADER_SECTION_TEMPLATE = null;

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
            const jsonDataRaw = await TryLoadJson(projectDataURL);
            if (jsonDataRaw === null) {
                continue;
            }
            const jsonData = await resolveRelativeUrlsInJson(projectDataURL, jsonDataRaw);

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
                projectCardUnfoldButton.addEventListener("click", async () => {
                    if (!HEADER_SECTION_TEMPLATE) {
                        HEADER_SECTION_TEMPLATE = await loadExternalTemplate(HEADER_SECTION_TEMPLATE_PATH, HEADER_SECTION_TEMPLATE_ID);
                    }
                    if (!HEADER_SECTION_TEMPLATE) {
                        console.error("Failed to load header section template");
                        return;
                    }

                    const fragment = createFragmentFromTemplate(HEADER_SECTION_TEMPLATE);
                    const headerSection = fragment.querySelector('.project-header-section');

                    const webglIframeURL = jsonData.WebGLBuildURL ? new URL(jsonData.WebGLBuildURL, projectDataURL).href : null;

                    // Ensure the link in the header section points to the correct project page
                    const discoverMoreLink = headerSection.querySelector('.flex-tags__tag.tag--link-arrow');
                    if (discoverMoreLink && jsonData["project-info-link"]) {
                        discoverMoreLink.href = jsonData["project-info-link"];
                    }

                    headerSection.classList.add('main__panel');
                    OpenLightbox(headerSection);

                    await initializeProjectHeaderSection(headerSection, projectDataURL, webglIframeURL);
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
