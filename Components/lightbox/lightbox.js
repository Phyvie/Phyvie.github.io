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
            if (placeholderElement)
            {
                console.warn("placeholderElement already exists; this should not happen if CloseLightbox was called correctly. Overwriting placeholder.");
            }
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
    if (placeholderElement != null && currentContent != null)
    {
        // Only move back if the content is still inside the lightbox body
        if (lightboxBody.contains(currentContent))
        {
            placeholderElement.parentNode.insertBefore(currentContent, placeholderElement);
        }
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
    lightboxOverlay.closeOnInnerClick = false;
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

async function initialize()
{
    try
    {
        /* region get lightbox references */
        lightboxOverlay = document.getElementById('lightbox__overlay');
        if (!lightboxOverlay)
        {
            /* region create lightbox */
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
            /* endregion create lightbox */
        }
        if (!lightboxOverlay) {
            throw new Error("Failed to find or create lightbox overlay");
        }

        lightboxBody = lightboxOverlay.querySelector('.lightbox__content-container');
        closeBtn = lightboxOverlay.querySelector('.lightbox__close-btn');

        if (!lightboxBody || !closeBtn) {
            throw new Error("Lightbox overlay is missing required elements (.lightbox__content or .lightbox__close-btn)");
        }
        /* endregion get lightbox references */

        /* region open lightbox */
        document.addEventListener('click', (e) => {
            const openingElement = e.target.closest('[data-lightbox-open]');
            if (openingElement)
            {
                e.preventDefault();
                let query = openingElement.getAttribute('data-lightbox-open');
                if (query === "none")
                {
                    return;
                }
                const content = query.length > 0 ? document.querySelector(query) : openingElement;
                if (!content)
                {
                    console.error(`Failed to find content for lightbox-open query ${query}`);
                    return;
                }
                OpenLightbox(content);
                if (openingElement.hasAttribute("data-lightbox-closeOnInnerClick"))
                {
                    lightboxOverlay.closeOnInnerClick = true;
                }
            }
        })
        /* region close lightbox */

        /* region close lightbox */
        closeBtn.addEventListener('click', CloseLightbox);

        let isDragging = false;
        let startX, startY;

        lightboxOverlay.addEventListener('mousedown', (e) => {
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
        });

        lightboxOverlay.addEventListener('mousemove', (e) => {
            if (e.buttons & 1) { // Left mouse button is pressed
                if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                    isDragging = true;
                }
            }
        });

        lightboxOverlay.addEventListener('click', (e) => {
            if (isDragging) return;
            if ((e.target === lightboxOverlay || lightboxBody.contains(e.target)) && lightboxOverlay.closeOnInnerClick) {
                CloseLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('--active')) {
                CloseLightbox();
            }
        });
        /* region close lightbox */
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

