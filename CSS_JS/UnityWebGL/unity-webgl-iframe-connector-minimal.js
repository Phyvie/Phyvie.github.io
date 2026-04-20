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

export let webGLConfig;
export let gameInstance;

export let gameCanvas = document.getElementById("unity-canvas");
export let loadingBarContainer = document.getElementById("unity-loading-bar");
export let progressBar = document.getElementById("unity-progress-bar-full");

export async function StartWebGLGame(restart = false)
{
    if (gameInstance && !restart)
    {
        return;
    }

    LoadAndStartWebGLGame(
        gameCanvas, webGLConfig,
        (progress) => {
            if (progressBar != null) {
                progressBar.style.width = 100 * progress + "%";
            }
        },
        (unityInstance) => {
            loadingBarContainer.style.display = "none";
            gameInstance = unityInstance;
        }
    )
}

// alternative version to initialise via the attributes; kept because I don't know whether the website host accepts postMessage & addEventListener("message", ...)
// async function oldInitialise()
// {
//     try {
//         LoadConfigDataFromFrameIntoObject();
//         if (!webGLConfig)
//         {
//             console.error("Failed to get game config from parent iframe");
//             return;
//         }
//         await LoadWebGLIntoHTML();
//     }
//     catch (error) {
//         console.error("Failed to initialise WebGL game: ", error);
//     }
// }

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
            webGLConfig = event.data.webGLConfig;
            await LoadWebGLScriptOntoElement(webGLConfig, gameCanvas);
            window.isWebGLScriptInitialised = true;
            window.postMessage({message: "WebGLScriptInitialised"}, window.location.origin);

            break;
        case "WebGLScriptInitialised":
            if (window.autoStartWebGLBuild)
            {
                await StartWebGLGame();
            }
            break;
        case "start-game":
            if (window.isWebGLScriptInitialised)
            {
                await StartWebGLGame();
            }
            else
            {
                window.autoStartWebGLBuild = true;
            }
            break;
        case "fullscreen":
            if (gameInstance == null)
            {
                return;
            }
            gameInstance.SetFullscreen(1);
            break;
        default:
            console.error("Received unknown message: " + event.data.message);
            break;
    }
});