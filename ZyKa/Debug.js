import {createUnityCanvas, loadUnityTemplate} from "/CSS_JS/common.blocks/unity-webgl.js";

let buildPath = "/Data/Projects/Monster_Match/WebGL_Build";
let buildName = "Build";

function AddUnityCanvasToDebug()
{
    let canvasParent = document.getElementById("debugUnityContainer");
    if (!canvasParent)
    {
        console.error("Failed to find debug element; aborting AddToDebug");
        return;
    }
    let unityCanvasFragment = createUnityCanvas();
    canvasParent.appendChild(unityCanvasFragment);
    let unityCanvas = canvasParent.querySelector("#unity-container");

    // LoadWebGLBuildIntoCanvas(unityCanvas, buildPath, buildName);
}

function LoadWebGLBuildIntoCanvas(canvas, buildPath, buildName = "Build")
{
    if (!canvas)
    {
        console.error("LoadWebGLBuildIntoCanvas: canvas is null or undefined");
        return;
    }
    if (!buildPath || !buildName || buildPath.length === 0 || buildName.length === 0)
    {
        console.error("LoadWebGLBuildIntoCanvas: buildPath or buildName is null or empty");
        return;
    }
    if (!(canvas instanceof HTMLElement))
    {
        console.error("LoadWebGLBuildIntoCanvas: canvas is not an HTML element");
        return;
    }


    let fullPath = `${buildPath}/${buildName}`;
    var config = {
        arguments: [],
        dataUrl: `${fullPath}.data`,
        frameworkUrl: `${fullPath}.framework.js`,
        loader: `${fullPath}.loader.js`,
        codeUrl: `${fullPath}.wasm`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "ZyKaCompany",
        productName: "deBuggy",
        productVersion: "1.0",
        showBanner: function(){}, //!ZyKa Unity Banner
    };

    //+ZyKa UnityWebGL CSS
    canvas.querySelector("#unity-loading-bar").style.display = "block";

    var script = document.createElement("script");
    script.src = config.loader;
    script.onload = () =>
    {
        createUnityInstance(
            canvas, config,
            (progress) => { document.querySelector("#unity-progress-bar-full").style.width = 100 * progress + "%"; }
        )
        .then((unityInstance) =>
        {
            document.querySelector("#unity-loading-bar").style.display = "none";
            document.querySelector("#unity-fullscreen-button").onclick = () =>
            {
                unityInstance.SetFullscreen(1);
            };
        })
        .catch((message) => { alert(message); });
    }

    canvas.appendChild(script);
}

async function initializeOnce()
{
    const unityTemplate = await loadUnityTemplate();
    if (!unityTemplate)
    {
        console.error("Failed to load Unity WebGL template");
        return;
    }

    await AddUnityCanvasToDebug();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnce);
}
else
{
    initializeOnce();
}