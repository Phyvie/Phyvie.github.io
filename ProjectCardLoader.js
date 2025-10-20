/**
 * Render a single project card by project name (without .json).
 * Example: renderProjectCard("LoneSignal", "#project-cards")
 */
async function renderProjectCard(projectName, projectJsonPath, mountSectionName, options = {}) {
    const card = createCardFromTemplate();
    card.id = projectName;
    const mount = document.querySelector(mountSectionName);
    if (mount) {
        mount.appendChild(card);
    } else {
        console.error(`Failed to mount card to ${mountSectionName}`);
    }

    try {
        const data = await loadJsonData(projectJsonPath);
        fillCardData(card, data);
    } catch (err) {
        console.error("Failed to load card data:", err);
    }

    return card;
}

/**
 * Render multiple project cards in order.
 * Example: renderProjectCards(["LoneSignal", "AnotherProject"], "#project-cards")
 */
async function renderProjectCards(projectNames, mountSection = "#project-cards", options = {}) {
    for (const name of projectNames) {
        await renderProjectCard(name, mountSection, options);
    }
}

//region Helper Functions
function qDataRef(searchRoot, ref) {
    return searchRoot.querySelector(`[data-ref="${ref}"]`);
}

function addIconByName(container, iconName) {
    if (!container) return;
    container.textContent = "";
    if (!iconName) return;

    const img = document.createElement("img");
    img.src = `Data/Icons/${iconName}.png`;
    img.alt = iconName;
    img.onerror = () => {
        container.textContent = iconName;
    };
    container.appendChild(img);
}

async function loadJsonData(path) {
    if (!path || typeof path !== "string") {
        throw new Error("loadJsonData: 'path' must be a non-empty string");
    }
    const res = await fetch(path, {cache: "no-cache"});
    if (!res.ok) {
        throw new Error(`Failed to load JSON at ${path}: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}

//endregion Helper Functions

// region Template Instantiation Functions
var TEMPLATE_PROJECT_CARD = null;
var TEMPLATE_PROJECT_TAG = null;

function loadTemplates() {
    TEMPLATE_PROJECT_CARD = document.getElementById("template-project-card");
    TEMPLATE_PROJECT_TAG = document.getElementById("template-project-tag");
}

function createTagFromTemplate(content) {
    const fragment = TEMPLATE_PROJECT_TAG.content.cloneNode(true);
    const tagRoot = fragment.querySelector("div.tag");
    if (!tagRoot) {
        throw new Error("Template missing div.Tag");
    }

    const image = qDataRef(tagRoot, "Tag-Icon");
    image.src = `Data/Icons/${content}.png`;
    image.alt = content;

    const hoverInfo = qDataRef(tagRoot, "Tag-HoverInfo");
    hoverInfo.textContent = content;

    return tagRoot;
}

function createCardFromTemplate() {
    const fragment = TEMPLATE_PROJECT_CARD.content.cloneNode(true);
    const cardRoot = fragment.querySelector("article.project-card");
    if (!cardRoot) {
        throw new Error("Template missing article.Card");
    }
    return cardRoot;
}

// endregion Template Instantiation Functions

function fillCardData(cardRoot, jsonData) {
    loadImageAndTitle(cardRoot, jsonData);
    loadVideo(cardRoot, jsonData);
    loadOrigin(cardRoot, jsonData);
    loadDateTime(cardRoot, jsonData);
    loadTeamSize(cardRoot, jsonData);
    loadTags(cardRoot, jsonData);
    loadLinks(cardRoot, jsonData);
    wireImageToVideo(cardRoot); // enable click-to-play swap
}

// region Card Data Loading Functions
function loadImageAndTitle(cardRoot, jsonData) {
    // Image
    const img = qDataRef(cardRoot, "image");
    if (img) {
        if (jsonData?.image?.src) {
            img.src = jsonData.image.src;
        }
        img.alt = jsonData?.image?.alt || img.alt || "";

        console.log(`image loaded for ${cardRoot.id}: ${img.src}}`); //-ZyKa
    }

    // Title (h2) and Type (h3)
    const title = qDataRef(cardRoot, "title");
    if (title) {
        title.textContent = jsonData?.["project-title"] || "project-title";
    }

    const type = qDataRef(cardRoot, "type");
    if (type) {
        type.textContent = jsonData?.["project-type"] || "project-type";
    }
}

function loadVideo(cardRoot, jsonData) {
    const vid = qDataRef(cardRoot, "video");
    if (!vid) return;
    const v = jsonData?.["project-video"];
    const src = typeof v === "string" ? v : v?.src;
    if (src) vid.src = src;
}

function wireImageToVideo(cardRoot) {
    const img = qDataRef(cardRoot, "image");
    const vid = qDataRef(cardRoot, "video");
    if (!img || !vid) return;

    // Ensure initial state: image visible, video hidden
    vid.hidden = true;

    img.addEventListener("click", () => {
        // If no video source is set, do nothing
        if (!vid.src) return;

        // Swap: hide image, show video, start playing
        img.style.display = "none";
        vid.style.display = "block";
        // Optional: remove hover styling when swapped
        img.classList.remove("HoverScale");

        // Attempt to play; ignore errors from autoplay policies
        const p = vid.play();
        if (p && typeof p.catch === "function") {
            p.catch(() => {
            });
        }
    });

    // Optional: when the video ends, swap back to the image
    vid.addEventListener("ended", () => {
        img.style.display = "block";
        vid.style.display = "none";
        img.classList.add("HoverScale");
    });
}

function loadOrigin(cardRoot, jsonData) {
    const origin = qDataRef(cardRoot, "origin");
    if (origin) {
        addIconByName(origin, jsonData?.origin);
    }
}

function loadDateTime(cardRoot, jsonData) {
    const date = qDataRef(cardRoot, "date");
    if (date) {
        date.textContent = jsonData?.date;
    }
    const time = qDataRef(cardRoot, "time");
    if (time) {
        time.textContent = jsonData?.time;
    }
}

function loadTeamSize(cardRoot, jsonData) {
    const teamIcon = qDataRef(cardRoot, "teamIcon");
    const teamSizeText = qDataRef(cardRoot, "teamSize");

    const teamSizeNum = Number.parseInt(jsonData?.["team-size"], 10);
    const isSingle = !Number.isNaN(teamSizeNum) ? teamSizeNum === 1 : (jsonData?.["team-size"] == 1);

    if (teamIcon) {
        teamIcon.src = isSingle ? "Data/Icons/Person.png" : "Data/Icons/Group.png";
        teamIcon.alt = isSingle ? "1 person" : "Group";
    }
    if (teamSizeText) {
        teamSizeText.textContent = jsonData?.["team-size"] ?? "";
    }
}

function loadTags(cardRoot, jsonData) {
    const tags = cardRoot.querySelector("#project-card__tag-container");
    if (!tags || !Array.isArray(jsonData?.tools)) return;
    jsonData.tools.forEach((t) => {
        let newTag = createTagFromTemplate(t);
        tags.appendChild(newTag);
    });
}

function loadLinks(cardRoot, jsonData) {
    const pageLink = qDataRef(cardRoot, "projectPageLink");
    if (pageLink && jsonData?.["project-url"]) {
        pageLink.href = jsonData["project-url"];
    }

    const moreInfoLink = qDataRef(cardRoot, "moreInfoLink");
    if (moreInfoLink && jsonData?.["project-info-url"]) {
        moreInfoLink.href = jsonData["project-info-url"];
    }
}

//endregion Card Data Loading Functions


