// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const aiAssistant = document.getElementById('aiAssistant');
const backToTopBtn = document.getElementById('backToTop');

// Performance Optimization
const isMobile = () => window.innerWidth <= 768;
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Mobile Performance Variables
let lastScrollTop = 0;
let ticking = false;
let menuOpen = false;

// AI Typing Animation Variables
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingInterval;

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
    
    // Initialize AI animations
    initAIAnimations();
    
    // Initialize counters
    initCounters();
    
    // Initialize Intersection Observer for animations
    initAnimationObserver();
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
    
    // AI Assistant
    aiAssistant?.addEventListener('click', showAIAssistant);
    
    // Back to top button
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
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

// AI Animations
function initAIAnimations() {
    // Start typing animation
    startTypingAnimation();
    
    // Initialize particle animations
    initParticleAnimations();
    
    // Initialize hover effects for gallery items
    initGalleryHoverEffects();
}

// Typing animation for hero section
function startTypingAnimation() {
    const aiText = document.getElementById('aiTextTyping');
    if (!aiText) return;
    
    const texts = [
        'AI-Powered Solutions',
        'Machine Learning',
        'Neural Networks',
        'Deep Learning',
        'Computer Vision',
        'Natural Language Processing'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            aiText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            aiText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isEnd = true;
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex++;
            if (textIndex === texts.length) {
                textIndex = 0;
            }
            setTimeout(type, 500);
        } else {
            const speed = isDeleting ? 50 : 100;
            setTimeout(type, speed);
        }
    }

    // Start typing animation after a delay
    setTimeout(type, 1000);
}

// Initialize particle animations
function initParticleAnimations() {
    const particles = document.querySelectorAll('.ai-particle');
    particles.forEach(particle => {
        // Add random animation delays
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
    });
}

// Initialize gallery hover effects
function initGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const hoverEffect = item.querySelector('.ai-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.opacity = '1';
                hoverEffect.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const hoverEffect = item.querySelector('.ai-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.opacity = '0';
                hoverEffect.style.transform = 'translate(-50%, -50%) scale(0)';
            }
        });
    });
}

// Initialize counters
function initCounters() {
    const counterElements = document.querySelectorAll('.animate-counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                const countElement = element.querySelector('h3');
                
                if (countElement && target > 0) {
                    animateCounter(countElement, target);
                }
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '100px'
    });
    
    counterElements.forEach(element => {
        observer.observe(element);
    });
}

// Animate counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // 50 frames
    const duration = 1500; // 1.5 seconds
    const interval = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, interval);
}

// Initialize Intersection Observer for animations
function initAnimationObserver() {
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-slide-in-left, .animate-slide-in-right, .animate-slide-in-up, .animate-zoom-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!contactForm || !submitBtn) return;
    
    // Show loading state with AI animation
    setButtonLoading(true);
    
    try {
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.message) {
            throw new Error('Please fill in all required fields.');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Please enter a valid email address.');
        }
        
        // Simulate AI processing animation
        await simulateAIProcessing();
        
        // Send using FormSubmit.co
        const success = await sendViaFormSubmit(data);
        
        if (success) {
            showFormStatus('success', 'Message sent successfully! 🚀 I\'ll get back to you soon.');
            contactForm.reset();
            
            // Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'AI Form',
                    'value': 1
                });
            }
        } else {
            // Fallback to mailto link on mobile
            if (isMobile()) {
                sendViaMailto(data);
                showFormStatus('info', '📧 Opened email app. Please send from there.');
            } else {
                throw new Error('Failed to send. Please try emailing directly.');
            }
        }
        
    } catch (error) {
        showFormStatus('error', `❌ ${error.message || 'Failed to send message.'}`);
    } finally {
        setButtonLoading(false);
    }
}

