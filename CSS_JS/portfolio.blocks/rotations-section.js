import {loadDataRefs, TryLoadJson} from "../common.blocks/load-data-refs.js";
import {createSwitchableContentContainer} from "../common.blocks/switchable_content_container.js";
import HTMLContentCache from "../URL-Fetching-And-Templates/HTMLContentCache.js";

async function initialize()
{
    let bachelor_thesis_section = document.getElementById('rotations')
    let jsonData = await TryLoadJson("./Projects/Rotations/project_data.json");
    loadDataRefs(bachelor_thesis_section, jsonData);

    createSwitchableContentContainer(HTMLContentCache, 'rotations-workflow');
}

if (document.readyState === 'loading')
{
    document.addEventListener('DOMContentLoaded', initialize);
}
else
{
    await initialize();
}
