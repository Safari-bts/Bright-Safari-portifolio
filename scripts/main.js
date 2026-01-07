// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// Performance Optimization
const isMobile = () => window.innerWidth <= 768;
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Mobile Performance Variables
let lastScrollTop = 0;
let ticking = false;
let menuOpen = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize mobile-specific optimizations
    if (isMobile()) {
        initMobileOptimizations();
    }
    
    // Set up event listeners
    initEventListeners();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize skill bars animation
    initSkillBars();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize touch interactions
    if (isTouchDevice()) {
        initTouchInteractions();
    }
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Initialize performance monitoring
    initPerformanceMonitor();
    
    // Add WhatsApp button
    addWhatsAppButton();
    
    // Add copy email functionality
    initCopyEmail();
    
    // Initialize parallax effects (desktop only)
    if (!isMobile()) {
        initParallaxEffect();
    }
});

// Theme Toggle Functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Update icon based on current theme
    const isDark = document.body.classList.contains('dark-theme');
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    
    themeIcons.forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
    
    // Save theme preference to localStorage
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_toggle', {
            'event_category': 'Settings',
            'event_label': isDark ? 'dark' : 'light',
            'value': 1
        });
    }
}

// Initialize theme based on localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            icon.className = 'fas fa-sun';
        });
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active');
    
    if (menuOpen) {
        document.body.style.overflow = 'hidden';
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        
        // Add subtle animation to menu items
        const menuItems = document.querySelectorAll('.mobile-nav-link');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    } else {
        document.body.style.overflow = '';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
    
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'mobile_menu', {
            'event_category': 'Navigation',
            'event_label': menuOpen ? 'open' : 'close',
            'value': 1
        });
    }
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
}

// Initialize event listeners with mobile optimizations
function initEventListeners() {
    // Theme toggles
    themeToggle?.addEventListener('click', toggleTheme);
    mobileThemeToggle?.addEventListener('click', toggleTheme);
    
    // Mobile menu
    menuToggle?.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            closeMobileMenu();
        }
    });
    
    // Add touch gestures for mobile
    if (isTouchDevice()) {
        initTouchGestures();
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Handle resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile() && !menuOpen) {
                closeMobileMenu();
            }
        }, 250);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (menuOpen) {
                    closeMobileMenu();
                }
                
                // Calculate position with mobile consideration
                const headerHeight = isMobile() ? 70 : 90;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Send analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'nav_click', {
                        'event_category': 'Navigation',
                        'event_label': this.textContent.trim(),
                        'value': 1
                    });
                }
            }
        });
    });
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!contactForm || !submitBtn) return;
    
    // Show loading state
    setButtonLoading(true);
    
    try {
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.subject || !data.message) {
            throw new Error('Please fill in all required fields.');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Please enter a valid email address.');
        }
        
        // Send using FormSubmit.co
        const success = await sendViaFormSubmit(data);
        
        if (success) {
            showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
            contactForm.reset();
            
            // Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': data.subject,
                    'value': 1
                });
            }
        } else {
            // Fallback to mailto link on mobile
            if (isMobile()) {
                sendViaMailto(data);
                showFormStatus('info', 'Opened email app. Please send from there.');
            } else {
                throw new Error('Failed to send. Please try emailing directly.');
            }
        }
        
    } catch (error) {
        showFormStatus('error', error.message || 'Failed to send message.');
    } finally {
        setButtonLoading(false);
    }
}

// Initialize contact form
function initContactForm() {
    if (!contactForm) return;
    
    // Add FormSubmit attributes for mobile optimization
    contactForm.setAttribute('action', 'https://formsubmit.co/safaribright93@gmail.com');
    contactForm.setAttribute('method', 'POST');
    
    // Add hidden fields
    const hiddenFields = `
        <input type="hidden" name="_subject" value="New message from Portfolio!">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="https://brightsafari.space/thank-you.html">
        <input type="hidden" name="_autoresponse" value="Thank you for contacting Bright Safari! I'll get back to you within 24 hours. - Bright">
    `;
    
    contactForm.insertAdjacentHTML('afterbegin', hiddenFields);
    
    // Add submit listener
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearInputError);
    });
    
    // Add noscript fallback
    contactForm.insertAdjacentHTML('beforeend', `
        <noscript>
            <div class="form-note" style="background: rgba(239, 68, 68, 0.1);">
                <i class="fas fa-exclamation-triangle"></i>
                <p>JavaScript is required for the contact form. Please use the direct contact methods or <a href="mailto:safaribright93@gmail.com">email directly</a>.</p>
            </div>
        </noscript>
    `);
}

// Validate individual input
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showInputError(input, 'Please enter a valid email');
            return false;
        }
    }
    
    return true;
}

