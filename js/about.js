
document.addEventListener('DOMContentLoaded', () => {

    /* Scroll reveal for cards*/
    const revealEls = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, i * 60);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        //just show everything
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    /*Back to top button*/
    const backToTop = document.getElementById('backToTopBtn');
    if (backToTop) {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});