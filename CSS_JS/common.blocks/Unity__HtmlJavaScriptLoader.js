/* config for loading a WebGL build;
 * TODO: separate this into two scripts, one which is only responsible for loading a WebGL build into a given element and any number of other scripts, which are the ones for a given context (e.g. a project card) that call this script
 */
var selfScript = document.currentScript;
var buildUrl = selfScript?.dataset?.buildurl ?? "";
var buildName = selfScript?.dataset?.buildname ?? "";
var loaderUrl = `${buildUrl}/${buildName}.loader.js`;
var config = {
    arguments: [],
    dataUrl: `${buildUrl}/${buildName}.data`,
    frameworkUrl: `${buildUrl}/${buildName}.framework.js`,
    codeUrl: `${buildUrl}/${buildName}.wasm`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Rotations",
    productVersion: "1.0",
    showBanner: unityShowBanner,
};

var unityGameInstance = null;

function unityShowBanner(msg, type) {
    var warningBanner = document.querySelector("#unity-warning");

    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }

    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

function LoadScript(queryParent)
{
    queryParent.querySelector("#unity-loading-bar").style.display = "block";

    var script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
            document.querySelector("#unity-progress-bar-full").style.width = 100 * progress + "%";
        }).then((unityInstance) => {
            document.querySelector("#unity-loading-bar").style.display = "none";
            document.querySelector("#unity-fullscreen-button").onclick = () => {
                unityInstance.SetFullscreen(1);
                unityGameInstance = unityInstance;
            };

        }).catch((message) => {
            alert(message);
        });
    };

    document.body.appendChild(script);
}

export function LoadWebGLBuild(parentElement, buildPath, buildName = 'Build')
{
    var canvas = document.querySelector("#unity-canvas");

    LoadScript();
}

/* region DEPRECATED
// 0ZyKa Deprecated, this function does some CSS styling, which I don't need, because I'm doing my own CSS styling
function CheckPhone(parentElement, queryParent)
{
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:

        //0ZyKa What is the 'meta' element here needed for?
        var meta = document.createElement('meta');
        queryParent.getElementsByTagName('head')[0].appendChild(meta);
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        queryParent.querySelector("#unity-container").className = "unity-mobile";
        parentElement.className = "unity-mobile";

        // To lower canvas resolution on mobile devices to gain some
        // performance, uncomment the following line:
        // config.devicePixelRatio = 1;
    } else {
        // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:
        parentElement.style.width = "960px";
        parentElement.style.height = "600px";
    }
}
*/