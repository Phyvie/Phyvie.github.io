/* Bridge between unity-webgl-iframe.html and the generic unity-webgl-initialiser.js
 *
 * purpose: keep unity-webgl-iframe.html free of javascript and unity-webgl-initialiser.js independent of the DOM-structure
 *
 * Key Responsibilities:
 * - get the game config from the parent iframe
 * - query the unity-webgl-iframe.html for elements in order to call unity-webgl-initialiser.js functions
 */

import {
    createWebGLConfig,
    PutWebGLGameOntoElement,
    LoadAndStartWebGLGame, unityShowBanner,
} from "./unity-webgl-initialiser.js";

function GetConfigFromParent()
{
    try
    {
        //Method1: Try accessing the iframe element directly
        if (window.frameElement)
        {
            const configJson = window.frameElement.getAttribute("data-game-config");
            if (configJson)
            {
                return JSON.parse(configJson);
            }
        }
    }
    catch (error)
    {
        console.error("Failed to get game config from parent iframe: ", error);
        return null;
    }
}

async function LoadWebGLIntoHTML(buildPath, buildName, companyName, productName, productVersion)
{
    let webGLConfig =
        createWebGLConfig(
            buildPath, buildName, companyName, productName, productVersion,
            (msg, type) => {unityShowBanner(document.querySelector("#unity-warning"), msg, type)}
        );
    let gameCanvas = document.querySelector("#unity-canvas");

    let loadingContainer = document.querySelector("#unity-loading-bar");
    let progressBar = document.querySelector("#unity-progress-bar-full");

    let playButton = document.querySelector("#unity-play-button");
    let fullscreenButton = document.querySelector("#unity-fullscreen-button");

    await PutWebGLGameOntoElement(webGLConfig, gameCanvas);

    let gameInstance;
    playButton.onclick = () =>
    {
        LoadAndStartWebGLGame(
            gameCanvas, webGLConfig,
            (progress) => {
                progressBar.style.width = 100 * progress + "%";
            },
            (unityInstance) => {
                loadingContainer.style.display = "none";
                gameInstance = unityInstance;
            }
        )
    };

    fullscreenButton.onclick = () => {
        gameInstance.SetFullscreen(1);
    };
}

async function initialise()
{
    try {
        const config = GetConfigFromParent();
        if (!config)
        {
            console.error("Failed to get game config from parent iframe");
            return;
        }
        await LoadWebGLIntoHTML(config.buildPath, config.buildName, config.companyName, config.productName, config.productVersion);
    }
    catch (error) {
        console.error("Failed to initialise WebGL game: ", error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
}
else
{
    await initialise();
}