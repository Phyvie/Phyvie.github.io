import {gameInstance} from "../unity-webgl-iframe-connector-minimal.js";

const fullscreenButton = document.getElementById("unity-fullscreen-button");

async function initialize()
{
    fullscreenButton.addEventListener("click", () => {
        if (gameInstance != null)
        {
            gameInstance.SetFullscreen(1);
        }
    })
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    await initialize();
}