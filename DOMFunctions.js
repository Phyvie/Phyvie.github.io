export function ReturnElementOrGetById(Identifier){
    if (typeof(Identifier) === 'string')
    {
        Identifier = document.getElementById(Identifier);
    }
    if (!(Identifier instanceof HTMLElement))
    {
        console.log("ReturnElementOrGetById: Invalid Identifier: " + Identifier + " expected element or string - returning null");
    }
    return Identifier;
}

/* region DOM Query Traversal Utilities */
/**
 * Checks ONLY siblings of the reference element (no descendants)
 * This is equivalent to checking parent.children but with filtering
 */
export function findAmongSiblings(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) {
        console.warn('Invalid reference element');
        return null;
    }

    const { excludeSelf = true } = options;

    if (!referenceEl.parentElement) return null;

    const siblings = Array.from(referenceEl.parentElement.children);

    for (const sibling of siblings) {
        if (excludeSelf && sibling === referenceEl) continue;
        if (sibling.matches?.(selector)) {
            return sibling;
        }
    }

    return null;
}

/**
 * Returns ALL siblings of the reference element that match the selector
 */
export function findAllAmongSiblings(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) return [];

    const { excludeSelf = true } = options;
    const results = [];

    if (!referenceEl.parentElement) return results;

    const siblings = Array.from(referenceEl.parentElement.children);

    for (const sibling of siblings) {
        if (excludeSelf && sibling === referenceEl) continue;
        if (sibling.matches?.(selector)) {
            results.push(sibling);
        }
    }

    return results;
}

/**
 * Checks ONLY descendants of siblings (sibling children)
 */
export function findAmongSiblingDescendants(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) {
        console.warn('Invalid reference element');
        return null;
    }

    const { excludeSelf = true } = options;

    if (!referenceEl.parentElement) return null;

    const siblings = Array.from(referenceEl.parentElement.children);

    for (const sibling of siblings) {
        if (excludeSelf && sibling === referenceEl) continue;
        const descendant = sibling.querySelector?.(selector);
        if (descendant) return descendant;
    }

    return null;
}

/**
 * Returns ALL descendants of siblings that match the selector
 */
export function findAllAmongSiblingDescendants(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) return [];

    const { excludeSelf = true } = options;
    const results = new Set();

    if (!referenceEl.parentElement) return [];

    const siblings = Array.from(referenceEl.parentElement.children);

    for (const sibling of siblings) {
        if (excludeSelf && sibling === referenceEl) continue;
        sibling.querySelectorAll?.(selector).forEach(el => results.add(el));
    }

    return Array.from(results);
}

/**
 * Checks ONLY uncles/aunts (siblings of parent)
 */
export function findAmongUncles(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) {
        console.warn('Invalid reference element');
        return null;
    }

    const { excludeParent = true } = options;

    if (!referenceEl.parentElement?.parentElement) return null;

    const parent = referenceEl.parentElement;
    const parentSiblings = Array.from(parent.parentElement.children);

    for (const parentSibling of parentSiblings) {
        if (excludeParent && parentSibling === parent) continue;
        if (parentSibling.matches?.(selector)) {
            return parentSibling;
        }
    }

    return null;
}

/**
 * Returns ALL uncles/aunts that match the selector
 */
export function findAllAmongUncles(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) return [];

    const { excludeParent = true } = options;
    const results = [];

    if (!referenceEl.parentElement?.parentElement) return results;

    const parent = referenceEl.parentElement;
    const parentSiblings = Array.from(parent.parentElement.children);

    for (const parentSibling of parentSiblings) {
        if (excludeParent && parentSibling === parent) continue;
        if (parentSibling.matches?.(selector)) {
            results.push(parentSibling);
        }
    }

    return results;
}

/**
 * Checks ONLY descendants of uncles/aunts (children of parent siblings)
 */
export function findAmongUncleDescendants(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) {
        console.warn('Invalid reference element');
        return null;
    }

    const { excludeParent = true } = options;

    if (!referenceEl.parentElement?.parentElement) return null;

    const parent = referenceEl.parentElement;
    const parentSiblings = Array.from(parent.parentElement.children);

    for (const parentSibling of parentSiblings) {
        if (excludeParent && parentSibling === parent) continue;
        const descendant = parentSibling.querySelector?.(selector);
        if (descendant) return descendant;
    }

    return null;
}

