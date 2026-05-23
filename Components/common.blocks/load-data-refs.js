import {resolveRelativeUrlsInJson} from "../URL-Fetching-And-Templates/cross-html-engine.js";

export function loadDataRefs(targetRootElement, jsonData, baseUrl = null)
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

    if (baseUrl)
    {
        jsonData = resolveRelativeUrlsInJson(baseUrl, jsonData);
    }

    const dataRefElements = targetRootElement.querySelectorAll('[data-ref]');
    for (const dataRefElement of dataRefElements) {
        try {
            const refName = dataRefElement.getAttribute('Data-ref');
            const [type, key] = refName.split(':');
            const data = jsonData[key];

            switch (type) {
                case 'text':
                    setTextContent(dataRefElement, data);
                    break;
                case 'link':
                    setLink(dataRefElement, data);
                    break;
                case 'image':
                    setImageContent(dataRefElement, data);
                    break;
                case 'icon':
                    trySetIcon(dataRefElement, data);
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
                case 'tools':
                    setTools(dataRefElement, data);
                    break;
                default:
                    console.error(`Unknown data-ref type: ${type}`);
                    break;
            }
        }
        catch (error)
        {
            
        }
    }
}

export const ToolsIconsRegistry = new Map([
    ['Unity', {src: "/Data/Icons/Unity.png", alt: "Unity", desc: "game engine", skillLevel: "proficient, ~4years"}],
    ['Analog Prototype', {src: "/Data/Icons/PaperPrototype.png", alt: "Analog Prototype", desc: "includes conceptualising, paper & board game prototypes", skillLevel: "proficient, ~2years"}],
    ['GDD', {src: "/Data/Icons/GDD.png", alt: "game design document", desc: "", skillLevel: "proficient, ~2years"}],

    ['Unity UI Toolkit', {text: "UUT", alt: "Unity UI Toolkit", desc: "Unity's Web-dev-inspired new UI System", skillLevel: "functional, ~1year"}],
    ['cs', {src: "/Data/Icons/Cs.png", alt: "csharp", desc: "programming language", skillLevel: "functional, ~4years"}],
    ['Miro', {src: "/Data/Icons/Miro.png", alt: "Miro", desc: "collaborative online whiteboard", skillLevel: "functional"}],
    ['Git', {src: "/Data/Icons/Git.png", alt: "git", desc: "version control", skillLevel: "functional, ~4years"}],
    // ['Libre_Office', {src: "/Data/Icons/Libre_Office.png", alt: "Libre_Office", desc: "", skillLevel: "functional"}],
    ['Cpp', {src: "/Data/Icons/Cpp.png", alt: "Cpp", desc: "programming language", skillLevel: "functional, ~1year"}],
    ['Unreal Engine', {src: "/Data/Icons/Unreal Engine.png", alt: "Unreal Engine", desc: "game engine", skillLevel: "functional, ~1year"}],

    ['Blender', {src: "/Data/Icons/Blender.png", alt: "Blender", desc: "3D modeling software", skillLevel: "fundamentals"}],
    ['Reaper', {src: "/Data/Icons/Reaper.png", alt: "Reaper", desc: "digital audio workstation", skillLevel: "fundamentals"}],
    ['fmod', {src: "/Data/Icons/fmod.png", alt: "fmod", desc: "sound effects engine", skillLevel: "fundamentals"}],
    ['Subversion', {src: "/Data/Icons/Subversion.png", alt: "Subversion", desc: "version control", skillLevel: "fundamentals"}],
    // ['TortoiseSVN', {src: "/Data/Icons/TortoiseSVN.png", alt: "TortoiseSVN", desc: "version control", skillLevel: "fundamentals"}],
    // ['google_docs', {src: "/Data/Icons/google_docs.png", alt: "google_docs", desc: "", skillLevel: "fundamentals"}],
])

export const OriginIconRegistry = new Map([
    ['Cologne Game Lab', {src: "/Data/Icons/Cologne Game Lab.png", alt: "Cologne Game Lab", desc: "institute of the TH Cologne (university)"}],
    ['private', {src: "/Data/Icons/House.png", alt: "private", desc: ""}],
])

export const UtilityIconRegistry = new Map([
    ['Arrow', {src: "/Data/Icons/arrow.png", alt: "Arrow", desc: ""}],
    ['Calender', {src: "/Data/Icons/Calender.png", alt: "Calender", desc: ""}],
    ['Group', {src: "/Data/Icons/Group.png", alt: "group size", desc: ""}],
    ['Link_arrow', {src: "/Data/Icons/Link_arrow.png", alt: "", desc: ""}],
    ['Person', {src: "/Data/Icons/Person.png", alt: "", desc: ""}],
])

