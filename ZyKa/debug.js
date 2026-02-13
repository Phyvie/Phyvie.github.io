import {createSwitchableContentContainer} from "../CSS_JS/common.blocks/switchable_content_container.js";
import HTMLContentCache from "../CSS_JS/URL-Fetching-And-Templates/HTMLContentCache.js";

let ContentContainerA = createSwitchableContentContainer(HTMLContentCache, "debug-foldout-A");
let ContentContainerB = createSwitchableContentContainer(HTMLContentCache, "debug-foldout-B");