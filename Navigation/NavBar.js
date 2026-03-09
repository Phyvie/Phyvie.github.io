export function initialiseNavBar ()
{
    const navbar = document.querySelector('.navbar');
    const hamburger = navbar.querySelector('.navbar__hamburger');
    const nav_menu = navbar.querySelector('.navbar__menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('--active');
        nav_menu.classList.toggle('--active');

        const isExpanded = hamburger.classList.contains('--active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
}