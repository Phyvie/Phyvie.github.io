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
        throw new Error("embedGame: containerElement is not an HTMLElement; aborting embedGame");
    }
    if (!iFramePath)
    {
        throw new Error("embedGame: iFramePath is null or undefined; aborting embedGame");
    }
    if (!webGLConfig)
    {
        throw new Error("embedGame: webGLConfig is null or undefined; aborting embedGame");
    }
    if (validateUnityWebGLConfig(webGLConfig).isValid !== true)
    {
        throw new Error("embedGame: webGLConfig is invalid; check unity-embed-webGL-iframe.js for a valid config example");
    }

    return new Promise((resolve, reject) => {
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
            resolve(iframe);
        });

        iframe.addEventListener("error", (error) => {
            reject(new Error(`Failed to load iframe: ${error}`));
        })

        containerElement.appendChild(iframe);
        iframe.contentWindow.name = "unityWindow";
    })
}

/* uses postMessage to send the "start-game" message to the iframe;
 * if the game is already started - i.e. gameInstance is not null - the message is ignored
 */
export function startEmbeddedGame(iframe)
{
    const message = {message: "start-game"};
    const origin = window.location.origin;

    // We can't reliably check iframe.contentDocument.readyState for cross-origin iframes.
    // However, if we are on the same origin (which we usually are in this project), we can try.
    // If it fails or if we want to be safe, we can just send the message and also add a load listener.
    
    try {
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(message, origin);
        }
    } catch (e) {
        console.warn("Failed to postMessage to iframe immediately:", e);
    }

    // Always add a load listener just in case it hasn't finished loading yet.
    // The receiver should handle duplicate "start-game" messages gracefully.
    iframe.addEventListener("load", () => {
        iframe.contentWindow.postMessage(message, origin);
    }, { once: true });
}

export const minimalWebGLIFramePath = new URL("./unity-webgl-iframe-minimal.html", import.meta.url).href;
