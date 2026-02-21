/* Creates an iframe which can hold a unity web-gl build
 *
 * purpose:
 * - reusable to embed multiple unity-webGL-games by a single function-call
 *
 * responsibilities:
 * - create an iframe-element
 * - pass the game-config into the iframe (currently as 'data-game-config' attribute)
 *
 * usage:
 * - call embedGame(containerElement, config) to create an iframe that holds a unity-webGL-build
 * - config should include: buildPath, buildName, companyName, productName, productVersion
 * example:
 * - embedGame(document.querySelector("#name_of_container_element"),
      {
          "arguments": [],
          "dataUrl": "./Build/WebBuild.data",
          "frameworkUrl": "./Build/WebBuild.framework.js",
          "codeUrl": "./Build//WebBuild.wasm",
          "streamingAssetsUrl": "StreamingAssets",
          "companyName": "",
          "productName": "Rotation_Parametrization_Visualiser",
          "productVersion": "1.0.0"
      })
 *
 * connections:
 * - HTML-document that can load webgl (default: unity-webgl-iframe-minimal.html)
 */

import {validateUnityWebGLConfig} from "./unity-webgl-initialiser.js";

export function embedWebGLIFrame(containerElement, iFramePath, webGLConfig)
{
    if (!containerElement || !(containerElement instanceof HTMLElement))
    {
        console.error("embedGame: containerElement is not an HTMLElement; aborting embedGame");
        return;
    }
    if (!iFramePath)
    {
        console.error("embedGame: iFramePath is null or undefined; aborting embedGame");
        return;
    }
    if (!webGLConfig)
    {
        console.error("embedGame: webGLConfig is null or undefined; aborting embedGame");
        return;
    }
    if (validateUnityWebGLConfig(webGLConfig).isValid !== true)
    {
        // !!!ZyKa WebGLBuild: need to validate the URL's & a proper error message if they are wrong
        console.error("embedGame: webGLConfig is invalid; check unity-embed-webGL-iframe.js for a valid config example");
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = iFramePath;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.webGLConfig = webGLConfig;

    if (containerElement.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim() !== '')
    {
        console.warn('embedGame: containerElement is not empty; existing content will be removed: \n ' + containerElement.innerHTML + '\n');
        containerElement.innerHTML = '';
    }

    // alternative version of passing the config via attribute; kept because I don't know whether the website host accepts postMessage & addEventListener("message", ...)
    // iframe.setAttribute('data-game-config', JSON.stringify(webGLConfig));

    iframe.addEventListener("load", () => {
        iframe.contentWindow.postMessage({message: "initialise", webGLConfig: webGLConfig}, window.location.origin);
    });

    containerElement.appendChild(iframe);
    iframe.contentWindow.name = "unityWindow";

    return iframe;
    //anything further regarding the loading of the game happens via the .js-script inside the created iframe; (default .js-script: unity-webgl-into-html-loader)
}

export function startEmbeddedGame(iframe)
{
    iframe.contentWindow.postMessage({message: "start-game"}, window.location.origin);
}

export const minimalWebGLIFramePath = new URL("./unity-webgl-iframe-minimal.html", import.meta.url).href;

/*
 * An example of how to use this class in another script; copy the code into your script and adjust the config values
 */
function exampleEmbedding(){
    let gameFrame_Spin_Hook = embedWebGLIFrame(document.querySelector("#name_of_container_element"),
        {
            "arguments": [],
            "dataUrl": "./Build/WebBuild.data",
            "loader": "./Build/WebBuild.loader.js",
            "frameworkUrl": "./Build/WebBuild.framework.js",
            "codeUrl": "./Build//WebBuild.wasm",
            "streamingAssetsUrl": "StreamingAssets",
            "companyName": "",
            "productName": "Rotation_Parametrization_Visualiser",
            "productVersion": "1.0.0"
    });
}
