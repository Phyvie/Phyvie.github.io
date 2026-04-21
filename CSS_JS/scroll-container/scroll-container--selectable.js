import {calculateCenterScrollLeft} from "./scroll-container.js";

export function initializeSelectableScrollContainers() {
    const containers = document.querySelectorAll('.scroll-container--selectable');
    containers.forEach(container => {
        const contentContainer = container.querySelector('.scroll-container__content-container');
        if (!contentContainer) return;

        // Click to activate or deactivate a specific item
        container.addEventListener('click', (e) => {
            if (e.target === contentContainer)
            {
                deactivateItem(contentContainer);
                return;
            }
            const item = e.target.closest('.scroll-container__item');
            if (item && contentContainer.contains(item)) {
                if (item.classList.contains('scroll-container__item--active')) {
                    deactivateItem(contentContainer, item);
                } else {
                    switchActiveItem(contentContainer, item);
                }
            }
        });

        // Listen for scroll events from buttons to update active item
        contentContainer.addEventListener('scroll', (e) => {
            // We expect the custom 'scroll' event from scroll-container.js
            if (e.detail && e.detail.command) {
                const command = e.detail.command;
                const items = Array.from(contentContainer.children).filter(child => child.classList.contains('scroll-container__item'));
                const activeItem = contentContainer.querySelector('.scroll-container__item--active');
                const currentIndex = items.indexOf(activeItem);

                if (command.type === 'direction') {
                    // Prevent the default scroll from scroll-container.js
                    // because we want to handle the centering scroll ourselves
                    e.preventDefault();

                    let nextIndex;
                    if (currentIndex === -1) {
                        // If no item is active, next/prev both activate the first item
                        nextIndex = 0;
                    } else {
                        // Scroll from one item to the next/prev like before (relative to active item)
                        nextIndex = currentIndex + command.value;
                    }

                    if (nextIndex >= 0 && nextIndex < items.length) {
                        switchActiveItem(contentContainer, items[nextIndex]);
                    }
                } else if (command.type === 'index') {
                    e.preventDefault();
                    switchActiveItem(contentContainer, items[command.value]);
                } else if (command.type === 'special' && command.command === 'last') {
                    e.preventDefault();
                    switchActiveItem(contentContainer, items[items.length - 1]);
                }
            }
        });
    });
}

function switchActiveItem(container, newActiveItem) {
    const previousActiveItem = container.querySelector('.scroll-container__item--active');
    if (previousActiveItem === newActiveItem)
    {
        return;
    }

    // In order to scroll to the correct position animation transitions need to be temporarily disabled, so that the scroll-position is calculated correctly
    //1. deactivate all transitions
    const originalContainerTransition = container.style.transition;
    container.style.transition = 'none';
    const items = Array.from(container.children).filter(i => i.classList.contains('scroll-container__item'));
    const itemTransitions = items.map(i => i.style.transition);
    items.forEach(i => i.style.transition = 'none');

    //2. Switch which item is active
    if (previousActiveItem)
    {
        previousActiveItem.classList.remove('scroll-container__item--active');
    }
    newActiveItem.classList.add('scroll-container__item--active');
    container.offsetHeight; // Force reflow

    //3. Measure (using the new calculation function)
    const targetIndex = items.indexOf(newActiveItem);
    const targetScrollLeft = calculateCenterScrollLeft(container, targetIndex);

    //4. Revert the class changes and inline styles
    newActiveItem.classList.remove('scroll-container__item--active');
    if (previousActiveItem) previousActiveItem.classList.add('scroll-container__item--active');
    container.offsetHeight; // Force reflow again to ensure transition triggers

    //5. enable transitions again
    container.style.transition = originalContainerTransition;
    items.forEach((item, idx) => item.style.transition = itemTransitions[idx]);

    //6. Do the actual activation and deactivation
    if (previousActiveItem) deactivateItem(container, previousActiveItem);
    activateItem(container, newActiveItem);
    
    container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
    });
}

function activateItem(container, item) {
    // Only handles the activation state
    item.classList.add('scroll-container__item--active');
}

function deactivateItem(container, item = null) {
    if (item) {
        item.classList.remove('scroll-container__item--active');
    } else {
        const activeItems = container.querySelectorAll('.scroll-container__item--active');
        activeItems.forEach(i => i.classList.remove('scroll-container__item--active'));
    }
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeSelectableScrollContainers());
    } else {
        initializeSelectableScrollContainers();
    }
}