/**
 * Returns ALL descendants of uncles/aunts that match the selector
 */
export function findAllAmongUncleDescendants(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) return [];

    const { excludeParent = true } = options;
    const results = new Set();

    if (!referenceEl.parentElement?.parentElement) return [];

    const parent = referenceEl.parentElement;
    const parentSiblings = Array.from(parent.parentElement.children);

    for (const parentSibling of parentSiblings) {
        if (excludeParent && parentSibling === parent) continue;
        parentSibling.querySelectorAll?.(selector).forEach(el => results.add(el));
    }

    return Array.from(results);
}

/**
 * Searches in order with configurable steps:
 * 1. Ancestors
 * 2. Siblings
 * 3. Sibling children
 * 4. Uncles
 * 5. Uncle children
 */
export function findInRelatives(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) {
        console.warn('Invalid reference element');
        return null;
    }

    const {
        // Step toggles - all enabled by default
        includeAncestors = true,
        includeSiblings = true,
        includeSiblingChildren = true,
        includeUncles = true,
        includeUncleChildren = true,
        // Additional options
        excludeSelf = true,
        excludeParent = true
    } = options;

    // STEP 1: Ancestors
    if (includeAncestors) {
        const ancestor = referenceEl.closest(selector);
        if (ancestor) return ancestor;
    }

    // STEP 2: Siblings (no descendants)
    if (includeSiblings) {
        const sibling = findAmongSiblings(referenceEl, selector, { excludeSelf });
        if (sibling) return sibling;
    }

    // STEP 3: Sibling children
    if (includeSiblingChildren) {
        const siblingChild = findAmongSiblingDescendants(referenceEl, selector, { excludeSelf });
        if (siblingChild) return siblingChild;
    }

    // STEP 4: Uncles (siblings of parent)
    if (includeUncles) {
        const uncle = findAmongUncles(referenceEl, selector, { excludeParent });
        if (uncle) return uncle;
    }

    // STEP 5: Uncle children
    if (includeUncleChildren) {
        const uncleChild = findAmongUncleDescendants(referenceEl, selector, { excludeParent });
        if (uncleChild) return uncleChild;
    }

    return null;
}

/**
 * Returns ALL matches in the hierarchy, not just the first one
 */
export function findAllInRelatives(referenceEl, selector, options = {}) {
    if (!referenceEl || !(referenceEl instanceof HTMLElement)) return [];

    const results = new Set();

    const {
        includeAncestors = true,
        includeSiblings = true,
        includeNephews = true,
        includeUncles = true,
        includeCousins = true,
        excludeSelf = true,
        excludeParent = true
    } = options;

    // STEP 1: Ancestors
    if (includeAncestors) {
        let ancestor = referenceEl.parentElement;
        while (ancestor) {
            if (ancestor.matches?.(selector)) results.add(ancestor);
            ancestor = ancestor.parentElement;
        }
    }

    // STEP 2: Siblings
    if (includeSiblings) {
        findAllAmongSiblings(referenceEl, selector, { excludeSelf })
            .forEach(el => results.add(el));
    }

    // STEP 3: Sibling children
    if (includeNephews) {
        findAllAmongSiblingDescendants(referenceEl, selector, { excludeSelf })
            .forEach(el => results.add(el));
    }

    // STEP 4: Uncles
    if (includeUncles) {
        findAllAmongUncles(referenceEl, selector, { excludeParent })
            .forEach(el => results.add(el));
    }

    // STEP 5: Uncle children
    if (includeCousins) {
        findAllAmongUncleDescendants(referenceEl, selector, { excludeParent })
            .forEach(el => results.add(el));
    }

    return Array.from(results);
}
/* endregion DOM Query Traversal Utilities */

export function getElementIdentifier(el) {
    if (!el) return 'null';
    if (el.id) return `#${el.id}`;
    if (el.dataset.testid) return `[data-testid="${el.dataset.testid}"]`;
    const classList = Array.from(el.classList || []).slice(0, 1);
    const classStr = classList.length ? `.${classList[0]}` : '';
    return `${el.tagName.toLowerCase()}${classStr}`;
}