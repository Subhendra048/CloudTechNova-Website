document.addEventListener('DOMContentLoaded', () => {
    // copyright year  
    const copyrightEl = document.querySelector('.footer-bottom p');
    if (copyrightEl) {
        const currentYear = new Date().getFullYear();
        copyrightEl.textContent = copyrightEl.textContent.replace(/\d{4}/, currentYear);
    }
    //Back-to-top
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    //copy email
    const emailSpan = document.querySelector('.contact-item span'); // first contact-item = email
    if (emailSpan && emailSpan.textContent.includes('@')) {
        const emailItem = emailSpan.closest('.contact-item');
        emailItem.style.cursor = 'pointer';
        emailItem.title = 'Click to copy email';

        emailItem.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(emailSpan.textContent.trim());
                const original = emailSpan.textContent;
                emailSpan.textContent = 'Copied!';
                setTimeout(() => { emailSpan.textContent = original; }, 1500);
            } catch (err) {
                console.error('Clipboard copy failed:', err);
            }
        });
    }
});