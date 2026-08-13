document.addEventListener('DOMContentLoaded', () => {

    //Staggered reveal
    const listItems = document.querySelectorAll('.left-content li');
    listItems.forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-16px)';
        li.style.transition = `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`;
    });

    //Reveal for cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity .6s ease ${i * 0.15}s, transform .6s ease ${i * 0.15}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translate(0, 0)';
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    [...listItems, ...infoCards].forEach(el => revealObserver.observe(el));

    //CTA button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ctaBtn.classList.add('pulse-once');
                    ctaObserver.unobserve(ctaBtn);
                }
            });
        }, { threshold: 0.5 });
        ctaObserver.observe(ctaBtn);
    }

    //Back-button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            if (document.referrer && document.referrer.includes(window.location.host)) {
                e.preventDefault();
                history.back();
            }
        });
    }

});