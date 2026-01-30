/* Generic WebGL Initialiser
 * provides generic functions that connect webgl with html via the parameters passed into the functions
 *
 * purpose: be independent of any .html queries, such that it can be used with any .html-DOM-structure
 *
 * Key Responsibilities:
 * - create a webGL-config from given parameters
 * - adds banner-functionality, that is passed into the config and in turn to the webGL script
 * - load a loader.js script into a given context
 * - provide "LoadAndStartWebGLGame" function as a proxy to loader.js::createUnityInstance
 */

export function createWebGLConfig(buildPath, buildName, companyName, productName, productVersion, bannerFunction) {
    if (!buildPath || !buildName || buildPath.length === 0 || buildName.length === 0) {
        console.error("createWebGLConfig: buildPath or buildName is null or empty");
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
        companyName: companyName,
        productName: productName,
        productVersion: productVersion,
        showBanner: bannerFunction
    };
    return config;
}

export function unityShowBanner(warningBanner, msg, type) {
    if (!warningBanner)
    {
        console.warn("unityShowBanner: warningBanner is null or undefined; aborting unityShowBanner");
        return;
    }

    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }

    const div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error')
    {
        div.style = 'background: red; padding: 10px;';
    }
    else {
        if (type == 'warning')
        {
            div.style = 'background: yellow; padding: 10px;';
        }
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

export async function PutWebGLGameOntoElement(config, gameCanvas)
{
    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = config.loader;
        
        gameCanvas.appendChild(script);

        script.onload = resolve;
        script.onerror = reject;
    })
}

export function updateLoadingBar(progress, loadingBar) {
    loadingBar.style.width = 100 * progress + "%";
}

export function LoadAndStartWebGLGame(canvas, config, loadingProgressFunction, postLoadFunction) {
    createUnityInstance(canvas, config, loadingProgressFunction)
        .then(postLoadFunction)
        .catch((message) => {alert(message); });
}