// Show input error
function showInputError(input, message) {
    // Remove existing error
    clearInputError({ target: input });
    
    // Add error class
    input.classList.add('input-error');
    
    // Create error message
    const error = document.createElement('div');
    error.className = 'input-error-message';
    error.textContent = message;
    error.style.cssText = `
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;
    
    input.parentNode.appendChild(error);
}

// Clear input error
function clearInputError(e) {
    const input = e.target;
    input.classList.remove('input-error');
    
    const error = input.parentNode.querySelector('.input-error-message');
    if (error) {
        error.remove();
    }
}

// Send form via FormSubmit.co
async function sendViaFormSubmit(data) {
    try {
        const response = await fetch('https://formsubmit.co/ajax/safaribright93@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                subject: data.subject,
                message: data.message,
                _subject: `New message from ${data.name}`,
                _template: 'table',
                _captcha: 'false'
            })
        });
        
        const result = await response.json();
        return response.ok && result.success === 'true';
        
    } catch (error) {
        console.warn('FormSubmit failed:', error);
        return false;
    }
}

// Send via mailto fallback
function sendViaMailto(data) {
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\n\nMessage:\n${data.message}`);
    
    window.location.href = `mailto:safaribright93@gmail.com?subject=${subject}&body=${body}`;
}

// Set button loading state
function setButtonLoading(loading) {
    if (!submitBtn) return;
    
    if (loading) {
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="btn-loading"></div>';
    } else {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message <div class="ai-submit-effect"></div>';
    }
}

