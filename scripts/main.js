// navbar
document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('checkbox');
    const navLinks = document.querySelector('.nav__links');
    const navLinkItems = document.querySelectorAll('.nav__link');
    const brand = document.querySelector('.brand');

    // Initial state - hide nav links on mobile
    if (window.innerWidth <= 992) {
        navLinks.style.transform = 'translateX(100%)';
        navLinks.style.opacity = '0';
    }

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Open animation
            navLinks.style.transform = 'translateX(0)';
            navLinks.style.opacity = '1';

            // Animate each link with a playful stagger
            navLinkItems.forEach((link, index) => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
                link.style.transition = `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;
            });

            // Make brand less prominent when menu is open
            brand.style.opacity = '0.5';
        } else {
            // Close animation
            navLinks.style.transform = 'translateX(100%)';
            navLinks.style.opacity = '0';

            // Animate links out
            navLinkItems.forEach((link, index) => {
                link.style.transform = 'translateX(20px)';
                link.style.opacity = '0';
                link.style.transition = `all 0.3s ease ${(navLinkItems.length - index) * 0.05}s`;
            });

            // Restore brand opacity
            brand.style.opacity = '1';
        }
    });

    // Close menu when a link is clicked (for mobile)
    navLinkItems.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 992) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 992) {
            // Reset styles for desktop view
            navLinks.style.transform = '';
            navLinks.style.opacity = '';
            navLinkItems.forEach(link => {
                link.style.transform = '';
                link.style.opacity = '';
                link.style.transition = '';
            });
        } else {
            // For mobile, if menu is closed, hide it
            if (!checkbox.checked) {
                navLinks.style.transform = 'translateX(100%)';
                navLinks.style.opacity = '0';
                navLinkItems.forEach(link => {
                    link.style.transform = 'translateX(20px)';
                    link.style.opacity = '0';
                });
            }
        }
    });
});


// skills slider
const wrapper = document.getElementById('skillsWrapper');
const cards = Array.from(wrapper.children);
cards.forEach(card => {
    wrapper.appendChild(card.cloneNode(true));
});