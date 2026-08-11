const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const heroSection = document.querySelector('.hero');
const progressFill = document.getElementById('heroProgressFill');
const announcer = document.getElementById('slideAnnouncer');

let current = 0;
let autoSlideTimer = null;
let isPaused = false;
const SLIDE_DURATION = 5000;

function showSlide(index, direction = 'next') {
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev', 'next-enter');
        if (i === current && i !== index) {
            slide.classList.add(direction === 'next' ? 'prev' : 'next-enter');
        }
    });

    dots.forEach((dot) => {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
    });

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    dots[index].setAttribute('aria-selected', 'true');

    // change for screen reader users
    const heading = slides[index].querySelector('h1');
    if (announcer && heading) {
        announcer.textContent = `Now showing: ${heading.textContent}`;
    }

    current = index;
    restartProgressBar();
}

function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next, 'next');
}

function prevSlide() {
    const prev = (current - 1 + slides.length) % slides.length;
    showSlide(prev, 'prev');
}

function goToSlide(index) {
    if (index === current) return;
    const direction = index > current ? 'next' : 'prev';
    showSlide(index, direction);
    restartAutoSlide();
}

function startAutoSlide() {
    if (isPaused) return;
    autoSlideTimer = setInterval(nextSlide, SLIDE_DURATION);
    startProgressBar();
}

function restartAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}

function startProgressBar() {
    if (!progressFill || isPaused) return;
    progressFill.classList.remove('animating');
    // Force reflow
    void progressFill.offsetWidth;
    progressFill.classList.add('animating');
}

function restartProgressBar() {
    if (!progressFill) return;
    progressFill.classList.remove('animating');
    void progressFill.offsetWidth;
    if (!isPaused) progressFill.classList.add('animating');
}

function pauseSlider() {
    isPaused = true;
    clearInterval(autoSlideTimer);
    if (progressFill) progressFill.classList.remove('animating');
}

function resumeSlider() {
    isPaused = false;
    startAutoSlide();
}

// Pause on hover/focus
heroSection.addEventListener('mouseenter', pauseSlider);
heroSection.addEventListener('mouseleave', resumeSlider);
heroSection.addEventListener('focusin', pauseSlider);
heroSection.addEventListener('focusout', resumeSlider);

// Pause when the browser tab isn't visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(autoSlideTimer);
    } else if (!isPaused) {
        startAutoSlide();
    }
});

// Swipe support for mobile
let touchStartX = 0;
heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

heroSection.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
        diff < 0 ? nextSlide() : prevSlide();
        restartAutoSlide();
    }
}, { passive: true });

// Keyboard arrow
heroSection.setAttribute('tabindex', '0');
heroSection.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); restartAutoSlide(); }
    if (e.key === 'ArrowLeft') { prevSlide(); restartAutoSlide(); }
});

startAutoSlide();

document.addEventListener('DOMContentLoaded', () => {
const cards = document.querySelectorAll('.end-to-end-card');

  
  // Scroll-reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
        // Stagger each card
        setTimeout(() => {
        entry.target.classList.add('is-visible');
        }, i * 90);
        revealObserver.unobserve(entry.target);
    }
    });
}, { threshold: 0.15 });

cards.forEach(card => {
    card.classList.add('reveal-card');
    revealObserver.observe(card);
});
  // 2. Keyboard navigation
const cardArray = Array.from(cards);
cardArray.forEach((card, index) => {
    card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        cardArray[(index + 1) % cardArray.length].focus();
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        cardArray[(index - 1 + cardArray.length) % cardArray.length].focus();
    }
    });
});

 
  // Recently viewed
const currentPage = window.location.pathname.split('/').pop();


const lastVisited = sessionStorage.getItem('lastVisitedService');
if (lastVisited) {
    const matchingCard = Array.from(cards).find(card =>
    card.getAttribute('href').includes(lastVisited)
    );
    if (matchingCard) {
    const badge = document.createElement('span');
    badge.className = 'recently-viewed-badge';
    badge.textContent = 'Recently viewed';
    matchingCard.querySelector('.card-body').prepend(badge);
    }
}

cards.forEach(card => {
    card.addEventListener('click', () => {
        const path = card.getAttribute('href').split('/').pop();
        sessionStorage.setItem('lastVisitedService', path);
    });
    });

  //ripple feedback
  
cards.forEach(card => {
    card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    });
});
});

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.strip .a');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => countObserver.observe(stat));

    function animateCount(el) {
        const text = el.textContent.trim();
        const numMatch = text.match(/[\d.]+/);
        if (!numMatch) return; 

        const targetNum = parseFloat(numMatch[0]);
        const suffix = text.replace(numMatch[0], '');
        const isDecimal = numMatch[0].includes('.');
        const duration = 1400;
        const startTime = performance.now();

    
        if (text.includes('/')) return;

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); 
            const current = targetNum * eased;
            el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = text;
        }
        requestAnimationFrame(tick);
    }
});

/* Testinomal section */
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('#testimonials .card');

    // 5-star rating
    
    const starSVG = `<svg viewBox="0 0 20 20"><path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3L1 7.4l6.4-.6z"/></svg>`;

    cards.forEach(card => {
        const starsWrap = document.createElement('div');
        starsWrap.className = 'stars';
        starsWrap.innerHTML = starSVG.repeat(5);
        card.insertBefore(starsWrap, card.querySelector('p'));
    });  
    // Scroll-reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('is-visible'), i * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        card.classList.add('reveal-card');
        revealObserver.observe(card);
    });

    
    //read more
    const CHAR_LIMIT = 150;

    cards.forEach(card => {
        const quote = card.querySelector('p');
        const fullText = quote.textContent.trim();

        if (fullText.length > CHAR_LIMIT) {
            const shortText = fullText.slice(0, CHAR_LIMIT).trim() + '…';
            quote.textContent = shortText;

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'read-more-btn';
            toggleBtn.textContent = 'Read more';
            toggleBtn.setAttribute('aria-expanded', 'false');

            let expanded = false;
            toggleBtn.addEventListener('click', () => {
                expanded = !expanded;
                quote.textContent = expanded ? fullText : shortText;
                toggleBtn.textContent = expanded ? 'Show less' : 'Read more';
                toggleBtn.setAttribute('aria-expanded', expanded);
            });

            quote.after(toggleBtn);
        }
    });
});

/* cta section*/
document.addEventListener('DOMContentLoaded', () => {
    const ctaSection = document.getElementById('cta');

    //scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('cta-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    ctaSection.classList.add('cta-reveal');
    revealObserver.observe(ctaSection);
    // Subtle icon
    
    const icon = document.querySelector('.cta-icon');
    setInterval(() => {
        icon.classList.add('pulse');
        setTimeout(() => icon.classList.remove('pulse'), 700);
    }, 4000);

    
    // Ripple feedback
    
    document.querySelectorAll('.btn1, .btn2').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'cta-ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});