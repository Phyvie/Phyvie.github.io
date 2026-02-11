import {GetDOMElForInputType} from "../../DOMFunctions.js";

function scrollMediaStripByIndices(gallery, indices) {
    const galleryDOMEl = GetDOMElForInputType(gallery);
    let currentChild = Array.from(galleryDOMEl.children).find(child => child.offsetLeft >= galleryDOMEl.scrollLeft);
    let currentChildIndex =
        currentChild ?
            Array.from(galleryDOMEl.children).indexOf(currentChild) :
            galleryDOMEl.children.length - 1;
    let scrollChildIndex = currentChildIndex + indices;
    scrollChildIndex = Math.min(Math.max(0, scrollChildIndex), galleryDOMEl.children.length-1);
    galleryDOMEl.scrollLeft = galleryDOMEl.children[scrollChildIndex].offsetLeft;
}

function scrollMediaStripToIndex(gallery, index) {
    const galleryDOMEl = GetDOMElForInputType(gallery);
    index = Math.min(Math.max(0, index), galleryDOMEl.children.length-1);
    galleryDOMEl.scrollLeft = galleryDOMEl.children[index].offsetLeft;
    console.log("scrolling to index: " + index);
}

function scrollMediaStripByWidth(gallery, scrollWidth) {
    gallery.scrollBy({
            left: scrollWidth,
            behavior: 'smooth'
        }
    )
}

function scrollMediaStripToPosition(gallery, position) {
    gallery.scrollLeft = position;
}

export function initializeScrollContainersInDocument()
{
    initializeScrollContainer(document);
}

export function initializeScrollContainer(rootElement)
{
    if (!rootElement || !(rootElement instanceof HTMLElement || rootElement instanceof Document)) {
        throw new Error("Invalid root element: must be a HTMLElement.");
    }

    console.log("setting up scroll container for root element: " + rootElement.id);

    const navButtons = rootElement.querySelectorAll('[data-mediastrip]');

    navButtons.forEach
    (
        navItem =>
        {
            NavItem_SetupClick(navItem);
        }
    );
}

function NavItem_SetupClick(navItem) {
    const mediaStripDomEl = document.getElementById(navItem.dataset.mediastrip);
    if (!mediaStripDomEl) {
        throw new Error(`Media strip element with id "${navItem.dataset.mediastrip}" not found.`);
    }

    const hasScrollItemName = navItem.dataset.scrollitemname !== undefined;
    const hasScrollIndex = navItem.dataset.scrollindex !== undefined;
    const hasScrollDirection = navItem.dataset.scrolldirection !== undefined;

    const instructionCount = [hasScrollItemName, hasScrollIndex, hasScrollDirection].filter(Boolean).length;
    if (instructionCount > 1) {
        throw new Error("Conflicting scroll instructions for navItem: " + navItem.outerHTML +
            "\nOnly one of scrollitemname, scrollindex, or scrolldirection should be defined.");
    }

    let scrollFunction;

    if (hasScrollItemName) {
        const targetEl = document.getElementById(navItem.dataset.scrollitemname);
        if (!targetEl) {
            throw new Error(`Element with id "${navItem.dataset.scrollitemname}" not found for scrollitemname.`);
        }

        // Get the index of the targetEl among the children of mediaStripDomEl
        const children = Array.from(mediaStripDomEl.children);
        const scrollIndex = children.indexOf(targetEl);

        if (scrollIndex === -1) {
            throw new Error(`Element with id "${navItem.dataset.scrollitemname}" is not a child of the media strip.`);
        }

        scrollFunction = () => scrollMediaStripToIndex(mediaStripDomEl, scrollIndex);
    }

    else if (hasScrollIndex) {
        const scrollIndex = parseInt(navItem.dataset.scrollindex, 10);

        if (isNaN(scrollIndex)) {
            throw new Error("Invalid scrollindex for navItem: must be a number.");
        }

        scrollFunction = () => scrollMediaStripToIndex(mediaStripDomEl, scrollIndex);
    }

    else if (hasScrollDirection) {
        const direction = parseInt(navItem.dataset.scrolldirection, 10);

        if (isNaN(direction)) {
            throw new Error("Invalid scrolldirection for navItem: must be a number.");
        }

        scrollFunction = () => scrollMediaStripByIndices(mediaStripDomEl, direction);
    }

    if (scrollFunction) {
        navItem.addEventListener('click', scrollFunction);
    } else {
        throw new Error("No scroll instruction provided for navItem: must define one of scrollitemname, scrollindex, or scrolldirection.");
    }
}
