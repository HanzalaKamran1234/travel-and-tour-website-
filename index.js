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
   2. STICKY HEADER SCROLL LISTENER
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
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

/* ==========================================================================
   7. APPLICATION MODAL & FLOW SYSTEM
   ========================================================================== */
let selectedService = '';
let selectedPayment = '';
const appData = {
    name: '',
    passport: '',
    phone: '',
    email: '',
    service: '',
    payment: ''
};

function openApplicationModal(serviceName = '') {
    const modal = document.getElementById('appModal');
    const serviceSelect = document.getElementById('appService');
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
        
        // Reset panels to Step 1
        resetModalState();
        
        // Pre-select service if clicked from a service button
        if (serviceName && serviceSelect) {
            serviceSelect.value = serviceName;
        }
    }
}

function closeApplicationModal() {
    const modal = document.getElementById('appModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
    }
}

function resetModalState() {
    // Show step 1 panel
    document.getElementById('panelStep1').classList.add('active');
    document.getElementById('panelStep2').classList.remove('active');
    
    // Reset steps markers
    document.getElementById('indicatorStep1').classList.add('active');
    document.getElementById('indicatorStep2').classList.remove('active');
    document.getElementById('stepLine1').classList.remove('active');
    
    // Clear selections
    selectedPayment = '';
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach(c => c.classList.remove('selected'));
    
    const submitBtn = document.getElementById('btnWhatsAppSubmit');
    if (submitBtn) submitBtn.disabled = true;

    // Reset Form values if needed, keep active select valid
    const form = document.getElementById('appointmentForm');
    if (form) {
        // Just clear standard text inputs to keep select state clean if preselected
        form.querySelectorAll('input').forEach(input => input.value = '');
    }
}

// Form Submission - Transition to Step 2
function goToPaymentStep(event) {
    event.preventDefault();
    
    // Capture form values
    appData.service = document.getElementById('appService').value;
    appData.name = document.getElementById('appName').value.trim();
    appData.passport = document.getElementById('appPassport').value.trim().toUpperCase();
    appData.phone = document.getElementById('appPhone').value.trim();
    appData.email = document.getElementById('appEmail').value.trim();
    
    // Perform custom validation
    if (!validateInputs()) return;
    
    // Transition panels
    document.getElementById('panelStep1').classList.remove('active');
    document.getElementById('panelStep2').classList.add('active');
    
    // Transition step markers
    document.getElementById('indicatorStep2').classList.add('active');
    document.getElementById('stepLine1').classList.add('active');
}

function prevModalStep() {
    // Back to info panel
    document.getElementById('panelStep2').classList.remove('active');
    document.getElementById('panelStep1').classList.add('active');
    
    // Update markers
    document.getElementById('indicatorStep2').classList.remove('active');
    document.getElementById('stepLine1').classList.remove('active');
}

function validateInputs() {
    // Full Name validation (letters, spaces, length > 2)
    if (appData.name.length < 3) {
        alert('Please enter a valid full name (minimum 3 characters).');
        return false;
    }
    
    // Passport validation (letters & numbers, min 7, max 12 characters)
    const passportRegex = /^[A-Z0-9]{7,12}$/i;
    if (!passportRegex.test(appData.passport)) {
        alert('Please enter a valid Passport Number (7 to 12 alphanumeric characters).');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(appData.phone.replace(/[\s-()]/g, ''))) {
        alert('Please enter a valid active WhatsApp number (10 to 15 digits).');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(appData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

// Payment Selection
function selectPaymentMethod(methodName, cardElement) {
    selectedPayment = methodName;
    appData.payment = methodName;
    
    // Remove selected state from all cards
    const cards = document.querySelectorAll('.payment-card');
    cards.forEach(card => card.classList.remove('selected'));
    
    // Add selected state to current card
    cardElement.classList.add('selected');
    
    // Enable submit button
    const submitBtn = document.getElementById('btnWhatsAppSubmit');
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

// WhatsApp Form Submit
function submitToWhatsApp() {
    if (!selectedPayment) return;
    
    const waNumber = '923170427915';
    
    // Format payment message details based on method
    let paymentDetailString = '';
    if (selectedPayment === 'JazzCash') {
        paymentDetailString = '*JazzCash Account: 0317 0427915*';
    } else if (selectedPayment === 'Easypaisa') {
        paymentDetailString = '*Easypaisa Account: 0317 0427915*';
    } else if (selectedPayment === 'Bank Transfer') {
        paymentDetailString = '*Bank Transfer: Allied Bank Limited (Account details chosen)*';
    }
    
    // Compile and encode message
    const message = `*NEW APPOINTMENT APPLICATION*
----------------------------------
*Service:* ${appData.service}
*Full Name:* ${appData.name}
*Passport No:* ${appData.passport}
*WhatsApp No:* ${appData.phone}
*Email:* ${appData.email}
*Payment Method:* ${selectedPayment}
*Details:* ${paymentDetailString}
----------------------------------
_Submitted via Gulzar e Jannat Premium Portal. Please review my details and send confirmation._`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    // Open in new window/tab
    window.open(waUrl, '_blank');
    
    // Close modal & reset
    closeApplicationModal();
    alert('Thank you! Your details have been prepared. You are being redirected to WhatsApp to complete your slot booking.');
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    const waNumber = '923170427915';
    
    const waMessage = `*NEW DIRECT ENQUIRY*
----------------------------------
*Name:* ${name}
*Email:* ${email}
*Subject:* ${subject}
*Message:* ${message}
----------------------------------
_Submitted via Gulzar e Jannat Contact Form._`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    // Redirect to WhatsApp
    window.open(waUrl, '_blank');
    
    // Reset Form
    document.getElementById('contactForm').reset();
    alert('Your inquiry details have been captured. Redirecting you to WhatsApp for direct chat support.');
}
