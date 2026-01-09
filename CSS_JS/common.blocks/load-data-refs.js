export function loadDataRefs(element, jsonData)
{
    const dataRefElements = element.querySelectorAll('[data-ref]');
    for (const dataRef of dataRefElements) {
        const refName = dataRef.getAttribute('data-ref');
        const [type, key] = refName.split(':');
        const data = jsonData[key];

        switch (type) {
            case 'text':
                setTextContent(dataRef, data);
                break;
            case 'multiline-text':
                setMultilineText(dataRef, data);
                break;
            case 'image':
                setImageContent(dataRef, data);
                break;
            case 'icon':
                setIcon(dataRef, data);
                break;
            case 'link':
                setLinks(dataRef, data);
                break;
            case 'video':
                setVideo(dataRef, data);
                break;
            default:
                console.error(`Unknown data-ref type: ${type}`);
                break;
        }

    }
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

function setImageContent(element, imageData) {
    if (!element) {
        console.warn("setImageContent: element is null or undefined");
        return;
    }
    if (!imageData) {
        console.warn("setImageContent: imageData is null or undefined");
        return;
    }

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

function setIcon(element, iconName) {
    if (!element) {
        console.warn("setIcon: element is null or undefined");
        return;
    }
    if (!iconName) {
        console.warn("setIcon: iconName is null, undefined, or empty");
        return;
    }

    // Clear existing content
    element.textContent = "";

    const img = document.createElement("img");
    img.src = `Data/Icons/${iconName}.png`;
    img.alt = iconName;
    img.className = "media--img-in-font";

    img.onerror = () => {
        element.textContent = iconName;
    };

    element.appendChild(img);
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