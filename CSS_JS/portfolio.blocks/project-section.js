export function toggleWorkflowSectionVisibility(workflow_section_id){
    document.getElementById(workflow_section_id).classList.toggle('project-section__workflow--collapsed');
}

export function scrollIFrameToPosition(iframe_id, scroll_id){
    const iframe = document.getElementById(iframe_id);
    if (!iframe)
    {
        console.error("scrollIFrameToPosition: iframe with id " + iframe_id + " not found");
        return;
    }
    const iframe_document = iframe.contentWindow.document;
    if (!iframe_document)
    {
        console.error("scrollIFrameToPosition: iframe_document not found");
        return;
    }
    
    const scroll_element = iframe_document.getElementById(scroll_id);
    if (!scroll_element)
    {
        console.error("scrollIFrameToPosition: scroll_element with id " + scroll_id + " not found");
        return;
    }

    iframe.contentWindow.scrollTo(scroll_element.offsetLeft, scroll_element.offsetTop);
}

// TODOZyKa project-section: remove the setting of functions to window; these should only be accessed via another script
window.toggleWorkflowSectionVisibility = toggleWorkflowSectionVisibility;
window.scrollIFrameToPosition = scrollIFrameToPosition;