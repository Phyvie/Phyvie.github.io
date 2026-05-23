const hoverTooltip = document.createElement('div');
hoverTooltip.id = 'hover-tooltip';
hoverTooltip.className = 'tooltip-container--desktop';
hoverTooltip.classList.add('--hidden');
hoverTooltip.style.position = 'fixed';
hoverTooltip.style.zIndex = '3000';
document.body.appendChild(hoverTooltip);

const mobileTooltip = document.createElement('div');
mobileTooltip.id = 'mobile-tooltip-display';
mobileTooltip.className = 'mobile-tooltip-container';
mobileTooltip.classList.add('--hidden');

const mobileTooltipContent = document.createElement('div');
mobileTooltipContent.className = 'mobile-tooltip-content';
mobileTooltip.appendChild(mobileTooltipContent);

const closeButton = document.createElement('button');
closeButton.className = 'mobile-tooltip-close-button';
closeButton.innerHTML = '&#10005;';
closeButton.addEventListener('click', () => {
    hideTooltip();
});
mobileTooltip.appendChild(closeButton);
document.body.appendChild(mobileTooltip);

function showTooltip(target) {
    const title = target.getAttribute('data-tooltip-title');
    const content = target.getAttribute('data-tooltip-content');
    const skillLevel = target.getAttribute('data-tooltip-skill-level');
    
    if (!title && !content)
    {
        console.error("Tooltip: Target has no title or content", target);
        return;
    }

    const htmlContent = `
        <div class="tooltip-header">${title || ''}</div>
        <div class="tooltip-description">${content || ''}</div>
        ${(skillLevel && skillLevel !== "undefined") ? `<div class="tooltip-skill-level"> expertise: ${skillLevel}</div>` : ''}
    `;

    // Check if the mobile container exists and is visible
    const mobileContainer = document.getElementById('mobile-tooltip-display');
    const isMobileMode = mobileContainer && getComputedStyle(mobileContainer).display !== 'none';

    if (isMobileMode) {
        // Mode A: Fixed display at bottom (Mobile)
        hoverTooltip.classList.add('--hidden'); // Hide the floating one
        const contentContainer = mobileContainer.querySelector('.mobile-tooltip-content');
        if (contentContainer && contentContainer.innerHTML !== htmlContent) {
            if (mobileContainer.classList.contains('--active')) {
                // Trigger switch animation if already active
                mobileContainer.classList.remove('--switching');
                void mobileContainer.offsetWidth; // Force reflow
                mobileContainer.classList.add('--switching');

                // Swap content halfway through the animation (100ms)
                setTimeout(() => {
                    contentContainer.innerHTML = htmlContent;
                }, 100);
            } else {
                contentContainer.innerHTML = htmlContent;
            }
        }
        mobileContainer.classList.add('--active');
    } else {
        // Mode B: Floating display (Desktop)
        hoverTooltip.innerHTML = htmlContent;
        hoverTooltip.classList.remove('--hidden');
        
        const rect = target.getBoundingClientRect();
        
        // Position it relative to the target, to the right
        hoverTooltip.style.top = `${rect.top}px`;
        hoverTooltip.style.left = `${rect.right + 10}px`;

        // Adjust position if it goes off-screen (right side)
        const tooltipRect = hoverTooltip.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth) {
            // Position it to the left of the target instead
            hoverTooltip.style.left = `${rect.left - tooltipRect.width - 10}px`;
        }

        // Adjust position if it goes off-screen (left side - can happen if target is very far right and tooltip is wide)
        const updatedTooltipRect = hoverTooltip.getBoundingClientRect();
        if (updatedTooltipRect.left < 0) {
            // Center it horizontally if it doesn't fit on either side
            hoverTooltip.style.left = `${(window.innerWidth - updatedTooltipRect.width) / 2}px`;
        }

        // Adjust position if it goes off-screen (bottom side)
        if (updatedTooltipRect.bottom > window.innerHeight) {
            hoverTooltip.style.top = `${window.innerHeight - updatedTooltipRect.height - 10}px`;
        }
    }
}

export function hideTooltip() {
    hoverTooltip.classList.add('--hidden');
    
    // Also clear mobile container if it exists
    const mobileContainer = document.getElementById('mobile-tooltip-display');
    if (mobileContainer) {
        mobileContainer.classList.remove('--active');
        const contentContainer = mobileContainer.querySelector('.mobile-tooltip-content');
        if (contentContainer) {
             // Optional: clear content after transition
             // setTimeout(() => { if (!mobileContainer.classList.contains('--active')) contentContainer.innerHTML = ""; }, 200);
        }
    }
}

document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const target = e.target.closest('.has-tooltip');
    if (target) {
        showTooltip(target);
    }
});

document.addEventListener('pointerout', (e) => {
    if (e.pointerType === 'touch') return;
    const target = e.target.closest('.has-tooltip');
    if (target) {
        hideTooltip();
    }
});

// Touch support
let hideTimer;
let currentTouchTarget = null;
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('.has-tooltip');

    if (target) {
        if (currentTouchTarget === target && !hoverTooltip.classList.contains('--hidden')) {
            hideTooltip();
            currentTouchTarget = null;
        } else {
            // Touch on a new tooltip element or same one if it was hidden
            clearTimeout(hideTimer);
            showTooltip(target);
            currentTouchTarget = target;
        }
    } else {
        // Touch elsewhere - check if it's not the tooltip itself
        if (!e.target.closest('.mobile-tooltip-container') && !e.target.closest('.tooltip-container--desktop')) {
            hideTooltip();
            currentTouchTarget = null;
        }
    }
}, { passive: true });

mobileTooltip.addEventListener('touchstart', (e) => {
    e.stopPropagation();
}, { passive: false });

mobileTooltip.addEventListener('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

let scrolling = false;
document.addEventListener('scroll', (e) => {
    scrolling = true;
})

setInterval(() => {
    if (scrolling) {
        scrolling = false;
        hideTooltip();
    }
}, 300);