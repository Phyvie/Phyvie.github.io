var TEMPLATE_PROJECT_CARD = null;
var TEMPLATE_PROJECT_TAG = null;

function loadTemplates() {
    TEMPLATE_PROJECT_CARD = document.getElementById("template-project-card");
    TEMPLATE_PROJECT_TAG = document.getElementById("template-project-tag");
}

/**
 * Render a single project card by project name (without .json).
 * Example: renderProjectCard("LoneSignal", "#project-cards")
 */
async function renderProjectCard(projectName, mountSectionName, options = {}) {
  const basePath = options.basePath || "Data/Projects";
  const jsonPath = `${basePath}/${projectName}.json`;

  const card = createCardFromTemplate();
  card.id = projectName;
  const mount = document.querySelector(mountSectionName);
  if (mount) {
      mount.appendChild(card);
  } else {
      console.error(`Failed to mount card to ${mountSectionName}`);
  }

  try {
    const data = await loadJsonData(jsonPath);
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

/**
 * Helper Functions
 */
function qRef(cardRoot, ref) {
    return cardRoot.querySelector(`[data-ref="${ref}"]`);
}

function setIconOrText(container, iconName) {
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

function createTagFromTemplate(content) {
    const fragment = TEMPLATE_PROJECT_TAG.content.cloneNode(true);
    const tagRoot = fragment.querySelector("div.Tag");
    if (!tagRoot) {
        throw new Error("Template missing div.Tag");
    }
    return tagRoot;
}

/**
 * load the .json-file and return the object
 */
async function loadJsonData(path) {
    if (!path || typeof path !== "string") {
        throw new Error("loadJsonData: 'path' must be a non-empty string");
    }
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) {
        throw new Error(`Failed to load JSON at ${path}: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}

/**
 * Create a new instance of a Card and return it so that it can be appended to the DOM.
 */
function createCardFromTemplate() {
    const fragment = TEMPLATE_PROJECT_CARD.content.cloneNode(true);
    const cardRoot = fragment.querySelector("article.Card");
    if (!cardRoot) {
        throw new Error("Template missing article.Card");
    }
    return cardRoot;
}

/**
 * Fill the card with the data from the .json-file
 */
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

// Load image and title
function loadImageAndTitle(cardRoot, jsonData) {
    // Image
    const img = qRef(cardRoot, "image");
    if (img) {
        if (jsonData?.image?.src)
        {
            img.src = jsonData.image.src;
        }
        img.alt = jsonData?.image?.alt || img.alt || "";

        console.log(`image loaded for ${cardRoot.id}: ${img.src}}`); //!ZyKa
    }

    // Title (h2) and Type (h3)
    const title = qRef(cardRoot, "title");
    if (title) {
        title.textContent = jsonData?.["project-title"] || "project-title";
    }

    const type = qRef(cardRoot, "type");
    if (type) {
        type.textContent = jsonData?.["project-type"] || "project-type";
    }
}

// Video
function loadVideo(cardRoot, jsonData) {
  const vid = qRef(cardRoot, "video");
  if (!vid) return;
  const v = jsonData?.["project-video"];
  const src = typeof v === "string" ? v : v?.src;
  if (src) vid.src = src;
}

function wireImageToVideo(cardRoot) {
    const img = qRef(cardRoot, "image");
    const vid = qRef(cardRoot, "video");
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
            p.catch(() => {});
        }
    });

    // Optional: when the video ends, swap back to the image
    vid.addEventListener("ended", () => {
        img.style.display = "block";
        vid.style.display = "none";
        img.classList.add("HoverScale");
    });
}

// Origin
function loadOrigin(cardRoot, jsonData) {
    const origin = qRef(cardRoot, "origin");
    if (origin) {
        setIconOrText(origin, jsonData?.origin);
    }
}

// Date/Time
function loadDateTime(cardRoot, jsonData) {
  const date = qRef(cardRoot, "date");
  if (date) {
      date.textContent = jsonData?.date;
  }
  const time = qRef(cardRoot, "time");
  if (time) {
      time.textContent = jsonData?.time;
  }
}

// Team size
function loadTeamSize(cardRoot, jsonData) {
  const teamIcon = qRef(cardRoot, "teamIcon");
  const teamSizeText = qRef(cardRoot, "teamSize");

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

// Tags (tools)
function loadTags(cardRoot, jsonData) {
  const tags = cardRoot.querySelector("#ProjectTagContainer");
  if (!tags || !Array.isArray(jsonData?.tools)) return;
  jsonData.tools.forEach((t) => {
      let newTag = createTagFromTemplate();
      setIconOrText(newTag, t);
      tags.appendChild(newTag);
  });
}

// Links
function loadLinks(cardRoot, jsonData) {
  const pageLink = qRef(cardRoot, "projectPageLink");
  if (pageLink && jsonData?.["project-url"]) {
    pageLink.href = jsonData["project-url"];
  }

  const moreInfoLink = qRef(cardRoot, "moreInfoLink");
  if (moreInfoLink && jsonData?.["project-info-url"]) {
    moreInfoLink.href = jsonData["project-info-url"];
  }
}

