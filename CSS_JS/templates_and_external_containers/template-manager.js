/**
 * Generic template loader utility
 * Can be used to load and manage HTML templates from various sources
 */

/**
 * Finds a template element in the current HTML document by its ID
 * @param {string} templateId - The ID of the template element to find
 * @returns {HTMLTemplateElement|null} The template element or null if not found
 */
export function findTemplateInHtml(templateId) {
    if (!templateId) {
        console.error("findTemplateInHtml: templateId is required");
        return null;
    }

    const template = document.getElementById(templateId);
    if (!template) {
        console.warn(`findTemplateInHtml: template with id '${templateId}' not found`);
        return null;
    }

    return template;
}

/**
 * Loads a template from an external HTML file and returns it
 * @param {string} templateDocumentPath - Path to the HTML file containing the template
 * @param {string} templateId - The ID of the template element to extract
 * @returns {Promise<HTMLTemplateElement|null>} The template element or null if not found
 */
export async function findTemplateInDocument(templateDocumentPath, templateId) {
    if (!templateDocumentPath) {
        console.error("findTemplateInDocument: templateDocumentPath is required");
        return null;
    }

    if (!templateId) {
        console.error("findTemplateInDocument: templateId is required");
        return null;
    }

    try {
        const response = await fetch(templateDocumentPath);
        if (!response.ok) {
            throw new Error(`template loading error: HTTP error! status: ${response.status}`);
        }

        const templateHTML = await response.text();

        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = templateHTML;

        // Extract the template element
        const templateElement = tempDiv.querySelector(`#${templateId}`);
        if (!templateElement) {
            throw new Error(`Template with id '${templateId}' not found in external file`);
        }

        return templateElement;
    } catch (error) {
        console.error("findTemplateInDocument: failed to load template", error);
        return null;
    }
}

/**
 * Adds a template element to the document head and optionally returns it
 * @param {HTMLTemplateElement} template - The template element to add
 * @returns {HTMLTemplateElement} The template element that was added
 */
export function addTemplateToDocument(template) {
    if (!template) {
        console.error("addTemplateToDocument: template is required");
        return null;
    }

    document.head.appendChild(template);
    return template;
}

/**
 * Creates a copy of a template's content
 * @param {HTMLTemplateElement} template - The template to clone
 * @returns {DocumentFragment|null} A cloned copy of the template content
 */
export function createFragmentFromTemplate(template) {
    if (!template) {
        console.error("createFromTemplate: template is required");
        return null;
    }

    if (!template.content) {
        console.error("createFromTemplate: template does not have content property");
        return null;
    }

    return template.content.cloneNode(true);
}

export function appendTemplateCopyToElement(element, template)
{
    if (!element)
    {
        console.error("addTemplateCopyToElement: element is null or undefined");
        return;
    }
    if (!template)
    {
        console.error("addTemplateCopyToElement: template is null or undefined");
        return;
    }
    if (!template.content)
    {
        console.error("createFromTemplate: template does not have content property");
        return null;
    }

    const fragment = template.content.cloneNode(true);

    if (fragment.children.length === 0)
    {
        console.warn("appendTemplateCopyToElement: template fragment has no children");
        return;
    }
    if (fragment.children.length === 1)
    {
        const singleElement = fragment.firstElementChild;
        element.appendChild(singleElement);
        return singleElement;
    }
    else if (fragment.children.length > 1)
    {
        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment);
        element.appendChild(wrapper);
        return wrapper;
    }
}
