/* Bridge between unity-webgl-iframe-minimal.html and the generic unity-webgl-initialiser.js
 *
 * purpose: keep unity-webgl-iframe-minimal.html free of javascript and unity-webgl-initialiser.js independent of the DOM-structure
 *
 * Key Responsibilities:
 * - get the game config from the parent iframe
 * - query the unity-webgl-iframe-minimal.html for elements in order to call unity-webgl-initialiser.js functions
 */

import {
    LoadWebGLScriptOntoElement,
    LoadAndStartWebGLGame, unityShowBanner,
} from "./unity-webgl-initialiser.js";

let webGLConfig;
let gameCanvas = document.querySelector("#unity-canvas");
let loadingContainer = document.querySelector("#unity-loading-bar");
let progressBar = document.querySelector("#unity-progress-bar-full");
let gameInstance;

/* alternative version of loading the config from the iframe via the attribute; kept because I don't know whether the website host accepts postMessage & addEventListener("message", ...)
function LoadConfigDataFromFrameIntoObject()
{
    try
    {
        //Method1: Try accessing the iframe element directly
        if (!window)
        {
            throw new Error("Failed to get game config from parent iframe: window is null");
        }
        if (!window.frameElement)
        {
            throw new Error("Failed to get game config from parent iframe: window.frameElement is null");
        }

        const configJson = window.frameElement.getAttribute("data-game-config");

        if (!configJson)
        {
            throw new Error("Failed to get game config from parent iframe: data-game-config attribute is missing");
        }

        webGLConfig = JSON.parse(configJson);
        webGLConfig.showBanner = (msg, type) => {unityShowBanner(document.querySelector("#unity-warning"), msg, type)};
    }
    catch (error)
    {
        console.error("Failed to get game config from parent iframe: \n", error);
        return null;
    }
}
*/

export async function StartWebGLGame()
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
}

/* region deprecated */
/* alternative version to initialise via the attributes; kept because I don't know whether the website host accepts postMessage & addEventListener("message", ...)
async function oldInitialise()
{
    try {
        LoadConfigDataFromFrameIntoObject();
        if (!webGLConfig)
        {
            console.error("Failed to get game config from parent iframe");
            return;
        }
        await LoadWebGLIntoHTML();
    }
    catch (error) {
        console.error("Failed to initialise WebGL game: ", error);
    }
}
*/

window.addEventListener("message", async (event) =>
{
    if (event.origin !== window.location.origin)
    {
        console.error("Received message from origin '" + event.origin + "' instead of '" + window.location.origin + "'. Aborting message handling.");
        return;
    }

    switch (event.data.message)
    {
        case "initialise":
            console.log("initialise message received");
            console.log(event.data.webGLConfig);
            webGLConfig = event.data.webGLConfig;
            await LoadWebGLScriptOntoElement(webGLConfig, gameCanvas);
            break;
        case "start-game":
            await StartWebGLGame();
            break;
        default:
            console.error("Received unknown message: " + event.data.message);
            break;
    }
});