export function loadDataRefs(targetRootElement, jsonData)
{
    if (!targetRootElement)
    {
        console.error("loadDataRefs: targetRootElement is null or undefined");
        return;
    }

    if (!jsonData)
    {
        console.error("loadDataRefs: jsonData is null or undefined");
        return;
    }

    const dataRefElements = targetRootElement.querySelectorAll('[data-ref]');
    for (const dataRefElement of dataRefElements) {
        const refName = dataRefElement.getAttribute('data-ref');
        const [type, key] = refName.split(':');
        const data = jsonData[key];

        switch (type) {
            case 'text':
                setTextContent(dataRefElement, data);
                break;
            case 'multiline-text':
                setMultilineText(dataRefElement, data);
                break;
            case 'image':
                setImageContent(dataRefElement, data);
                break;
            case 'icon':
                setIcon(dataRefElement, data);
                break;
            case 'link':
                setLinks(dataRefElement, data);
                break;
            case 'video':
                setVideo(dataRefElement, data);
                break;
            case 'git':
                setGitContent(dataRefElement, data);
                break;
            default:
                console.error(`Unknown data-ref type: ${type}`);
                break;
        }

    }
}

export async function TryLoadJson(path)
{
    const response = await fetch(path);
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return null;
    }
    return await response.json();
}

function setTextContent(element, text) {
    if (!element) {
        console.warn("setTextContent: element is null or undefined");
        return;
    }
    if (text === undefined || text === null) {
        console.warn("setTextContent: text is undefined or null");
        return;
    }

    element.textContent = text;
}

function setMultilineText(element, textArray) {
    if (!element) {
        console.warn("setMultilineText: element is null or undefined");
        return;
    }
    if (!Array.isArray(textArray)) {
        console.warn("setMultilineText: textArray is not an array");
        return;
    }

    element.innerHTML = textArray.join('<br>');
}

function setGitContent(element, gitLink) {
    fetch(gitLink)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(textContent => {
            element.textContent = textContent;
            hljs.highlightElement(element);
        })
        .catch(error => console.error(error));
}

function setImageContent(element, imageData) {
    if (!element) {
        console.warn("setImageContent: element is null or undefined");
        return;
    }
    if (element.tagName !== 'IMG') {
        console.warn("setImageContent: element is not an image");
        return;
    }
    if (!imageData) {
        console.warn("setImageContent: imageData is null or undefined");
        return;
    }

    element.onerror = function() {
        console.error(`setImageContent-error: no image at source: ${this.src}`);
        this.src = '/Data/Placeholder-images/Bowser.jpg';
    };


    if (typeof imageData === 'string') {
        element.src = imageData;
        return;
    }

    if (imageData.src) {
        element.src = imageData.src;
    }
    if (imageData.alt) {
        element.alt = imageData.alt;
    }
    if (imageData.class) {
        element.className += ' ' + imageData.class;
    }
}

function setIcon(element, iconName) {
    if (!element) {
        console.warn("setIcon: element is null or undefined");
        return;
    }
    if (!iconName) {
        console.warn("setIcon: iconName is null, undefined, or empty");
        return;
    }

    setImageContent(element, {"src": `Data/Icons/${iconName}.png`, "alt": iconName, "class": "media--img-in-font"});

    element.onerror = function()
    {
        console.error(`setIcon-error: no icon found for name: ${iconName}`);
    }
}

function setLinks(element, linkData) {
    if (!element) {
        console.warn("setLinks: element is null or undefined");
        return;
    }
    if (!linkData) {
        console.warn("setLinks: linkData is null or undefined");
        return;
    }

    if (typeof linkData === 'string') {
        element.href = linkData;
        return;
    }

    if (linkData.href) {
        element.href = linkData.href;
    }
    if (linkData.target) {
        element.target = linkData.target;
    }
    if (linkData.text) {
        element.textContent = linkData.text;
    }
}

function setVideo(element, videoData) {
    if (!element) {
        console.warn("setVideo: element is null or undefined");
        return;
    }
    if (!videoData) {
        console.warn("setVideo: videoData is null or undefined");
        return;
    }

    if (typeof videoData === 'string') {
        element.src = videoData;
        return;
    }

    if (videoData.src) {
        element.src = videoData.src;
    }
    if (videoData.controls !== undefined) {
        element.controls = videoData.controls;
    }
    if (videoData.autoplay !== undefined) {
        element.autoplay = videoData.autoplay;
    }
    if (videoData.muted !== undefined) {
        element.muted = videoData.muted;
    }
}