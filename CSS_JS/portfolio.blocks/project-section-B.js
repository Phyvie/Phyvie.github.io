import {createExternalHTMLContainer} from "../templates_and_external_containers/external-html-container.js";

document.addEventListener('DOMContentLoaded', async function () {
    await createExternalHTMLContainer('highlight-section-B-workflow', 'project-section-B');
})