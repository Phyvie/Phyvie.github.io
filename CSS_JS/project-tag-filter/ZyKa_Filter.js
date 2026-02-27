import {findInRelatives} from "../../DOMFunctions.js";

document.addEventListener("click", onClick);

function onClick(event)
{
    if (!(event.target instanceof HTMLElement)) {return;}
    const clickedFilter = event.target.closest('[data-filter-tag]');
    if (!clickedFilter) {return; }
    let filterAttribute = clickedFilter.getAttribute('data-filter-tag');
    if (!filterAttribute) {return; }

    let filterContainer = findInRelatives(clickedFilter, '[data-filter-container]');
    if (!filterContainer) {
        console.error("clicked Filter, but no filterContainer was found");
        return;
    }

    let filterItems = filterContainer.querySelectorAll('[data-project-tags]');
    filterItems.forEach((item) => {
        try {
            const tags = JSON.parse(item.getAttribute('data-project-tags'));

            const tagRelevanceMap = new Map();

            for (let tag of tags) {
                const relevance = Number(tag.relevance) || 0;
                tagRelevanceMap.set(tag.name, relevance);
            }

            const hasTag = tagRelevanceMap.has(filterAttribute);
            if (hasTag)
            {
                item.classList.remove('--hidden');
                item.style.order = -tagRelevanceMap.get(filterAttribute);
            }
            else
            {
                item.classList.add('--hidden');
                item.style.order = 0;
            }
        }
        catch (error)
        {
            console.error("Failed to parse project tags: ", error);
            item.classList.add('--hidden');
            item.style.order = 0;
        }
    });
}
