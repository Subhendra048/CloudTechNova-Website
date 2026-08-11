document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navigation = document.getElementById('navigation');

function closeMenu() {
    navigation.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', false);
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
}

  // Toggle hamburger menu
hamburgerBtn.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

  // "Services" Toggle
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        toggle.parentElement.classList.toggle('open');
    }
    });
});

document.querySelectorAll('#navigation a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeMenu();
    });
});

  // Reset mobile state 
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
});

  // cuurent page highlight
const navLinks = document.querySelectorAll('#navigation > a, .dropdown-toggle');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();

    if (linkPath === currentPath) {
    link.classList.add('active');
    }
    if (linkPath === 'contact.html') {
    link.classList.add('nav-cta');
    }
});

  // Highlight Services
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const subLinks = dropdown.querySelectorAll('.dropdown-content a');
    subLinks.forEach(subLink => {
    const subPath = subLink.getAttribute('href').split('/').pop();
    if (subPath === currentPath) {
        dropdown.querySelector('.dropdown-toggle').classList.add('active');
    }
    });
  });
});