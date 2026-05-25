import {TryLoadJson} from "../../load-data-refs.js";
import {resolveRelativeUrlsInJson} from "../../URL-Fetching-And-Templates/cross-html-engine.js";
import {embedWebGLIFrame, startEmbeddedGame} from "../unity-embed-webGL-iframe.js";
import {loadExternalTemplate} from "../../URL-Fetching-And-Templates/template-manager.js";

export async function initialize(lightboxTemplate, iframeTemplatePath, prevElementSelector, jsonDataPath)
{
    const prevElement = document.querySelector(prevElementSelector);
    if (!prevElement) {
        console.error("lightbox-WebGL-build: prevElement not found", prevElementSelector);
        return;
    }

    const template = await loadExternalTemplate(lightboxTemplate, "WebGL-lightbox-template");
    if (!template) {
        console.error("lightbox-WebGL-build: failed to load template", lightboxTemplate);
        return;
    }

    if (!iframeTemplatePath || iframeTemplatePath.length === 0)
    {
        console.error("lightbox-WebGL-build: iframeTemplatePath not provided");
        return;
    }

    const fragment = template.content.cloneNode(true);

    // Inject after prevElement
    prevElement.parentNode.insertBefore(fragment, prevElement.nextSibling);

    // Re-query from document because we just injected it
    const injectedLightbox = document.querySelector('#lightbox-WebGL-build');
    const LightboxWebGLOverlay = injectedLightbox?.querySelector('.lightbox__overlay');
    const LightboxContent = injectedLightbox?.querySelector('.lightbox__content-container');
    const OpenProjectButton = injectedLightbox?.querySelector('[data-scriptName="open-project-button"]');
    const LightboxCloseButton = injectedLightbox?.querySelector(".lightbox__close-btn");

    if (!OpenProjectButton || !injectedLightbox || !LightboxWebGLOverlay || !LightboxContent || !LightboxCloseButton)
    {
        console.error("lightbox-WebGL-build missing element", {OpenProjectButton, injectedLightbox, LightboxWebGLOverlay, LightboxContent, LightboxCloseButton});
        return;
    }

    const absoluteJsonURL = new URL(jsonDataPath, import.meta.url).href;
    const jsonData = await TryLoadJson(absoluteJsonURL);
    const resolvedJsonData = resolveRelativeUrlsInJson(absoluteJsonURL, jsonData);

    const WebGLIFrame = await embedWebGLIFrame(LightboxContent, iframeTemplatePath, resolvedJsonData.webGLConfig);
    if (!WebGLIFrame)
    {
        console.error("Failed to embed WebGL iframe");
        return;
    }

    OpenProjectButton.addEventListener('click', () => {
        LightboxWebGLOverlay.classList.add('--active');
        startEmbeddedGame(WebGLIFrame);
    });

    LightboxCloseButton.addEventListener('click', () => {
        LightboxWebGLOverlay.classList.remove('--active');
    })

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the header is NOT intersecting, it means we have scrolled past it
            // We check if it's not intersecting and the top is less than or equal to 0 (scrolled past or exactly at top)
            if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
                OpenProjectButton.classList.add('open-project-button--visible');
            } else {
                OpenProjectButton.classList.remove('open-project-button--visible');
            }
        });
    }, {
        threshold: 0,
        rootMargin: "0px"
    });

    observer.observe(prevElement);
}
