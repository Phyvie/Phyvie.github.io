import { findInRelatives } from "../../DOMFunctions.js";

function onClick(event) {
    if (!(event.target instanceof HTMLElement)) return;

    const trigger = event.target.closest('[data-filter-trigger]');
    if (!trigger) return;

    const filterValue = trigger.getAttribute('data-filter-trigger')?.toLowerCase();
    if (!filterValue) return;

    const container = findFilterContainer(trigger);
    if (!container) {
        console.error("No container found for filter trigger.");
        return;
    }

    toggleActiveFilter(container, filterValue);
    if (!container.filterMode)
    {
        container.filterMode = "OR";
    }
    switchTriggerFilterStyle(event.target, container.activeFilters.has(filterValue));

    container.querySelectorAll('[data-filter-tags]').forEach(item => {
        const { matches, relevance } = elementMatchesFilters(item, container.activeFilters, container.filterMode);
        applyFilterStyle(item, matches, relevance);
    });
}

function findFilterContainer(trigger) {
    let container = findInRelatives(trigger, '[data-filter-container]');
    if (!container) {
        const containerParent = findInRelatives(trigger, '[data-filter-container-parent]');
        container = containerParent?.querySelector('[data-filter-container]');
    }
    return container;
}

function switchTriggerFilterStyle(trigger, active)
{
    trigger.classList.toggle("--active", active);
}

function toggleActiveFilter(container, filterValue) {
    if (!container.activeFilters) container.activeFilters = new Set();
    if (container.activeFilters.has(filterValue)) container.activeFilters.delete(filterValue);
    else container.activeFilters.add(filterValue);
}

function elementMatchesFilters(item, activeFilters, filterMode) {
    if (!item.filterTags || !(item.filterTags instanceof Map)) {
        parseFilterTags(item);
        if (!item.filterTags || !(item.filterTags instanceof Map))
        {
            return { matches: false, relevance: 0 };
        }
    }

    if (activeFilters.size === 0)
    {
        return { matches: true, relevance: 0 };
    }

    let visible = filterMode !== "OR";
    let maxRelevance = 0;

    activeFilters.forEach(f => {
        const tagData = item.filterTags.get(f);
        const relevance = tagData ? Number(tagData.relevance) || 0 : 0;

        if (filterMode === "OR") {
            if (tagData) {
                visible = true;
                maxRelevance = Math.max(maxRelevance, relevance);
            }
        } else if (filterMode === "AND") {
            if (!tagData) visible = false;
            else maxRelevance = Math.max(maxRelevance, relevance);
        }
    });

    return { matches: visible, relevance: maxRelevance };
}

function applyFilterStyle(item, matches, relevance) {
    item.style.display = matches ? "" : "none";
    item.style.order = matches ? -relevance : 0;
}

export function parseFilterTags(rootElement)
{
    if (!(rootElement instanceof HTMLElement) && !(rootElement instanceof Document)) {
        console.error("parseFilterTags: rootElement must be HTMLElement");
        return;
    }

    const elements = rootElement.querySelectorAll('[data-filter-tags]');

    elements.forEach(element => {

        const raw = element.getAttribute('data-filter-tags');
        if (!raw || typeof raw !== "string") return;

        let parsed;

        try {
            parsed = JSON.parse(raw);
        }
        catch (error) {
            console.error("Invalid JSON in data-filter-tags:", raw, element);
            return;
        }

        if (!Array.isArray(parsed)) {
            console.error("data-filter-tags must be an array:", raw, element);
            return;
        }

        const tagMap = new Map();

        parsed.forEach((tag, index) => {
            try {
                if (typeof tag !== "object" || tag === null) {
                    console.error(`Invalid tag at index ${index}:`, tag, element);
                    return;
                }

                const { name, relevance, ...extra } = tag;

                if (!name) {
                    console.error("Tag missing name property:", tag, element);
                    return;
                }

                const safeRelevance = Number(relevance);
                const finalRelevance = isNaN(safeRelevance) ? 0 : safeRelevance;

                tagMap.set(name.toLowerCase(), {
                    name,
                    relevance: finalRelevance,
                    ...extra
                });

            } catch (err) {
                console.error("Failed processing tag:", tag, element, err);
            }
        });

        element.filterTags = tagMap;
        Object.freeze(element.filterTags);
    });
}

export function createFilterTag(name, relevance = 0, extra = {}) {
    if (!name || typeof name !== "string") {
        console.error("createFilterTag: 'name' must be a non-empty string");
        return null;
    }

    const numericRelevance = Number(relevance);
    const safeRelevance = isNaN(numericRelevance) ? 0 : numericRelevance;

    return {
        name,
        relevance: safeRelevance,
        ...extra
    };
}

export function addFilterTagToElement(element, tagData)
{
    if (!(element instanceof HTMLElement)) {
        console.error("addFilterTag: element must be HTMLElement");
        return;
    }

    if (!tagData || typeof tagData !== "object") {
        console.error("addFilterTag: tagData must be object");
        return;
    }

    const { name, relevance = 0, ...extra } = tagData;

    if (!name) {
        console.error("addFilterTag: tagData requires name");
        return;
    }

    // Ensure Map exists
    if (!element.filterTags || !(element.filterTags instanceof Map)) {
        element.filterTags = new Map();
    }

    const finalRelevance = Number(relevance);
    const safeRelevance = isNaN(finalRelevance) ? 0 : finalRelevance;

    element.filterTags.set(name.toLowerCase(), {
        name,
        relevance: safeRelevance,
        ...extra
    });

    syncAttributeFromMap(element);
}

export function removeFilterTagFromElement(element, tagName)
{
    if (!(element instanceof HTMLElement)) {
        console.error("removeFilterTag: element must be HTMLElement");
        return;
    }

    if (!tagName || typeof tagName !== "string") {
        console.error("removeFilterTag: tagName must be string");
        return;
    }

    if (!element.filterTags || !(element.filterTags instanceof Map)) {
        return;
    }

    element.filterTags.delete(tagName);

    syncAttributeFromMap(element);
}

function syncAttributeFromMap(element)
{
    if (!(element.filterTags instanceof Map)) return;

    const array = Array.from(element.filterTags.values());

    try {
        element.setAttribute('data-filter-tags', JSON.stringify(array));
    }
    catch (error) {
        console.error("Failed syncing data-filter-tags attribute:", error);
    }
}

document.addEventListener("click", onClick);

function initialize()
{
    parseFilterTags(document);
}

if (document.readyState === "loading")
{
    document.addEventListener("DOMContentLoaded", initialize)
}
else
{
    initialize();
}
