const lightboxOverlay = document.getElementById('lightbox__overlay');
const lightboxBody = lightboxOverlay.querySelector('.lightbox__content');
const closeBtn = lightboxOverlay.querySelector('.lightbox__close-btn');

let placeholderElement = null;
let currentContent = null;

// Function to open lightbox and load content
export function isLightboxOpen() {
    let hasActiveClass = lightboxOverlay.classList.contains('--active');
    let hasActivePlaceholder = placeholderElement != null;
    let currentContentExists = currentContent != null;

    if (!hasActiveClass && (hasActivePlaceholder || currentContentExists))
    {
        console.warn("lightbox state is inconsistent; please report this bug.");
    }

    return hasActiveClass;
}

export function openLightbox(content, createCopy = false) {
    if (placeholderElement || currentContent)
    {
        console.warn("lightbox was not properly closed before opening again; placeholderElement and currentContent will be overwritten by automatic closure before reopening");
        closeLightbox();
    }

    if (content instanceof HTMLElement) {
        if (createCopy) {
            content = content.cloneNode(true);
        }
        else if (content.parentNode != null)
        {
            placeholderElement = document.createElement('div');
            placeholderElement.style.display = 'none';
            placeholderElement.id = 'placeholder';
            content.parentNode.insertBefore(placeholderElement, content);
            currentContent = content;
        }

        lightboxBody.innerHTML = '';
        lightboxBody.appendChild(content);
    }
    else
    {
        lightboxBody.innerHTML = content;
    }
    lightboxOverlay.classList.add('--active');
    document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
    if (placeholderElement != null)
    {
        placeholderElement.parentNode.insertBefore(currentContent, placeholderElement);
        placeholderElement.remove();
        placeholderElement = null;
    }

    lightboxBody.innerHTML = '';
    lightboxOverlay.classList.remove('--active');
    document.body.style.overflow = '';
    currentContent = null;
}

function SetupLightboxClickHandling()
{
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-lightbox-open]'))
        {
            e.preventDefault();
            let query = e.target.closest('[data-lightbox-open]').getAttribute('data-lightbox-open');
            const content = document.querySelector(query);
            if (!content)
            {
                console.error(`Failed to find content for lightbox-open query ${query}`);
                return;
            }
            openLightbox(content);
        }
    })
}

function initialize()
{
    closeBtn.addEventListener('click', closeLightbox);

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('--active')) {
            closeLightbox();
        }
    });

    SetupLightboxClickHandling();
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    initialize();
}

