document.addEventListener('DOMContentLoaded', () => {

    const cards = Array.from(document.querySelectorAll('.service-card'));

    //Scroll-reveal
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity .6s ease ${i * 0.06}s, transform .6s ease ${i * 0.06}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => revealObserver.observe(card));

    //Keyboard arrow-key
    const links = Array.from(document.querySelectorAll('.service-grid > a'));

    links.forEach((link, i) => {
        link.setAttribute('tabindex', '0');

        link.addEventListener('keydown', (e) => {
            const cols = getComputedStyle(document.querySelector('.service-grid'))
                .gridTemplateColumns.split(' ').length;

            let targetIndex = null;

            if (e.key === 'ArrowRight') targetIndex = i + 1;
            if (e.key === 'ArrowLeft') targetIndex = i - 1;
            if (e.key === 'ArrowDown') targetIndex = i + cols;
            if (e.key === 'ArrowUp') targetIndex = i - cols;

            if (targetIndex !== null && links[targetIndex]) {
                e.preventDefault();
                links[targetIndex].focus();
            }
        });
    });

    //Recently viewed
    const STORAGE_KEY = 'recentlyViewedServices';

    function getRecentlyViewed() {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function markRecentlyViewed(href) {
        const viewed = getRecentlyViewed();
        if (!viewed.includes(href)) {
            viewed.push(href);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
        }
    }

    const viewed = getRecentlyViewed();

    links.forEach(link => {
        const href = link.getAttribute('href');

        if (viewed.includes(href)) {
            const card = link.querySelector('.service-card');
            const badge = document.createElement('div');
            badge.className = 'recently-viewed-badge';
            badge.textContent = 'Recently Viewed';
            card.style.position = 'relative';
            card.appendChild(badge);
        }

        link.addEventListener('click', () => markRecentlyViewed(href));
    });

    //Ripple click feedback
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.position = card.style.position || 'relative';
        card.style.overflow = 'hidden';

        card.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.position = 'absolute';
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(29, 132, 255, 0.2)';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = 'transform .6s ease, opacity .6s ease';
            ripple.style.zIndex = '5';

            card.appendChild(ripple);
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(1)';
                ripple.style.opacity = '0';
            });

            setTimeout(() => ripple.remove(), 600);
        });
    });

});