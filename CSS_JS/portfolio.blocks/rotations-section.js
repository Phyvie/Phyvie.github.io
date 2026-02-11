import {loadDataRefs, TryLoadJson} from "../common.blocks/load-data-refs.js";
import {createSwitchableContentContainer} from "../common.blocks/switchable_content_container.js";
import HTMLContentCache from "../templates_and_external_containers/HTMLContentCache.js";
import {embedGame} from "../UnityWebGL/unity-webgl-iframe-creator.js";

async function initialize()
{
    let bachelor_thesis_section = document.getElementById('rotations')
    let jsonData = await TryLoadJson("/Projects/Rotations/project_data.json");
    loadDataRefs(bachelor_thesis_section, jsonData);

    createSwitchableContentContainer(HTMLContentCache, 'rotations-workflow');
    embedGame(document.querySelector("#rotations").querySelector('.project-section__media'),
        {
            iFramePath: "CSS_JS/UnityWebGL/unity-webgl-iframe.html",
            buildPath: "./Projects/Rotations/Content/Build",
            buildName: "WebBuild",
            companyName: "",
            productName: "Rotation_Parameterization_Visualisation",
            productVersion: "1.0.0",
        })
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    await initialize();
}
