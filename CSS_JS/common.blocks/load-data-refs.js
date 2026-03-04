import {GetPathFromPortfolioRoot} from "../../PortfolioRootPath.js";

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
        const refName = dataRefElement.getAttribute('Data-ref');
        const [type, key] = refName.split(':');
        const data = jsonData[key];

        switch (type) {
            case 'text':
                setTextContent(dataRefElement, data);
                break;
            case 'image':
                setImageContent(dataRefElement, data);
                break;
            case 'icon':
                trySetIcon(dataRefElement, data);
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
            case 'contributions':
                setContributions(dataRefElement, data);
                break;
            default:
                console.error(`Unknown data-ref type: ${type}`);
                break;
        }
    }
}

export async function TryLoadJson(path)
{
    try {
        const response = await fetch(path);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }
        return await response.json();
    }
    catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error(`Network error - failed to fetch ${path}:`, error.message);
        } else if (error instanceof SyntaxError) {
            console.error(`JSON parsing error for ${path}: Invalid JSON format`, error.message);
        } else {
            console.error(`Unexpected error loading ${path}:`, error.message);
        }
        return null;
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

    if (Array.isArray(text))
    {
        element.innerHTML = text.join('<br>');
    }
    else
    {
        element.textContent = text;
    }
}

function setGitContent(element, gitLink) {
    if (!element) {
        console.warn("setGitContent: element is null or undefined");
        return;
    }

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
        this.src = '/Data/Placeholder/Bowser.jpg';
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

const IconRegistry = new Map([
    ['Arrow', '/Data/Icons/arrow.png'],
    ['Blender', '/Data/Icons/Blender.png'],
    ['Calender', '/Data/Icons/Calender.png'],
    ['Cologne Game Lab', '/Data/Icons/Cologne Game Lab.png'],
    ['Cpp', '/Data/Icons/Cpp.png'],
    ['cs', '/Data/Icons/cs.png'],
    ['fmod', '/Data/Icons/fmod.png'],
    ['GDD', '/Data/Icons/GDD.png'],
    ['Git', '/Data/Icons/Git.png'],
    ['googledocs', '/Data/Icons/googledocs.png'],
    ['Group', '/Data/Icons/Group.png'],
    ['Libre_Office', '/Data/Icons/Libre_Office.png'],
    ['Link_arrow', '/Data/Icons/Link_arrow.png'],
    ['Miro', '/Data/Icons/Miro.png'],
    ['PaperPrototype', '/Data/Icons/PaperPrototype.png'],
    ['Person', '/Data/Icons/Person.png'],
    ['private', '/Data/Icons/private.png'],
    ['Reaper', '/Data/Icons/Reaper.png'],
    ['Subversion', '/Data/Icons/Subversion.png'],
    ['Tortoise', '/Data/Icons/Tortoise.png'],
    ['Unity', '/Data/Icons/Unity.png'],
    ['Unreal Engine', '/Data/Icons/Unreal Engine.png'],
])


function trySetIcon(element, iconName) {
    if (!element) {
        console.warn("setIcon: element is null or undefined");
        return;
    }
    if (!iconName) {
        console.warn("setIcon: iconName is null, undefined, or empty");
        return;
    }

    if (IconRegistry.has(iconName))
    {
        const IconPath = IconRegistry.get(iconName);
        const imgElement = document.createElement('img');
        imgElement.className = "media--img-in-font";
        element.appendChild(imgElement);
        const descElement = document.createElement('p');
        element.appendChild(descElement);

        setImageContent(imgElement, {"src": IconPath, "alt": iconName, "class": "media--img-in-font"});
        element.onerror = function()
        {
            console.warn(`setIcon-error: no icon found for name: ${iconName}`);
        }
        return true;
    }
    else
    {
        element.innerHTML = iconName;
        return false;
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

function setContributions(element, contributions) {
    if (!element) {
        console.warn("setContributions: element is null or undefined");
        return;
    }
    if (!contributions) {
        console.warn("setContributions: contributions is null or undefined");
        return;
    }

    let containerID = contributions.containerID;
    for (let contribution of contributions.contributions)
    {
        let contributionElement = document.createElement('span');
        element.appendChild(contributionElement);

        contributionElement.innerHTML = contribution.name;
        contributionElement.setAttribute('Data-cached-container-id', containerID);
        contributionElement.setAttribute('Data-cached-content', GetPathFromPortfolioRoot(contribution.link));
        element.innerHTML += ",<br>"
    }
}