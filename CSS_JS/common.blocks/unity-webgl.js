import { findTemplateInDocument, addTemplateToDocument, createFromTemplate } from '/CSS_JS/common.blocks/template-manager.js';

let TEMPLATE_UNITY_WEBGL;
let templatePath = "/Data/UnityWebGLTemplate/unity-canvas.html";
let templateId = 'template--unity-canvas';

export async function loadUnityTemplate() {
    if (TEMPLATE_UNITY_WEBGL) {
        console.warn("Unity template already loaded; aborting second load");
        return TEMPLATE_UNITY_WEBGL;
    }

    TEMPLATE_UNITY_WEBGL = await findTemplateInDocument(
        templatePath,
        templateId
    );

    if (!TEMPLATE_UNITY_WEBGL)
    {
        throw new Error("Failed to load Unity WebGL template");
    }

    addTemplateToDocument(TEMPLATE_UNITY_WEBGL);
    return TEMPLATE_UNITY_WEBGL;
}

export function createUnityCanvas() {
    return createFromTemplate(TEMPLATE_UNITY_WEBGL);
}
