import {loadDataRefs, TryLoadJson} from "../common.blocks/load-data-refs.js";
import {createSwitchableContentContainer} from "../common.blocks/SwitchableContentContainer.js";
import HTMLContentCache from "../templates_and_external_containers/HTMLContentCache.js";

document.addEventListener('DOMContentLoaded', async () => {
    let bachelor_thesis_section = document.querySelector('#bachelor-thesis');
    let jsonData = await TryLoadJson("/Data/Projects/Rotation_Parameterizations/project_data.json");
    loadDataRefs(bachelor_thesis_section, jsonData);
}, {once: true});

document.addEventListener('DOMContentLoaded', () => {
    createSwitchableContentContainer(HTMLContentCache, 'rotations-workflow');
})