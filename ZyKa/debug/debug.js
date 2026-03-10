const hamburger = document.querySelector('.navbar__hamburger');
const navMenu = document.querySelector('.navbar__menu');
const navLinks = document.querySelectorAll('.navbar__link a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active')
    navMenu.classList.toggle('active')

    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
})

navLinks.forEach((link) =>
    {
        // if (window.innerWidth >= 768) {
        //     hamburger.classList.remove('active');
        //     navMenu.classList.remove('active');
        //     hamburger.setAttribute('aria-expanded', 'false');
        // }
    }
)

function addAccessibility() {
    hamburger.setAttribute('aria-label', 'Toggle navigation menu')
    hamburger.setAttribute('aria-expanded', false)
    hamburger.setAttribute('role', 'button')
    hamburger.setAttribute('tabindex', '0')

    // Allow keyboard activation of hamburger menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            hamburger.click()
        }
    })
}

addAccessibility();

const dropdowns = document.querySelectorAll('.dropdown')

dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle')

    toggle.addEventListener('click', (e) => {
        // Only handle clicks for mobile view
        if (window.innerWidth <= 768) {
            e.preventDefault()
            dropdown.classList.toggle('active')
        }
    })
})
