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
 *     {
 *         iFramePath: "CSS_JS/UnityWebGL/unity-webgl-iframe.html", //or another .html-file which includes the necessities to load a webgl-game
 *         buildPath: "./Path/To/Build_Data",
 *         buildName: "Name_of_the_four_build_files", //e.g. "Build" for Build.data, Build.framework.js, Build.loader.js, Build.wasm
 *         companyName: "Company_Name",
 *         productName: "Product_Name",
 *         productVersion: "0.0.0",
 *     })
 *
 * connections:
 * - HTML-document that can load webgl (default: unity-webgl-iframe.html)
 */

export function embedGame(containerElement, config)
{
    const iframe = document.createElement('iframe');
    iframe.src = config.iFramePath;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    if (containerElement.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim() !== '')
    {
        console.warn('embedGame: containerElement is not empty; existing content will be removed: \n ' + containerElement.innerHTML + '\n');
        containerElement.innerHTML = '';
    }

    const baseUrl = window.location.href;
    const relativeUrl = config.buildPath;
    const absoluteBuildPath = new URL(relativeUrl, baseUrl).href;

    iframe.setAttribute('data-game-config', JSON.stringify({
        buildPath: absoluteBuildPath,
        buildName: config.buildName,
        companyName: config.companyName,
        productName: config.productName,
        productVersion: config.productVersion
    }));

    containerElement.appendChild(iframe);
    iframe.contentWindow.name = "unityWindow";

    return iframe;
    //anything further regarding the loading of the game happens via the .js-script inside the created iframe; (default .js-script: unity-webgl-into-html-loader)
}

export const iFrameHtmlPath = new URL("./unity-webgl-iframe.html", import.meta.url).href;

/*
 * An example of how to use this class in another script; copy the code into your script and adjust the config values
 */
function exampleEmbedding(){
    let gameFrame_Spin_Hook = embedGame(document.querySelector("#name_of_container_element"),
        {
            iFramePath: "CSS_JS/UnityWebGL/unity-webgl-iframe.html", //or another .html-file which includes the necessities to load a webgl-game
            buildPath: "./Path/To/Build_Data",
            buildName: "Name_of_the_four_build_files", //e.g. "Build" for Build.data, Build.framework.js, Build.loader.js, Build.wasm
            companyName: "Company_Name",
            productName: "Product_Name",
            productVersion: "0.0.0",
        })
}