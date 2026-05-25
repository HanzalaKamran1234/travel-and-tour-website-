/* ==========================================================================
   GULZAR E JANNAT TRAVEL & TOURS - FRONTEND ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSPARouter();
    initStickyHeader();
    initHeroSlider();
    initMobileMenu();
    initScrollAnimations();
    initStatsCounter();
    initTestimonialsSlider();
    initContactForm();

    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'about', 'services', 'contact'].includes(hash)) {
        switchPage(hash);
    }
});

/* ==========================================================================
   1. SPA ROUTER
   ========================================================================== */
function initSPARouter() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1) || 'home';
        if (['home', 'about', 'services', 'contact'].includes(hash)) {
            switchPage(hash);
        }
    });
}

function navigateTo(event, pageId) {
    event.preventDefault();
    window.location.hash = pageId;
    switchPage(pageId);
    const navMenu = document.getElementById('navMenu');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
    }
}

function switchPage(pageId) {
    const pages = document.querySelectorAll('.page-view');
    const navLinks = document.querySelectorAll('.nav-link');

    pages.forEach(page => {
        if (page.classList.contains('active')) {
            page.style.opacity = '0';
            page.style.transform = 'translateY(15px)';
            setTimeout(() => {
                page.classList.remove('active');
                displayNewPage(pageId);
            }, 300);
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        link.classList.toggle('active', href === pageId);
    });
}

function displayNewPage(pageId) {
    const newPage = document.getElementById(pageId);
    if (newPage) {
        newPage.classList.add('active');
        newPage.offsetHeight;
        newPage.style.opacity = '1';
        newPage.style.transform = 'translateY(0)';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerScrollAnimations();
    }
}

/* ==========================================================================
   2. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 5);
    });
}

/* ==========================================================================
   3. PREMIUM HERO SLIDER — Ken Burns + Counter + Progress Bar
   ========================================================================== */
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    const progressBar = document.getElementById('sliderProgressBar');

    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 5000;

    // Build dots dynamically
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    function updateSlides() {
        slides.forEach((slide, idx) => {
            const isActive = idx === currentSlide;
            slide.classList.toggle('active', isActive);
            if (dots[idx]) dots[idx].classList.toggle('active', isActive);
        });

        // Restart progress bar
        if (progressBar) {
            progressBar.classList.remove('animating');
            progressBar.style.width = '0%';
            void progressBar.offsetWidth; // force reflow
            progressBar.classList.add('animating');
            progressBar.style.width = '100%';
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function goToSlide(idx) {
        currentSlide = idx;
        updateSlides();
        resetTimer();
    }

    function startTimer() {
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prevSlide(); resetTimer(); }
        if (e.key === 'ArrowRight') { nextSlide(); resetTimer(); }
    });

    // Touch/swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
            resetTimer();
        }
    });

    // Init first slide
    updateSlides();
    startTimer();
}

/* ==========================================================================
   4. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

/* ==========================================================================
   5. SCROLL ANIMATIONS
   ========================================================================== */
let scrollObserver;

function initScrollAnimations() {
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    triggerScrollAnimations();
}

function triggerScrollAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (!el.classList.contains('appear')) scrollObserver.observe(el);
    });
}

/* ==========================================================================
   6. STATISTICS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statsSection = document.querySelector('.bg-navy.relative');
    if (!statsSection) return;

    let hasCounted = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                startCounting();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

function startCounting() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const eased = progress * (2 - progress);
            counter.textContent = Math.floor(eased * target).toLocaleString() + '+';
            if (progress < 1) requestAnimationFrame(updateCounter);
            else counter.textContent = target.toLocaleString() + '+';
        }

        requestAnimationFrame(updateCounter);
    });
}

/* ==========================================================================
   7. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;

    const cards = slider.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');

    let current = 0;
    let autoInterval;

    // Build dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `t-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goTo(idx));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function goTo(idx) {
        current = (idx + cards.length) % cards.length;
        slider.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    // Touch swipe
    let tStartX = 0;
    slider.addEventListener('touchstart', e => { tStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const diff = tStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    function startAuto() { autoInterval = setInterval(next, 6000); }
    function resetAuto() { clearInterval(autoInterval); startAuto(); }

    goTo(0);
    startAuto();
}

/* ==========================================================================
   8. WHATSAPP CONTACT FORM
   ========================================================================== */
function initContactForm() {
    const submitBtn = document.getElementById('hcSubmitLink');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', handleContactSubmit);
    submitBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleContactSubmit(); }
    });
}

function handleContactSubmit() {
    const name = document.getElementById('hc-name')?.value?.trim() || '';
    const phone = document.getElementById('hc-phone')?.value?.trim() || '';
    const service = document.getElementById('hc-service')?.value || '';
    const message = document.getElementById('hc-message')?.value?.trim() || '';

    if (!name || !phone) {
        // Highlight required fields briefly
        ['hc-name', 'hc-phone'].forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.value.trim()) {
                el.style.borderColor = '#ff6b6b';
                setTimeout(() => { el.style.borderColor = ''; }, 2000);
            }
        });
        return;
    }

    let msg = `Assalam o Alaikum, I'd like to inquire about your services.%0A%0A`;
    msg += `*Name:* ${encodeURIComponent(name)}%0A`;
    msg += `*Phone:* ${encodeURIComponent(phone)}%0A`;
    if (service) msg += `*Service:* ${encodeURIComponent(service)}%0A`;
    if (message) msg += `*Message:* ${encodeURIComponent(message)}%0A`;

    window.open(`https://wa.me/923170427915?text=${msg}`, '_blank');
}
