import {embedWebGLIFrame, startEmbeddedGame} from "../unity-embed-webGL-iframe.js";

async function initialize()
{
    let webGLIFrame = await embedWebGLIFrame( //embedWebGLIFrame creates the iframe and loads the WebGLLoading script into it, but does not call to start the game
        document.getElementById('example_webGL_embedding'), //where the iframe containing the webGL-build will be inserted
        new URL("./_example-iframe.html", import.meta.url).href, //location of the html-document that is loaded into the iframe (default: unity-webgl-iframe-minimal.html). The used iframe has to contain a script that automatically loads the webGL-build (default: unity-webgl-iframe-connector-minimal.js). Any further functionality such as a fullscreen-button can be added to the html-document via an extra js-script that imports from unity-webgl-iframe-connector-minimal.js.
        { //the config where the webGL-files are located
        "arguments": [],
        "dataUrl": "./Build/WebBuild.data",
        "loader": "./Build/WebBuild.loader.js",
        "frameworkUrl": "./Build/WebBuild.framework.js",
        "codeUrl": "./Build//WebBuild.wasm",
        "streamingAssetsUrl": "StreamingAssets",
        "companyName": "",
        "productName": "example_webGL_build",
        "productVersion": "1.0.0"
    });

    startEmbeddedGame(webGLIFrame);
}


if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    await initialize();
}