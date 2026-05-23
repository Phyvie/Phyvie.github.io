import { findInRelatives } from "../../DOMFunctions.js";
import { hideTooltip } from "../tooltips/tooltip-manager.js";

function onClick(event) {
    if (!(event.target instanceof HTMLElement)) return;

    const trigger = event.target.closest('[data-filter-trigger]');
    if (!trigger) return;

    const filterValue = trigger.getAttribute('data-filter-trigger')?.toLowerCase();
    if (!filterValue) return;

    const groupElement = trigger.closest('[data-filter-trigger-group]');
    const groupName = groupElement ? groupElement.getAttribute('data-filter-trigger-group') : "default";
    const groupLogic = (groupElement ? groupElement.getAttribute('data-filter-trigger-group-combine-behaviour') : "OR")?.toUpperCase() || "OR";

    const { container, root } = findFilterContext(trigger);
    if (!container) {
        console.error("No container found for filter trigger.");
        return;
    }

    toggleActiveFilter(container, filterValue, groupName, groupLogic);

    const isActive = container.activeFilters.has(groupName) && container.activeFilters.get(groupName).has(filterValue);

    syncTriggerStyles(container, root);

    if (!isActive) {
        hideTooltip();
    }

    container.querySelectorAll('[data-filter-tags]').forEach(item => {
        const { matches, relevance } = elementMatchesFilters(item, container.activeFilters, container);
        applyFilterStyle(item, matches, relevance);
    });
}

function findFilterContext(trigger) {
    let container = findInRelatives(trigger, '[data-filter-container]');
    let root = container;

    if (!container) {
        const containerParent = findInRelatives(trigger, '[data-filter-container-parent]');
        if (containerParent) {
            container = containerParent.querySelector('[data-filter-container]');
            root = containerParent;
        }
    }

    return { container, root };
}

function switchTriggerFilterStyle(trigger, active)
{
    trigger.classList.toggle("--active", active);
}

function syncTriggerStyles(container, root = null) {
    const searchRoot = root || container;
    searchRoot.querySelectorAll('[data-filter-trigger]').forEach(t => {
        const tGroupElement = t.closest('[data-filter-trigger-group]');
        const tGroupName = tGroupElement ? tGroupElement.getAttribute('data-filter-trigger-group') : "default";
        const tValue = t.getAttribute('data-filter-trigger')?.toLowerCase();
        const tIsActive = container.activeFilters && container.activeFilters.has(tGroupName) && container.activeFilters.get(tGroupName).has(tValue);
        switchTriggerFilterStyle(t, !!tIsActive);
    });
}

function toggleActiveFilter(container, filterValue, groupName = "default", groupLogic = "OR") {
    if (!container.activeFilters) container.activeFilters = new Map();
    if (!container.filterGroupLogic) container.filterGroupLogic = new Map();
    
    container.filterGroupLogic.set(groupName, groupLogic);

    if (!container.activeFilters.has(groupName)) {
        container.activeFilters.set(groupName, new Set());
    }

    const groupSet = container.activeFilters.get(groupName);
    if (groupSet.has(filterValue)) {
        groupSet.delete(filterValue);
        if (groupSet.size === 0) {
            container.activeFilters.delete(groupName);
        }
    } else {
        if (groupLogic === "ONE") {
            groupSet.clear();
        }
        groupSet.add(filterValue);
    }
}

function elementMatchesFilters(item, activeFilters, container) {
    if (!item.filterTags || !(item.filterTags instanceof Map)) {
        parseFilterTags(item);
        if (!item.filterTags || !(item.filterTags instanceof Map))
        {
            return { matches: false, relevance: 0 };
        }
    }

    if (!activeFilters || activeFilters.size === 0)
    {
        return { matches: true, relevance: 0 };
    }

    let visible = true;
    let relevanceSum = 0;

    //Grouped Filtering; accross groups is always "OR" within groups is based on group setting
    activeFilters.forEach((groupSet, groupName) => {
        const logic = (container && container.filterGroupLogic) ? container.filterGroupLogic.get(groupName) : "OR";
        
        let groupMatch = false;
        if (logic === "AND") {
            groupMatch = true;
            groupSet.forEach(f => {
                if (!item.filterTags.has(f)) {
                    groupMatch = false;
                } else {
                    relevanceSum += Number(item.filterTags.get(f).relevance) || 0;
                }
            });
        } else {
            // OR or ONE logic
            groupSet.forEach(f => {
                const tagData = item.filterTags.get(f);
                if (tagData) {
                    groupMatch = true;
                    relevanceSum += Number(tagData.relevance) || 0;
                }
            });
        }

        if (!groupMatch) {
            visible = false;
        }
    });

    return { matches: visible, relevance: relevanceSum };
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
                if (typeof tag === "string") {
                    tagMap.set(tag.toLowerCase(), {
                        name: tag,
                        relevance: 0
                    });
                    return;
                }

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

export function makeElementFilterTrigger(element, triggerName, groupName = "")
{
    if (!(element instanceof HTMLElement)) {
        console.error("makeElementFilterTrigger: element must be HTMLElement");
        return;
    }
    if (!triggerName || typeof triggerName !== "string") {
        console.error("makeElementFilterTrigger: triggerName must be string");
        return;
    }
    if (groupName.length > 0 && (!groupName || typeof groupName !== "string")) {
        console.error("makeElementFilterTrigger: groupName must be string");
        return;
    }
    if (element.filterTags && element.filterTags instanceof Map) {
        console.error("makeElementFilterTrigger: element already has filterTags");
        return;
    }
    element.setAttribute('data-filter-trigger', triggerName);
    if (groupName.length > 0)
    {
        element.setAttribute('data-filter-trigger-group', groupName);
    }
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

function initialize(root = document)
{
    parseFilterTags(root);

    root.querySelectorAll('[data-filter-container]').forEach(container => {
        const containerParent = findInRelatives(container, '[data-filter-container-parent]');
        const syncRoot = containerParent || root;
        syncTriggerStyles(container, syncRoot);

        container.querySelectorAll('[data-filter-tags]').forEach(item => {
            const { matches, relevance } = elementMatchesFilters(item, container.activeFilters, container);
            applyFilterStyle(item, matches, relevance);
        });
    });
}

if (document.readyState === "loading")
{
    document.addEventListener("DOMContentLoaded", () => initialize(document))
}
else
{
    initialize(document);
}