export const FullIconRegistry = new Map([
    ... ToolsIconsRegistry,
    ... OriginIconRegistry,
    ... UtilityIconRegistry,
])

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
        throw new Error("setTextContent: element is null or undefined"); 
    }
    if (text === undefined || text === null) {
        throw new Error("setTextContent: text is undefined or null");
    }

    if (Array.isArray(text))
    {
        element.innerHTML = text.join('<br>');
    }
    else
    {
        element.innerHTML = text;
    }
}

function setLink(element, linkData) {
    if (!element) {
        throw new Error("setLink: element is null or undefined"); 
    }

    if (!linkData) {
        throw new Error("setLink: linkData is null or undefined");
    }

    element.href = linkData;
}

function setGitContent(element, gitLink) {
    if (!element) {
        throw new Error("setGitContent: element is null or undefined"); 
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
        throw new Error("setImageContent: element is null or undefined"); 
    }
    if (element.tagName !== 'IMG') {
        throw new Error("setImageContent: element is not an image"); 
    }
    if (!imageData) {
        throw new Error("setImageContent: imageData is null or undefined"); 
    }

    element.onerror = function() {
        console.error(`setImageContent-error: no image at source: ${this.src}`);
        this.src = '/Data/Placeholder/Loading.png';
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

export function trySetIcon(element, iconName) {
    if (!element) {
        throw new Error("setIcon: element is null or undefined"); 
    }
    if (!iconName) {
        throw new Error("setIcon: iconName is null, undefined, or empty"); 
    }

    if (FullIconRegistry.has(iconName))
    {
        const IconData = FullIconRegistry.get(iconName);
        const IconSource = IconData.src;
        const IconText = IconData.text;

        const imgElement = document.createElement('img');
        if (IconSource)
        {
            imgElement.className = "media--img-in-font";

            setImageContent(imgElement, {"src": IconSource, "alt": iconName, "class": "media--img-in-font"});
            element.onerror = function()
            {
                throw new Error(`setIcon-error: no icon found for name: ${iconName}`); 
            }
        }
        else if (IconText)
        {
            element.innerHTML = IconText;
        }

        if (!(element.querySelector("p") || element.querySelector("span")))
        {
            const emptyText = document.createElement('span');
            emptyText.textContent = "​";
            element.appendChild(emptyText);
        }

        /* region bonus information on hovering over the tag */
        element.setAttribute('data-tooltip-title', IconData.alt);
        element.setAttribute('data-tooltip-content', IconData.desc);
        element.setAttribute('data-tooltip-skill-level', IconData.skillLevel);
        element.classList.add('tag', 'has-tooltip');
        // element.classList.add('tag--tool'); //tool-tags would look better with the tag--tool styling (more easily readable); however, adding them like this adds it to any procedurally loaded tags & creates visual inconsistency

        element.appendChild(imgElement);
        /* endregion */

        return true;
    }
    else
    {
        element.innerHTML = iconName.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
        element.classList.add('tag', 'has-tooltip');
        throw new Error(`setIcon: no icon found for name: ${iconName}`);
    }
}

function setLinks(element, linkData) {
    if (!element) {
        throw new Error("setLinks: element is null or undefined"); 
    }
    if (!linkData) {
        throw new Error("setLinks: linkData is null or undefined"); 
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
        throw new Error("setVideo: element is null or undefined"); 
    }
    if (!videoData) {
        throw new Error("setVideo: videoData is null or undefined"); 
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
        throw new Error("setContributions: element is null or undefined"); 
    }
    if (!contributions) {
        throw new Error("setContributions: contributions is null or undefined"); 
    }

    let complexFormat = !Array.isArray(contributions);

    let containerID;
    if (complexFormat)
    {
        containerID = contributions.containerID;
        contributions = contributions.contributions;
    }

    for (let i = 0; i < contributions.length; i++)
    {
        let contribution = contributions[i];
        let contributionElement = document.createElement('li');
        element.appendChild(contributionElement);

        contributionElement.innerHTML = (complexFormat ? contribution.name : contribution);
        if (complexFormat)
        {
            contributionElement.setAttribute('Data-cached-container-id', containerID);
            contributionElement.setAttribute('Data-cached-content', contribution.link);
        }
    }
}

function setTools(element, tools)
{
    if (!element) {
        throw new Error("setTools: element is null or undefined"); 
    }
    if (!tools) {
        throw new Error("setTools: tools is null or undefined"); 
    }

    for (let tool of tools)
    {
        let toolElement = document.createElement('span');
        toolElement.className = "tag";
        trySetIcon(toolElement, tool);
        toolElement.classList.add('tag--tool');
        element.appendChild(toolElement);
    }
}