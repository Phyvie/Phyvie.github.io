import {gameInstance} from "../../../CSS_JS/UnityWebGL/unity-webgl-iframe-connector-minimal.js";

let fullscreenButton = document.getElementById("unity-fullscreen-button");

export function SetupFullscreenButton()
{
    if (!fullscreenButton)
    {
        throw new Error("Failed to find fullscreen button");
    }
    fullscreenButton.addEventListener("click", () => {
        gameInstance.SetFullscreen(1);
    })
    fullscreenButton.style.display = "block";
}

export function initialize()
{
    if (fullscreenButton)
    {
        SetupFullscreenButton();
    }
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    initialize();
}
