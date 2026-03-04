const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxBody = document.getElementById('lightboxBody');
const closeBtn = document.getElementById('closeLightbox');

// Function to open lightbox and load content
export function openLightbox(content) {
    if (content instanceof HTMLElement) {
        lightboxBody.innerHTML = '';
        lightboxBody.appendChild(content);
    }
    else
    {
        lightboxBody.innerHTML = content;
    }
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLightbox);

lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
    }
});