// Simulate AI processing animation
function simulateAIProcessing() {
    return new Promise(resolve => {
        const aiProcessing = document.querySelector('.ai-processing');
        if (aiProcessing) {
            aiProcessing.style.animation = 'pulse 0.5s ease-in-out infinite';
        }
        
        setTimeout(() => {
            if (aiProcessing) {
                aiProcessing.style.animation = '';
            }
            resolve();
        }, 1500);
    });
}

// Initialize contact form
function initContactForm() {
    if (!contactForm) return;
    
    // Add FormSubmit attributes for mobile optimization
    contactForm.setAttribute('action', 'https://formsubmit.co/safaribright93@gmail.com');
    contactForm.setAttribute('method', 'POST');
    
    // Add AI form indicator
    const aiIndicator = document.createElement('div');
    aiIndicator.className = 'ai-form-indicator';
    aiIndicator.innerHTML = `
        <div class="ai-processing"></div>
        <span>AI-enhanced contact form</span>
    `;
    
    contactForm.appendChild(aiIndicator);
    
    // Add submit listener
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearInputError);
        
        // Add AI-style focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('ai-focus');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('ai-focus');
        });
    });
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
                subject: `New message from ${data.name} via Portfolio`,
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
    const subject = encodeURIComponent(`Message from ${data.name} - Portfolio Contact`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\n\nMessage:\n${data.message}`);
    
    window.location.href = `mailto:safaribright93@gmail.com?subject=${subject}&body=${body}`;
}

// Set button loading state with AI effects
function setButtonLoading(loading) {
    if (!submitBtn) return;
    
    if (loading) {
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="btn-spinner">
                <div class="ai-spinner"></div>
            </div>
            <span>AI Processing...</span>
        `;
        
        // Add AI processing animation
        submitBtn.style.position = 'relative';
        const aiEffect = document.createElement('div');
        aiEffect.className = 'ai-submit-effect';
        submitBtn.appendChild(aiEffect);
        
    } else {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        
        // Remove AI effect
        const aiEffect = submitBtn.querySelector('.ai-submit-effect');
        if (aiEffect) {
            aiEffect.remove();
        }
    }
}

// Show form status with AI styling
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
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    status.innerHTML = `
        <div class="status-icon" style="background: ${colors[type]}20; border: 1px solid ${colors[type]}40;">
            <i class="fas fa-${icons[type] || 'info-circle'}" style="color: ${colors[type]}"></i>
        </div>
        <div class="status-content">
            <span>${message}</span>
        </div>
    `;
    
    // Add close button for mobile
    if (isMobile()) {
        status.innerHTML += '<button class="status-close" onclick="this.parentElement.remove()">×</button>';
    }
    
    contactForm?.parentNode.insertBefore(status, contactForm.nextSibling);
    
    // Add AI fade-in animation
    status.style.animation = 'fadeInUp 0.5s ease-out';
    
    // Auto-remove after 8 seconds on mobile, 10 seconds on desktop
    const autoRemoveTime = isMobile() ? 8000 : 10000;
    setTimeout(() => {
        if (status.parentNode) {
            status.style.animation = 'fadeOut 0.3s ease-out forwards';
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
                
                // Add AI processing effect
                skillBar.classList.add('ai-processing');
                
                // Delay animation for better mobile performance
                setTimeout(() => {
                    skillBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    skillBar.style.width = width;
                    
                    // Remove processing effect after animation
                    setTimeout(() => {
                        skillBar.classList.remove('ai-processing');
                    }, 1500);
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
                    navbar.style.backdropFilter = 'blur(10px)';
                    
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
                    navbar.style.backdropFilter = 'blur(10px)';
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
    
    // Optimize AI animations for mobile
    const aiElements = document.querySelectorAll('.ai-particle, .ai-glow, .ai-sparkle');
    aiElements.forEach(element => {
        element.style.animationDuration = '3s'; // Faster animations on mobile
    });
}

// Touch interactions for mobile
function initTouchInteractions() {
    // Add touch feedback to buttons
    document.querySelectorAll('button, .btn, .nav-link, .project-link, .program-link').forEach(element => {
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
    
    // Add touch effects to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            item.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        item.addEventListener('touchend', () => {
            item.style.transform = 'scale(1)';
        }, { passive: true });
    });
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
                    
                    // Add AI fade-in effect
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                    
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
        
        // Add AI animation
        whatsappBtn.style.animation = 'pulse 2s ease-in-out infinite';
        
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
            
            // Add AI style
            element.style.position = 'relative';
            element.style.transition = 'color 0.3s ease';
            
            element.addEventListener('click', copyEmail);
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    copyEmail(e);
                }
            });
            
            // Add hover effect
            element.addEventListener('mouseenter', () => {
                element.style.color = 'var(--neon-blue)';
            });
            
            element.addEventListener('mouseleave', () => {
                if (!element.classList.contains('copied')) {
                    element.style.color = '';
                }
            });
        }
    });
}

