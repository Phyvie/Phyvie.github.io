/**
 * Render a single project card by project name (without .json).
 * Example: renderProjectCard("LoneSignal", "#project-cards")
 */
function renderProjectCard(projectName, mountSection, options = {}) {
    const basePath = options.basePath || "Data/Projects";
    const jsonPath = `${basePath}/${projectName}.json`;
    return loadProjectCard(jsonPath, mountSection);
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

/**
 * Load a project JSON and append a built card to the mount point.
 */
async function loadProjectCard(jsonPath, mountSection) {
    const mount = document.querySelector(mountSection);
    if (!mount) {
        console.error(`Mount element not found: ${mountSection}`);
        return null;
    }
    try {
        const res = await fetch(jsonPath, {cache: "no-cache"});
        if (!res.ok) throw new Error(`Failed to load ${jsonPath}: ${res.status}`);
        const data = await res.json();
        const cardEl = buildCardFromData(data);
        mount.appendChild(cardEl);
        return cardEl;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Build the DOM structure for a card from the given data object.
 */
function buildCardFromData(data) {
    const article = document.createElement("article");
    article.className = "Card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "Card-Image";
    article.appendChild(imageContainer);

    const img = document.createElement("img");
    if (data.image?.src) img.src = data.image.src;
    if (data.image?.alt) img.alt = data.image.alt;
    img.className = "HoverScale";
    imageContainer.appendChild(img);

    const ProjectTitleContainer = document.createElement("div");
    ProjectTitleContainer.id = "ProjectTitleContainer";
    article.appendChild(ProjectTitleContainer);

    const h2 = document.createElement("h2");
    h2.textContent = data["project-title"] || "project-title";
    ProjectTitleContainer.appendChild(h2);

    const h3 = document.createElement("h3");
    h3.id = "ProjectTypeWriting";
    h3.innerHTML = data["project-type"] || "project-type";
    ProjectTitleContainer.appendChild(h3);

    const ProjectDataContainer = document.createElement("div");
    ProjectDataContainer.className = "ProjectDataContainer";
    article.appendChild(ProjectDataContainer);

    const ProjectOriginContainer = document.createElement("div");
    ProjectOriginContainer.id = "ProjectOriginContainer";
    ProjectDataContainer.appendChild(ProjectOriginContainer)

    const ProjectOriginName = document.createElement("p");
    ProjectOriginName.innerHTML = data.origin;
    ProjectOriginContainer.appendChild(ProjectOriginName);

    const ProjectOriginIcon = document.createElement("img");
    ProjectOriginIcon.src = "#";
    ProjectOriginContainer.appendChild(ProjectOriginIcon);

    const ProjectTeamSizeIcon = document.createElement("img");
    ProjectTeamSizeIcon.src = "Data/Icons/Group.png";
    ProjectOriginContainer.appendChild(ProjectTeamSizeIcon);

    const ProjectTeamSizeText = document.createElement("p");
    ProjectTeamSizeText.innerHTML = data["team-size"];
    ProjectTeamSizeIcon.appendChild(ProjectTeamSizeText);

    const TagHolder = document.createElement("div");
    TagHolder.className = "TagHolder";
    article.appendChild(TagHolder);

    for(const contribution in data.contributions)
    {
        let newTag = buildTag(contribution);
        TagHolder.appendChild(newTag);
    }

    for (const tool in data.tools)
    {
        let newTag = buildTag (tool);
        TagHolder.appendChild(newTag);
    }

    const LinksContainer = document.createElement("div");
    LinksContainer.className = "LinksContainer";
    article.appendChild(LinksContainer);

    const ProjectPageContainer = document.createElement("div");
    ProjectPageContainer.className = "LinkContainer";
    LinksContainer.appendChild(ProjectPageContainer);

    const ProjectPageImage = document.createElement("img");
    ProjectPageImage.src = "Data/Placeholder-images/nitrome_1.png";
    ProjectPageImage.alt = "Project Page ->";
    ProjectPageContainer.appendChild(ProjectPageImage);

    const MoreInfoContainer = document.createElement("div");
    MoreInfoContainer.className = "LinkContainer";
    LinksContainer.appendChild(MoreInfoContainer);

    const MoreInfoImage = document.createElement("img");
    MoreInfoImage.src = "Data/Placeholder-images/nitrome_2.png";
    MoreInfoImage.alt = "More Info ->";
    MoreInfoContainer.appendChild(MoreInfoImage);

    return article;
}

function buildTag(tagData) {
    var tag = document.createElement("div");
    tag.className = "Tag";

    tag.innerHTML = `<span>${tagData}</span>`; /* +ZyKa need to fill the correct Data into the tag */

    return tag;
}

function capitalize(str) {
    if (!str) return "";
    const s = String(str);
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// Expose functions globally for easy inline use
window.renderProjectCard = renderProjectCard;
window.renderProjectCards = renderProjectCards;
