import { CreateMiniatureScrollContainer } from '../../Components/scroll-container/scroll-container.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-container').forEach(container => {
        CreateMiniatureScrollContainer(container);
    });
});