// Copy email to clipboard with AI feedback
function copyEmail(e) {
    const element = e.target;
    const email = element.textContent.trim();
    
    // Add AI copying animation
    element.classList.add('ai-copying');
    
    navigator.clipboard.writeText(email).then(() => {
        element.classList.remove('ai-copying');
        element.classList.add('copied');
        
        const original = element.textContent;
        element.textContent = '📋 Copied to clipboard!';
        element.style.color = '#10b981';
        
        // Add AI success effect
        const aiEffect = document.createElement('div');
        aiEffect.className = 'ai-copy-effect';
        element.appendChild(aiEffect);
        
        setTimeout(() => {
            aiEffect.remove();
            element.textContent = original;
            element.style.color = '';
            element.classList.remove('copied');
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
        element.textContent = '❌ Failed to copy';
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
    
    const parallaxElements = document.querySelectorAll('.profile-picture-container, .ai-particle');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach((el, index) => {
                    const speed = 0.1 + (index * 0.02);
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// AI Assistant functionality
function showAIAssistant() {
    // Create AI assistant modal
    const aiModal = document.createElement('div');
    aiModal.className = 'ai-modal';
    aiModal.innerHTML = `
        <div class="ai-modal-content">
            <div class="ai-modal-header">
                <h3><i class="fas fa-robot"></i> AI Assistant</h3>
                <button class="ai-modal-close">&times;</button>
            </div>
            <div class="ai-modal-body">
                <div class="ai-message ai-bot">
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="ai-text">
                        <p>Hello! I'm Bright's AI Assistant. How can I help you today?</p>
                    </div>
                </div>
                <div class="ai-options">
                    <button class="ai-option" data-action="projects">
                        <i class="fas fa-code"></i>
                        <span>View Projects</span>
                    </button>
                    <button class="ai-option" data-action="skills">
                        <i class="fas fa-cogs"></i>
                        <span>See Skills</span>
                    </button>
                    <button class="ai-option" data-action="contact">
                        <i class="fas fa-envelope"></i>
                        <span>Contact Bright</span>
                    </button>
                    <button class="ai-option" data-action="about">
                        <i class="fas fa-user"></i>
                        <span>Learn About Bright</span>
                    </button>
                </div>
            </div>
            <div class="ai-modal-footer">
                <p><i class="fas fa-info-circle"></i> This AI assistant demonstrates Bright's AI capabilities</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(aiModal);
    
    // Add animations
    setTimeout(() => {
        aiModal.classList.add('show');
    }, 10);
    
    // Close modal
    const closeBtn = aiModal.querySelector('.ai-modal-close');
    closeBtn.addEventListener('click', () => {
        aiModal.classList.remove('show');
        setTimeout(() => {
            aiModal.remove();
        }, 300);
    });
    
    // Close on outside click
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            aiModal.classList.remove('show');
            setTimeout(() => {
                aiModal.remove();
            }, 300);
        }
    });
    
    // Handle AI options
    const options = aiModal.querySelectorAll('.ai-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            handleAIAction(action);
            aiModal.classList.remove('show');
            setTimeout(() => {
                aiModal.remove();
            }, 300);
        });
    });
    
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'ai_assistant', {
            'event_category': 'Interaction',
            'event_label': 'Open',
            'value': 1
        });
    }
}

// Handle AI assistant actions
function handleAIAction(action) {
    let targetId;
    let message;
    
    switch(action) {
        case 'projects':
            targetId = '#projects';
            message = 'Taking you to projects...';
            break;
        case 'skills':
            targetId = '#skills';
            message = 'Showing skills...';
            break;
        case 'contact':
            targetId = '#contact';
            message = 'Opening contact section...';
            break;
        case 'about':
            targetId = '#about';
            message = 'Showing about section...';
            break;
        default:
            return;
    }
    
    // Show AI action message
    const actionMsg = document.createElement('div');
    actionMsg.className = 'ai-action-message';
    actionMsg.textContent = message;
    actionMsg.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--ai-gradient);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease, fadeOut 0.3s ease 2s forwards;
    `;
    
    document.body.appendChild(actionMsg);
    
    // Scroll to section
    setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) {
            const headerHeight = isMobile() ? 70 : 90;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Remove message
        setTimeout(() => {
            actionMsg.remove();
        }, 2000);
    }, 500);
}

// Add CSS for AI enhancements
const aiStyles = document.createElement('style');
aiStyles.textContent = `
    /* AI-specific animations */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
    
    /* AI Modal */
    .ai-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .ai-modal.show {
        opacity: 1;
    }
    
    .ai-modal-content {
        background: rgba(30, 41, 59, 0.95);
        border-radius: 20px;
        border: 1px solid rgba(0, 212, 255, 0.3);
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow: hidden;
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .ai-modal.show .ai-modal-content {
        transform: translateY(0);
    }
    
    .ai-modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .ai-modal-header h3 {
        color: var(--neon-blue);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .ai-modal-close {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 1.5rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .ai-modal-close:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
    
    .ai-modal-body {
        padding: 1.5rem;
    }
    
    .ai-message {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .ai-avatar {
        width: 40px;
        height: 40px;
        background: var(--ai-gradient);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .ai-text {
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 15px;
        padding: 1rem;
        position: relative;
    }
    
    .ai-text::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 15px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid rgba(0, 212, 255, 0.2);
    }
    
    .ai-text p {
        margin: 0;
        color: white;
    }
    
    .ai-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .ai-option {
        background: rgba(0, 212, 255, 0.05);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 10px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: #cbd5e1;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .ai-option:hover {
        background: rgba(0, 212, 255, 0.1);
        border-color: var(--neon-blue);
        transform: translateY(-2px);
        color: white;
    }
    
    .ai-option i {
        font-size: 1.5rem;
        color: var(--neon-blue);
    }
    
    .ai-modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid rgba(0, 212, 255, 0.1);
        text-align: center;
        color: #94a3b8;
        font-size: 0.875rem;
    }
    
    .ai-modal-footer i {
        margin-right: 5px;
    }
    
    /* AI Copy Effect */
    .ai-copy-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.2), transparent);
        animation: shine 1s ease;
    }
    
    /* AI Spinner */
    .ai-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Mobile-specific AI styles */
    @media (max-width: 768px) {
        .ai-modal-content {
            width: 95%;
            margin: 1rem;
        }
        
        .ai-options {
            grid-template-columns: 1fr;
        }
        
        .ai-modal-header {
            padding: 1rem;
        }
        
        .ai-modal-body {
            padding: 1rem;
        }
        
        .ai-message {
            margin-bottom: 1.5rem;
        }
    }
    
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
        
        .ai-modal-content {
            margin: 0.5rem;
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

document.head.appendChild(aiStyles);

// Export functions for global access (if needed)
window.copyEmail = copyEmail;
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.showAIAssistant = showAIAssistant;