/* ==========================================================================
   GULZAR E JANNAT TRAVEL & TOURS - FRONTEND ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initSPARouter();
    initStickyHeader();
    initHeroSlider();
    initMobileMenu();
    initScrollAnimations();
    initStatsCounter();
    
    // Auto focus hash link on reload if any
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'about', 'services', 'contact'].includes(hash)) {
        switchPage(hash);
    }
});

/* ==========================================================================
   1. CLIENT SIDE SPA ROUTER
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
    
    // Close mobile menu if active
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
    
    // Smooth transition
    pages.forEach(page => {
        if (page.classList.contains('active')) {
            page.style.opacity = '0';
            page.style.transform = 'translateY(15px)';
            setTimeout(() => {
                page.classList.remove('active');
                displayNewPage(pageId);
            }, 300); // Wait for transition
        }
    });

    // Update active nav links
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function displayNewPage(pageId) {
    const newPage = document.getElementById(pageId);
    if (newPage) {
        newPage.classList.add('active');
        // Force reflow
        newPage.offsetHeight;
        newPage.style.opacity = '1';
        newPage.style.transform = 'translateY(0)';
        
        // Scroll to top cleanly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Trigger animations for the new view
        triggerScrollAnimations();
    }
}

/* ==========================================================================
   2. STICKY HEADER SCROLL LISTENER (TRIGGERS INSTANTLY)
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 5) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   3. HERO IMAGE SLIDER
   ========================================================================== */
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let slideInterval;
    
    // Clear old dots and recreate
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
            if (idx === currentSlide) {
                slide.classList.add('active');
                dots[idx].classList.add('active');
            } else {
                slide.classList.remove('active');
                dots[idx].classList.remove('active');
            }
        });
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
        slideInterval = setInterval(nextSlide, 5000); // 5 sec interval
    }
    
    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });
    }
    
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
   5. INTERSECTION OBSERVER SCROLL ANIMATIONS
   ========================================================================== */
let scrollObserver;

function initScrollAnimations() {
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                scrollObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    triggerScrollAnimations();
}

function triggerScrollAnimations() {
    const animElements = document.querySelectorAll('.animate-on-scroll');
    animElements.forEach(el => {
        if (!el.classList.contains('appear')) {
            scrollObserver.observe(el);
        }
    });
}

/* ==========================================================================
   6. STATISTICS COUNTER ENGINE
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
    const duration = 2000; // 2 seconds counting animation

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out quad formula
            const easedProgress = progress * (2 - progress);
            const currentValue = Math.floor(easedProgress * (target - start) + start);
            
            // Format number with commas
            counter.textContent = currentValue.toLocaleString() + '+';
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        }

        requestAnimationFrame(updateCounter);
    });
}
