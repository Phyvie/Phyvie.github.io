import {createSwitchableContentContainer} from "../CSS_JS/common.blocks/switchable_content_container.js";
import HTMLContentCache from "../CSS_JS/templates_and_external_containers/HTMLContentCache.js";

let ContentContainerA = createSwitchableContentContainer(HTMLContentCache, "debug-foldout-A");
let ContentContainerB = createSwitchableContentContainer(HTMLContentCache, "debug-foldout-B");