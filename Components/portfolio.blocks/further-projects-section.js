import {ToolsIconsRegistry, TryLoadJson, trySetIcon} from "../common.blocks/load-data-refs.js";

import {
    AppendProjectCardToElement,
    LoadProjectCardData,
    SetupProjectCardInteraction,
} from "../project-card/project-card.js";
import {addFilterTagToElement, createFilterTag, makeElementFilterTrigger} from "../filter-tags/filter-tags.js";
import {OpenLightbox} from "../lightbox/lightbox.js";
import {loadExternalTemplate, createFragmentFromTemplate} from "../URL-Fetching-And-Templates/template-manager.js";
import {initializeProjectHeaderSection} from "../project-header-section/project-header-section.js";

const HEADER_SECTION_TEMPLATE_PATH = new URL("../project-header-section/project-header-section.html", import.meta.url).href;
const HEADER_SECTION_TEMPLATE_ID__LIGHTBOX = "project-header-section-template";
let HEADER_SECTION_TEMPLATE = null;

async function CreateToolFilters() {
    const ToolFilterParent = document.querySelector('[data-scriptName="further-project-section-tools-container"]');
    if (!ToolFilterParent) {
        console.error("Failed to find further-project-section-tools-container element; aborting CreateToolFilters");
        return;
    }

    // Define categories with their own fragments to group elements before adding them to the DOM
    const categories = {
        proficient: { label: "proficient", fragment: document.createDocumentFragment() },
        functional: { label: "functional", fragment: document.createDocumentFragment() },
        fundamental: { label: "fundamentals", fragment: document.createDocumentFragment() }
    };

    // Single pass: Create elements and sort them into fragments
    ToolsIconsRegistry.forEach((value, key) => {
        const skillLevel = value.skillLevel.toLowerCase();
        let target = null;

        if (skillLevel.includes("proficient")) {
            target = categories.proficient;
        } else if (skillLevel.includes("functional")) {
            target = categories.functional;
        } else if (skillLevel.includes("fundamental")) { // matches "fundamental" and "fundamentals"
            target = categories.fundamental;
        }

        if (target) {
            const newToolFilter = document.createElement('div');
            newToolFilter.classList.add('further-projects-section__tools-filter-trigger');
            
            makeElementFilterTrigger(newToolFilter, key);
            trySetIcon(newToolFilter, key);
            newToolFilter.classList.add('tag--tool');

            // Appending to a fragment is faster and prevents layout reflows during the loop
            target.fragment.appendChild(newToolFilter);
        }
    });

    // Append headers and fragments to the DOM in the desired order
    Object.values(categories).forEach(cat => {
        if (cat.fragment.childElementCount === 0) return;

        const categoryWrapper = document.createElement('div');
        categoryWrapper.classList.add('further-projects-section__tools-expertise-container');

        const header = document.createElement('div');
        header.classList.add('further-projects-section__tools-expertise-header');
        header.innerHTML = cat.label;
        
        const toolsContainer = document.createElement('div');
        toolsContainer.classList.add('further-projects-section__tools-expertise');
        toolsContainer.appendChild(cat.fragment);

        categoryWrapper.appendChild(header);
        categoryWrapper.appendChild(toolsContainer);

        ToolFilterParent.appendChild(categoryWrapper);
    });
}

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
        {folder: 'Moebius_Magnus', classList: ['--highlight']},
        {folder: 'Monster_Match'},
        {folder: 'Gragoon'},
        {folder: 'Bevoiced'},
        {folder: 'Rotations', classList: ['--highlight']},
        // {folder: 'Solitaire'},
        // {folder: 'Dont_Brake'},
    ]

    const ProjectFolderURL = new URL("../../../Projects/", import.meta.url).href;

    for (let project of projects) {
        try {
            //create the project card & attach it
            let projectCard = AppendProjectCardToElement(CardParent);
            projectCard.id = project.folder;
            projectCard.classList.add('further-projects-section__project-card');

            // Set data-filter-tags to ensure it is counted by filter-tags.js
            // Even if LoadProjectCardData hasn't finished, we need it to have the attribute for measurement if we use querySelectorAll('[data-filter-tags]')
            projectCard.setAttribute('data-filter-tags', '[]'); 

            //find the project.json file
            const projectDataURL = new URL(`${project.folder}/project_data.json`, ProjectFolderURL).href;
            const jsonData = await TryLoadJson(projectDataURL);
            if (jsonData === null) {
                continue;
            }

            //load the data & make the card interactive
            LoadProjectCardData(projectCard, jsonData, projectDataURL);
            SetupProjectCardInteraction(projectCard);

            (function addSkillsFilterTags(jsonData, project, projectCard) {
                const filterTags = jsonData.tags;
                if (!filterTags) {
                    console.error(`No tags found in project ${project.folder}`);
                    return;
                }
                for (const project_tag of filterTags) {
                    let newTag = createFilterTag(project_tag.name, project_tag.relevance);
                    if (!newTag) {
                        console.error(`Failed to create filter tag ${project_tag} for project ${project.folder}`);
                        continue;
                    }
                    addFilterTagToElement(projectCard, newTag);
                }
            })(jsonData, project, projectCard);

            (function addToolFilterTags(jsonData, project, projectCard) {
                const toolTags = jsonData.tools;
                if (!toolTags) {
                    console.error("No tools found in project ", project.folder);
                    // return;
                }
                for (const tool_tag of toolTags) {
                    let toolTag = createFilterTag(tool_tag, 0);
                    if (!toolTag) {
                        console.error(`Failed to create filter tag ${tool_tag} for project ${project.folder}`);
                        continue;
                    }
                    addFilterTagToElement(projectCard, toolTag);
                }
            })(jsonData, project, projectCard);

            const projectCardUnfoldButton = projectCard.querySelector('[data-more-info-button]');
            if (projectCardUnfoldButton)
            {
                projectCardUnfoldButton.addEventListener("click", async () => {
                    if (!HEADER_SECTION_TEMPLATE) {
                        HEADER_SECTION_TEMPLATE = await loadExternalTemplate(HEADER_SECTION_TEMPLATE_PATH, HEADER_SECTION_TEMPLATE_ID__LIGHTBOX);
                    }
                    if (!HEADER_SECTION_TEMPLATE) {
                        console.error("Failed to load header section template");
                        return;
                    }

                    const fragment = createFragmentFromTemplate(HEADER_SECTION_TEMPLATE);
                    const headerSection = fragment.querySelector('.project-header-section');

                    const webglIframeURL = jsonData.WebGLBuildURL ? new URL(jsonData.WebGLBuildURL, projectDataURL).href : null;

                    // Ensure the link in the header section points to the correct project page
                    const discoverMoreLink = headerSection.querySelector('.tag--link-arrow');
                    if (discoverMoreLink && jsonData["project-info-link"]) {
                        discoverMoreLink.href = jsonData["project-info-link"];
                    }

                    headerSection.classList.add('main__panel');
                    OpenLightbox(headerSection);

                    await initializeProjectHeaderSection(headerSection, projectDataURL, {"displayWebpageLink": jsonData["project-page"]});
                })
            }

            if (project.classList) {
                projectCard.classList.add(...project.classList);
            }
        } catch (error) {
            console.error(`Error loading project ${project.folder}:`, error);
        }
    }

    /* this storage assumes that the first child is a visible card */
    const firstChild = CardParent.children[0];
    if (!firstChild) return;

    let singleCardHeight = firstChild.offsetHeight;
    let singleCardWidth = firstChild.offsetWidth;
    updateCardContainerMinHeight();

    addEventListener('resize', updateCardContainerMinHeight);

    function updateCardContainerMinHeight()
    {
        const computedStyle = window.getComputedStyle(CardParent);
        const gap = parseFloat(computedStyle.gap) || 0;
        
        let cardsPerRow = Math.floor((CardParent.offsetWidth + gap) / (singleCardWidth + gap));
        if (cardsPerRow <= 0) cardsPerRow = 1;

        let cardRows = Math.ceil(CardParent.childElementCount / cardsPerRow);
        let fullHeight = cardRows * singleCardHeight + (cardRows - 1) * gap;

        CardParent.style.minHeight = Math.min(fullHeight, window.innerHeight) + 'px';
    }
}

async function initializeOnce()
{
    await CreateProjectCards();
    await CreateToolFilters();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnce);
}
else
{
    initializeOnce();
}