// Show form status
function showFormStatus(type, message) {
    // Remove existing status
    const existing = document.querySelector('.form-status');
    if (existing) existing.remove();
    
    // Create status element
    const status = document.createElement('div');
    status.className = `form-status ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    status.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add close button for mobile
    if (isMobile()) {
        status.innerHTML += '<button class="status-close" onclick="this.parentElement.remove()">×</button>';
    }
    
    contactForm?.parentNode.insertBefore(status, contactForm.nextSibling);
    
    // Auto-remove after 8 seconds on mobile, 10 seconds on desktop
    const autoRemoveTime = isMobile() ? 8000 : 10000;
    setTimeout(() => {
        if (status.parentNode) {
            status.style.opacity = '0';
            status.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (status.parentNode) status.parentNode.removeChild(status);
            }, 300);
        }
    }, autoRemoveTime);
}

// Initialize skill bars animation on scroll
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0';
                
                // Delay animation for better mobile performance
                setTimeout(() => {
                    skillBar.style.transition = 'width 1.5s ease-in-out';
                    skillBar.style.width = width;
                }, isMobile() ? 100 : 300);
                
                // Stop observing after animation
                observer.unobserve(skillBar);
            }
        });
    }, { 
        threshold: isMobile() ? 0.2 : 0.5,
        rootMargin: isMobile() ? '50px' : '100px'
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Navbar scroll effect with mobile optimizations
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Mobile-specific adjustments
    const mobileThreshold = isMobile() ? 50 : 100;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > mobileThreshold) {
                    navbar.style.padding = isMobile() ? '0.5rem 0' : '0.5rem 0';
                    navbar.style.boxShadow = 'var(--shadow)';
                    
                    if (scrollTop > lastScrollTop && scrollTop > 200) {
                        // Scrolling down - hide navbar on mobile
                        if (isMobile() && !menuOpen) {
                            navbar.style.transform = 'translateY(-100%)';
                        }
                    } else {
                        // Scrolling up - show navbar
                        navbar.style.transform = 'translateY(0)';
                    }
                } else {
                    navbar.style.padding = isMobile() ? '1rem 0' : '1rem 0';
                    navbar.style.boxShadow = 'none';
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Mobile-specific optimizations
function initMobileOptimizations() {
    // Reduce animations on low-power devices
    if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
        document.body.classList.add('reduced-motion');
    }
    
    // Adjust font sizes for better readability
    if (window.innerWidth < 400) {
        document.documentElement.style.fontSize = '14px';
    }
    
    // Improve touch targets
    document.querySelectorAll('button, .btn, .nav-link').forEach(element => {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
    });
    
    // Prevent zoom on input focus
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', () => {
            if (isMobile()) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.style.height = '100%';
                }, 100);
            }
        });
    });
}

// Touch interactions for mobile
function initTouchInteractions() {
    // Add touch feedback to buttons
    document.querySelectorAll('button, .btn, .nav-link, .project-link').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Improve scrolling performance
    document.addEventListener('touchmove', (e) => {
        // Prevent default on elements that shouldn't scroll
        if (e.target.closest('.no-scroll')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Touch gestures for mobile menu
function initTouchGestures() {
    let startY;
    let startX;
    let isSwiping = false;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = startY - currentY;
        const diffX = startX - currentX;
        
        // Swipe down to close menu (only if menu is open and swiping down)
        if (menuOpen && diffY < -50 && Math.abs(diffX) < Math.abs(diffY)) {
            closeMobileMenu();
            isSwiping = false;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        isSwiping = false;
    }, { passive: true });
}

// Handle orientation change
function handleOrientationChange() {
    // Close menu on orientation change
    if (menuOpen) {
        closeMobileMenu();
    }
    
    // Reinitialize some elements
    setTimeout(() => {
        if (isMobile()) {
            initMobileOptimizations();
        }
    }, 300);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: isMobile() ? '50px' : '100px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Performance monitoring
function initPerformanceMonitor() {
    // Only run on development or if enabled
    if (window.location.hostname !== 'localhost' && !localStorage.getItem('debug')) {
        return;
    }
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    console.warn('Long task detected:', entry);
                }
            }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
    }
    
    // Monitor memory usage
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 100000000) { // 100MB
                console.warn('High memory usage:', memory);
            }
        }, 30000);
    }
}

// Add WhatsApp floating button
function addWhatsAppButton() {
    // Only add on mobile or if user prefers reduced motion
    if (isMobile() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = 'https://wa.me/255748042678';
        whatsappBtn.target = '_blank';
        whatsappBtn.rel = 'noopener noreferrer';
        whatsappBtn.className = 'whatsapp-badge';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappBtn.title = 'Chat on WhatsApp';
        whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
        
        // Add click tracking
        whatsappBtn.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'Contact',
                    'event_label': 'Mobile',
                    'value': 1
                });
            }
        });
        
        document.body.appendChild(whatsappBtn);
    }
}

// Copy email functionality
function initCopyEmail() {
    const emailElements = document.querySelectorAll('.contact-item p');
    
    emailElements.forEach(element => {
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-label', 'Copy email address');
            
            element.addEventListener('click', copyEmail);
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    copyEmail(e);
                }
            });
        }
    });
}

// Copy email to clipboard
function copyEmail(e) {
    const element = e.target;
    const email = element.textContent.trim();
    
    navigator.clipboard.writeText(email).then(() => {
        const original = element.textContent;
        element.textContent = 'Copied!';
        element.style.color = '#10b981';
        
        setTimeout(() => {
            element.textContent = original;
            element.style.color = '';
        }, 2000);
        
        // Send analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'email_copy', {
                'event_category': 'Contact',
                'event_label': 'Email',
                'value': 1
            });
        }
    }).catch(err => {
        console.error('Failed to copy email:', err);
        element.textContent = 'Failed to copy';
        element.style.color = '#ef4444';
        
        setTimeout(() => {
            element.textContent = email;
            element.style.color = '';
        }, 2000);
    });
}

// Parallax effect for desktop
function initParallaxEffect() {
    if (isMobile() || isTouchDevice()) return;
    
    const parallaxElements = document.querySelectorAll('.ai-node, .profile-picture-container');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach((el, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Add CSS for mobile enhancements
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    /* Mobile-specific enhancements */
    @media (max-width: 768px) {
        /* Improve touch targets */
        button, .btn, .nav-link, .project-link {
            min-height: 44px;
            min-width: 44px;
            touch-action: manipulation;
        }
        
        /* Prevent text size adjustment */
        input, textarea, select {
            font-size: 16px !important;
        }
        
        /* Improve form inputs */
        .form-group input,
        .form-group textarea,
        .form-group select {
            font-size: 16px;
            padding: 14px 16px;
        }
        
        /* Status message improvements */
        .form-status {
            padding: 1rem;
            margin: 1rem 0;
            font-size: 0.9rem;
        }
        
        .status-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Touch feedback */
        .touch-active {
            opacity: 0.7;
            transform: scale(0.98);
        }
        
        /* Reduce motion for low-power devices */
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        /* Input error styles */
        .input-error {
            border-color: #ef4444 !important;
        }
        
        .input-error-message {
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* WhatsApp button mobile styles */
        .whatsapp-badge {
            width: 56px;
            height: 56px;
            font-size: 1.8rem;
            bottom: 20px;
            right: 20px;
        }
    }
    
    @media (max-width: 400px) {
        /* Extra small screens */
        .container {
            padding: 0 12px;
        }
        
        .hero-title {
            font-size: 2rem !important;
        }
        
        .hero-tagline {
            font-size: 1.1rem !important;
        }
        
        .section-title {
            font-size: 1.8rem !important;
        }
    }
    
    /* Prevent pull-to-refresh on mobile */
    body {
        overscroll-behavior-y: contain;
    }
    
    /* Improve scrolling performance */
    * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
    }
`;

document.head.appendChild(mobileStyles);

// Export functions for global access (if needed)
window.copyEmail = copyEmail;
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;