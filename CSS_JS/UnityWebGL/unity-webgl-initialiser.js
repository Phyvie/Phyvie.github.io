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

export function validateUnityWebGLConfig(config) {
    const requiredProperties = [
        "arguments",
        "loader",
        "dataUrl",
        "frameworkUrl",
        "codeUrl",
        "streamingAssetsUrl",
        "companyName",
        "productName",
        "productVersion"
    ];

    // Parse JSON if it's a string
    let jsonObject;
    try {
        jsonObject = typeof config === 'string' ? JSON.parse(config) : config;
    } catch (error) {
        return {
            isValid: false,
            error: "Invalid JSON format",
            missingProperties: []
        };
    }
    // ensure JSON file is an object
    if (typeof jsonObject !== 'object' || jsonObject === null) {
        return {
            isValid: false,
            error: "Input is not a valid object",
            missingProperties: []
        };
    }

    const missingProperties = requiredProperties.filter(prop => !(prop in jsonObject));
    const isValid = missingProperties.length === 0;

    return {
        isValid,
        missingProperties,
        error: isValid ? null : `Missing ${missingProperties.length} required property(ies)`
    };
}

export async function LoadWebGLScriptOntoElement(config, gameContainer)
{
    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = config.loader;

        gameContainer.appendChild(script);

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