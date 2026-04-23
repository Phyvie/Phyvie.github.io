let lightboxOverlay = null;
let lightboxBody = null;
let closeBtn = null;

let placeholderElement = null;
let currentContent = null;

// Function to open lightbox and load content
export function IsLightboxOpen() {
    if (!lightboxOverlay) return false;
    let hasActiveClass = lightboxOverlay.classList.contains('--active');
    let hasActivePlaceholder = placeholderElement != null;
    let currentContentExists = currentContent != null;

    if (!hasActiveClass && (hasActivePlaceholder || currentContentExists))
    {
        console.warn("lightbox state is inconsistent; please report this bug.");
    }

    return hasActiveClass;
}

export function OpenLightbox(content, createCopy = false) {
    if (!lightboxOverlay || !lightboxBody) {
        console.error("Lightbox is not initialized.");
        return;
    }
    if (placeholderElement || currentContent)
    {
        console.warn("lightbox was not properly closed before opening again; placeholderElement and currentContent will be overwritten by automatic closure before reopening");
        CloseLightbox();
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

export function CloseLightbox() {
    if (!lightboxOverlay || !lightboxBody) return;
    if (placeholderElement != null)
    {
        placeholderElement.parentNode.insertBefore(currentContent, placeholderElement);
        placeholderElement.remove();
        placeholderElement = null;
    }

    lightboxBody.innerHTML = '';
    lightboxOverlay.classList.remove('--active');
    if (activeStyle != null)
    {
        lightboxOverlay.classList.remove(activeStyle);
        activeStyle = null;
    }
    document.body.style.overflow = '';
    currentContent = null;
}

export const fullscreenStyle = "--fullscreen";
let activeStyle = null;
const styles = [fullscreenStyle];
export function SetLightboxStyle(style)
{
    if (!lightboxOverlay) {
        console.error("Lightbox is not initialized.");
        return;
    }
    if (!styles.includes(style))
    {
        console.error("trying to set non-existing style");
    }
    if (activeStyle != null)
    {
        lightboxOverlay.classList.remove(activeStyle);
    }
    activeStyle = style;
    lightboxOverlay.classList.add(style);
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
            OpenLightbox(content);
        }
    })
}

async function initialize()
{
    try
    {
        lightboxOverlay = document.getElementById('lightbox__overlay');

        if (!lightboxOverlay)
        {
            console.log("no lightbox was found in document; adding default lightbox");
            let main = document.querySelector('main');

            const response = await fetch(new URL("./_example_lightbox.html", import.meta.url));
            if (!response.ok)
            {
                throw new Error("Could not find default lightbox HTML");
            }
            const htmlContent = await response.text();
            const parser = new DOMParser();
            const sourceDoc = parser.parseFromString(htmlContent, "text/html");
            const lightbox = sourceDoc.querySelector('#lightbox__overlay');
            document.body.appendChild(lightbox);
            lightboxOverlay = document.getElementById('lightbox__overlay');
        }

        if (!lightboxOverlay) {
            throw new Error("Failed to find or create lightbox overlay");
        }

        lightboxBody = lightboxOverlay.querySelector('.lightbox__content');
        closeBtn = lightboxOverlay.querySelector('.lightbox__close-btn');

        if (!lightboxBody || !closeBtn) {
            throw new Error("Lightbox overlay is missing required elements (.lightbox__content or .lightbox__close-btn)");
        }

        closeBtn.addEventListener('click', CloseLightbox);

        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                CloseLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('--active')) {
                CloseLightbox();
            }
        });

        SetupLightboxClickHandling();
    }
    catch (error)
    {
        console.error("lightbox initialization failed");
        console.error(error);
    }
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    initialize();
}

