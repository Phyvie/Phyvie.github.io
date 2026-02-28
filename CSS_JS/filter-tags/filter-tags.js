import { findInRelatives } from "../../DOMFunctions.js";

function onClick(event)
{
    if (!(event.target instanceof HTMLElement)) return;

    const trigger = event.target.closest('[data-filter-trigger]');
    if (!trigger) return;

    const filterValue = trigger.getAttribute('data-filter-trigger')?.toLowerCase();
    if (!filterValue) return;

    const container = findInRelatives(trigger, '[data-filter-container]');
    if (!container) {
        console.error("Filter trigger clicked but no [data-filter-container] found.");
        return;
    }

    const items = container.querySelectorAll('[data-filter-tags]');

    items.forEach(item => {

        if (!(item instanceof HTMLElement)) return;

        if (!item.filterTags || !(item.filterTags instanceof Map)) {
            console.warn("Item has unparsed filterTags. Attempting to parse:", item);
            // If not parsed yet → try parsing once before printing error
            parseFilterTags(item); // Pass the element itself as root
            if (!item.filterTags || !(item.filterTags instanceof Map)) {
                console.error("Parsing failed for element:", item);
                item.style.display = "none";
                item.style.order = 0;
                return;
            }
        }

        const tagData = item.filterTags.get(filterValue.toLowerCase());

        if (tagData)
        {
            const relevance = Number(tagData.relevance) || 0;

            item.style.display = "";
            item.style.order = -relevance;
        }
        else
        {
            item.style.display = "none";
            item.style.order = 0;
        }
    });
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
