import { CreateMiniatureScrollContainer } from '../../CSS_JS/scroll-container/scroll-container.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-container').forEach(container => {
        CreateMiniatureScrollContainer(container);
    });
});
