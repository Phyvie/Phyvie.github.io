import {findAllInRelatives, ReturnElementOrGetById, getElementIdentifier} from "../../DOMFunctions.js";

export {
    scrollContainerByIndices,
    scrollContainerToIndex,
    scrollContainerByWidth,
    scrollContainerToPosition,
    scrollContainerToElement,
    scrollContainerToPercentage
};

/* region scroll-functions */
function scrollContainerByIndices(container, indices) {
    const containerEl = ReturnElementOrGetById(container);
    if (!containerEl) {
        console.warn('Invalid scroll container provided to scrollContainerByIndices');
        return;
    }

    const children = Array.from(containerEl.children);
    if (children.length === 0) {
        console.warn('Scroll container has no children');
        return;
    }

    let currentChild = children.find(child => child.offsetLeft >= containerEl.scrollLeft);
    let currentChildIndex = currentChild ?
        children.indexOf(currentChild) :
        children.length - 1;

    let scrollChildIndex = currentChildIndex + indices;
    scrollChildIndex = Math.min(Math.max(0, scrollChildIndex), children.length - 1);

    containerEl.scrollLeft = children[scrollChildIndex].offsetLeft;
}

function scrollContainerToIndex(container, index) {
    const containerEl = ReturnElementOrGetById(container);
    if (!containerEl) {
        console.warn('Invalid scroll container provided to scrollContainerToIndex');
        return;
    }

    const children = Array.from(containerEl.children);
    if (children.length === 0) {
        console.warn('Scroll container has no children');
        return;
    }

    index = Math.min(Math.max(0, index), children.length - 1);
    containerEl.scrollLeft = children[index].offsetLeft;
}

function scrollContainerByWidth(container, scrollWidth) {
    const containerEl = ReturnElementOrGetById(container);
    if (!containerEl) {
        console.warn('Invalid scroll container provided to scrollContainerByWidth');
        return;
    }

    containerEl.scrollBy({
        left: scrollWidth,
        behavior: 'smooth'
    });
}

function scrollContainerToPercentage(container, percent) {
    const containerEl = ReturnElementOrGetById(container);
    if (!containerEl) {
        console.warn('Invalid scroll container provided to scrollContainerToPercentage');
        return;
    }

    const maxScroll = containerEl.scrollWidth - containerEl.clientWidth;
    const scrollPosition = (maxScroll * percent) / 100;

    containerEl.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
}

function scrollContainerToPosition(container, position) {
    const containerEl = ReturnElementOrGetById(container);
    if (!containerEl) {
        console.warn('Invalid scroll container provided to scrollContainerToPosition');
        return;
    }

    containerEl.scrollLeft = position;
}

function scrollContainerToElement(container, elementId) {
    const containerEl = ReturnElementOrGetById(container);
    if (!containerEl) {
        console.warn('Invalid scroll container provided to scrollContainerToElement');
        return;
    }

    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
        console.warn(`Element with id "${elementId}" not found.`);
        return;
    }

    const children = Array.from(containerEl.children);
    const scrollIndex = children.indexOf(targetEl);

    if (scrollIndex === -1) {
        console.warn(`Element with id "${elementId}" is not a child of the scroll container.`);
        return;
    }

    scrollContainerToIndex(containerEl, scrollIndex);
}
/* endregion scroll-functions */

/* region [data-scroll]-management */
// Parse the entire data-scroll attribute by splitting it and calling the individual parsers for scroll-container and scroll-command; afterward call the executeScrollCommand function
function handleScrollCommand(button) {
    if (!button || !(button instanceof HTMLElement)) {
        console.warn('Invalid button element');
        return;
    }

    const scrollData = button.dataset.scroll;

    if (!scrollData) {
        console.warn(`handleScrollCommand(Button) "${getElementIdentifier(button)}" has no data-scroll attribute`);
        return;
    }

    const parts = scrollData.split(':');

    if (parts.length > 2 || parts.length < 1) {
        console.warn(`Invalid data-scroll format: "${scrollData}"`);
        return;
    }

    const containerString = parts.length >= 2 ? parts[0] : null;
    const commandString = parts.length >= 2 ? parts[1] : parts[0];

    const container = getScrollContainer(button, containerString);
    if (!container) {
        console.warn(`Could not parse data-scroll: "${scrollData}" on button "${getElementIdentifier(button)}, because container is invalid ${containerString}`);
        return;
    }

    const command = parseScrollCommand(commandString);
    if (!command) {
        console.warn(`Could not parse data-scroll: "${scrollData}" on button "${getElementIdentifier(button)}, because commandString is invalid ${commandString}`);
        return;
    }

    // Execute the command
    executeScrollCommand(container, command);
    sendScrollCommandEvent(button, container, command);
}

