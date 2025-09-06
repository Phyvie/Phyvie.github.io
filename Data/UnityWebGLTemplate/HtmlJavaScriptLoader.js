var buildUrl = "../../Rotations/RotationsBuild"; //+ZyKa figure out how I can set the buildUrl via the html-file
var loadedUrl = buildUrl + "/WebBuild.loader.js";

var config = {
    arguments: [],
    dataUrl: buildUrl + "/WebBuild.data",
    frameworkUrl: buildUrl + "/WebBuild.framework.js",
    codeUrl: buildUrl + "/WebBuild.wasm",
    streamingAssetsUrl: "StreamingAssets", //+ZyKa this seems like it is not the correct URL
    companyName: "DefaultCompany",
    productName: "Unity WebGL Player",
    productVersion: "1.0",
    showBanner: unityShowBanner, //this requires the function unityShowBanner to be defined beforehand
}

var canvas = document.querySelector("#unity-canvas");
var script = document.createElement("script");

function unityShowBanner() {
    //!ZyKa understand this function
}

function CheckPhone() {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:

        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
        document.querySelector("#unity-container").className = "unity-mobile";
        canvas.className = "unity-mobile";

        // To lower canvas resolution on mobile devices to gain some
        // performance, uncomment the following line:
        // config.devicePixelRatio = 1;


    } else {
        canvas.style.width = "960px"; //+ZyKa the size should be stored in the html or css, but not here
        canvas.style.height = "600px";
    }
}

function LoadWebGL()
{
    script.src = loadedUrl; //+ZyKa this only makes sense if loadedUrl is correctly set
    script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {

        });
    }
}

