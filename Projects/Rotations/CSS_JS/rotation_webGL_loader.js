import {embedGame} from "../../../CSS_JS/UnityWebGL/unity-webgl-iframe-creator.js";
import {iFrameHtmlPath} from "../../../CSS_JS/UnityWebGL/unity-webgl-iframe-creator.js";

function initialize()
{
    embedGame(document.querySelector("#unity-webGL-container"),
        {
            iFramePath: iFrameHtmlPath,
            buildPath: "./Content/Build",
            buildName: "WebBuild",
            companyName: "",
            productName: "Rotation_Parameterization_Visualisation",
            productVersion: "1.0.0",
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