function getScrollContainer(button, containerSelector) {
    if (!button || !(button instanceof HTMLElement)) {
        console.warn(`Invalid button element ${getElementIdentifier(button)}`);
        return null;
    }

    let wasEmptySelector = false;

    // Normalize an empty selector to the default class
    if (!containerSelector || containerSelector.trim() === '') {
        containerSelector = '.scroll-container__content-container';
        wasEmptySelector = true;
    }

    const firstChar = containerSelector[0];

    // CASE: CSS selector (.class, [attribute], etc) - needs DOM traversal
    if (firstChar === '.' || firstChar === '[') {
        const selectorType = firstChar === '.' ? 'class' : 'attribute selector';

        // Step 1: Search among relatives
        const relativesContainers = findAllInRelatives(button, containerSelector, { includeCousins: false });

        if (relativesContainers.length > 0) {
            if (relativesContainers.length > 1) {
                console.warn(`Multiple scroll containers with ${selectorType} "${containerSelector}" found near button: ${getElementIdentifier(button)}. Using first: ${getElementIdentifier(relativesContainers[0])}`);
            }
            return relativesContainers[0];
        }

        // Step 2: Fallback to document-wide search
        if (wasEmptySelector) {
            console.warn(`No ${containerSelector} container found in vicinity of button: ${getElementIdentifier(button)}. Falling back to document.querySelector().`);
        }

        const anyContainer = document.querySelector(containerSelector);

        if (!anyContainer) {
            console.error(`No element with ${selectorType} "${containerSelector}" found anywhere in document.`);
            return null;
        }

        return anyContainer;
    }

    // CASE: ID (with or without # prefix)
    if (firstChar !== '#') {
        console.warn(`getScrollContainer: containerSelector "${containerSelector}" missing # prefix. Treating as ID.`);
    }

    let id = containerSelector;
    if (id.startsWith('#')) {
        id = id.substring(1);
    }

    const container = document.getElementById(id);

    if (!container) {
        console.error(`Scroll container with id "${id}" not found.`);
        return null;
    }

    return container;
}

function parseScrollCommand(commandString) {
    if (!commandString || typeof commandString !== 'string') {
        console.warn(`Invalid scroll command: "${commandString}"`);
        return null;
    }

    const trimmed = commandString.trim();

    // Navigation commands
    if (trimmed === 'next') {
        return { type: 'direction', value: 1 };
    }
    if (trimmed === 'prev') {
        return { type: 'direction', value: -1 };
    }
    if (trimmed === 'first') {
        return { type: 'index', value: 0 };
    }
    if (trimmed === 'last') {
        return { type: 'special', command: 'last' };
    }

    // Index (numeric)
    if (/^\d+$/.test(trimmed)) {
        return { type: 'index', value: parseInt(trimmed, 10) };
    }

    // Element ID reference
    if (trimmed.startsWith('#')) {
        return { type: 'element', value: trimmed.substring(1) };
    }

    // Percentage scroll (e.g., "25%")
    if (trimmed.endsWith('%') && !isNaN(parseFloat(trimmed))) {
        const percent = parseFloat(trimmed);
        if (percent >= 0 && percent <= 100) {
            return { type: 'percentage', value: percent };
        }
    }

    // Pixel scroll (e.g., "100px")
    if (trimmed.endsWith('px') && !isNaN(parseFloat(trimmed))) {
        return { type: 'pixels', value: parseFloat(trimmed) };
    }

    // Named element reference (without #, for backward compatibility)
    const possibleElement = document.getElementById(trimmed);
    if (possibleElement) {
        console.warn(`Using "${trimmed}" as element ID. Prefer "#${trimmed}" for clarity.`);
        return { type: 'element', value: trimmed };
    }

    console.warn(`Unrecognized scroll command: "${trimmed}"`);
    return null;
}

function executeScrollCommand(container, command) {
    switch (command.type) {
        case 'direction':
            scrollContainerByIndices(container, command.value);
            break;

        case 'index':
            scrollContainerToIndex(container, command.value);
            break;

        case 'element':
            scrollContainerToElement(container, command.value);
            break;

        case 'percentage':
            scrollContainerToPercentage(container, command.value);
            break;

        case 'pixels':
            scrollContainerByWidth(container, command.value);
            break;

        case 'special':
            if (command.command === 'last') {
                const children = Array.from(container.children);
                if (children.length > 0) {
                    scrollContainerToIndex(container, children.length - 1);
                }
            }
            break;

        default:
            console.warn(`Unknown command type: ${command.type}`);
    }
}

function sendScrollCommandEvent(clickedButton, container, command) {
    const event = new CustomEvent('scroll', {
        detail: {
            clickedButton: clickedButton,
            container: container,
            command: command
        },
        bubbles: true
    });
    container.dispatchEvent(event);
    console.log("!!!ZyKa dispatched: ", event.detail);
}
/* endregion [data-scroll]-management */

export function initializeScrollContainers() {
    if (!window._scrollNavGlobalHandlerSetup) {
        setupGlobalScrollHandler();
        window._scrollNavGlobalHandlerSetup = true;
    }
}

function setupGlobalScrollHandler() {
    document.addEventListener('click', (e) => {
        const navigator = e.target.closest('[data-scroll], [data-scrollcontainer-id]');
        if (!navigator) {
            return;
        }

        e.preventDefault();

        handleScrollCommand(navigator);
    });

    // console.log('Global scroll navigation handler initialized');
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeScrollContainers());
    } else {
        initializeScrollContainers();
    }
}