function loadCV() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'EN'; // Default to EN if not specified
    const cvMain = document.getElementById('cv-main');

    if (!cvMain) return;

    const pdfSrc = `CV_${lang.toUpperCase()}.pdf`;
    
    const object = document.createElement('object');
    object.data = pdfSrc;
    object.type = 'application/pdf';
    object.className = 'cv-object';

    // Fallback for browsers that don't support <object> for PDF
    const fallbackLink = document.createElement('p');
    fallbackLink.innerHTML = `It appears you don't have a PDF plugin for this browser. No biggie... you can <a href="${pdfSrc}">click here to download the PDF file.</a>`;
    object.appendChild(fallbackLink);

    cvMain.appendChild(object);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCV);
} else {
    loadCV();
}
