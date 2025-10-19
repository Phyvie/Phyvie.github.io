export function scrollMediaStripByIndex(galleryName, positions) {
    var gallery = document.getElementById(galleryName);
    scrollMediaStrip(gallery, positions * gallery.offsetWidth);
}

export function scrollMediaStripToIndex(galleryName, index) {
    var gallery = document.getElementById(galleryName);
    _private_scrollMediaStripToPosition(gallery, index * gallery.offsetWidth);
}

function _private_scrollMediaStrip(gallery, scrollWidth) {
    gallery.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        }
    )
}

function _private_scrollMediaStripToPosition(gallery, position) {
    gallery.scrollLeft = position;
}