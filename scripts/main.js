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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme - FIRST!
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

    // Initialize neural canvas
    initNeuralCanvas();

    // Initialize scroll progress
    initScrollProgress();

    // Initialize cursor glow (desktop only)
    if (!isMobile()) {
        initCursorGlow();
    }

    // Initialize active nav tracking
    initActiveNav();

    // Initialize ripple effects on buttons
    initRippleEffect();

    // Initialize counters
    initCounters();
    
    // Initialize Intersection Observer for animations
    initAnimationObserver();
    
    // Initialize gallery animations - IMPORTANT!
    initGalleryAnimations();
    
    // Load gallery images
    loadGalleryImages();
    
    // Equalize card heights
    setTimeout(() => {
        equalizeCardHeights();
    }, 500);
});

// Theme Toggle Functionality - UPDATED
function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
        // Switch to light mode
        document.body.classList.remove('dark-theme');
        updateThemeIcon(false);
        localStorage.setItem('portfolio-theme', 'light');
    } else {
        // Switch to dark mode
        document.body.classList.add('dark-theme');
        updateThemeIcon(true);
        localStorage.setItem('portfolio-theme', 'dark');
    }
    
    // Send analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_toggle', {
            'event_category': 'Settings',
            'event_label': isDark ? 'light' : 'dark',
            'value': 1
        });
    }
}

// Update theme icon
function updateThemeIcon(isDark) {
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    
    themeIcons.forEach(icon => {
        if (isDark) {
            // Dark mode: show sun icon
            icon.className = 'fas fa-sun';
            icon.style.color = '#fbbf24';
        } else {
            // Light mode: show moon icon
            icon.className = 'fas fa-moon';
            icon.style.color = '#4f46e5';
        }
    });
}

// Initialize theme based on localStorage or system preference - UPDATED
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Always apply theme immediately
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeIcon(false);
    }
    
    // Add transition after initial load
    setTimeout(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 100);
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
    // Theme toggles - UPDATED
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
    
    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            // Only update if user hasn't set a preference
            if (e.matches) {
                document.body.classList.add('dark-theme');
                updateThemeIcon(true);
            } else {
                document.body.classList.remove('dark-theme');
                updateThemeIcon(false);
            }
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
            // Re-equalize card heights on resize
            equalizeCardHeights();
        }, 250);
    });
    
    // Add click listeners for gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                toggleGalleryItem(this);
            }
        });
    });
}

// Equalize card heights for better alignment
function equalizeCardHeights() {
    // Equalize project cards
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        let maxHeight = 0;
        
        // Reset heights first
        projectCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Find max height
        projectCards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        // Apply max height to all cards (only on desktop)
        if (!isMobile() && maxHeight > 0) {
            projectCards.forEach(card => {
                card.style.height = maxHeight + 'px';
            });
        }
    }
    
    // Equalize achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    if (achievementCards.length > 0) {
        let maxHeight = 0;
        
        // Reset heights first
        achievementCards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Find max height
        achievementCards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        // Apply max height to all cards (only on desktop)
        if (!isMobile() && maxHeight > 0) {
            achievementCards.forEach(card => {
                card.style.height = maxHeight + 'px';
            });
        }
    }
    
    // Equalize gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        let maxHeight = 0;
        
        // Reset heights first
        galleryItems.forEach(item => {
            item.style.height = 'auto';
        });
        
        // Find max height in each gallery section
        const galleries = document.querySelectorAll('.media-gallery');
        galleries.forEach(gallery => {
            const items = gallery.querySelectorAll('.gallery-item');
            let galleryMaxHeight = 0;
            
            items.forEach(item => {
                const height = item.offsetHeight;
                if (height > galleryMaxHeight) {
                    galleryMaxHeight = height;
                }
            });
            
            // Apply height to items in this gallery
            if (galleryMaxHeight > 0) {
                items.forEach(item => {
                    item.style.height = galleryMaxHeight + 'px';
                });
            }
        });
    }
}

// Initialize Gallery Animations - FIXED
function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Ensure animations work
        item.style.opacity = '1';
        item.style.visibility = 'visible';
        
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            // Ensure overlay is triggered
            const overlay = item.querySelector('.gallery-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translate(0, 0)';
            }
            
            // Trigger content animations
            const content = item.querySelector('.gallery-content');
            const icon = item.querySelector('.gallery-icon');
            const tags = item.querySelectorAll('.gallery-tag');
            
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
            
            if (icon) {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }
            
            tags.forEach((tag, index) => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
                tag.style.transitionDelay = `${0.4 + (index * 0.1)}s`;
            });
        });
        
        item.addEventListener('mouseleave', () => {
            // Reset to default state
            const overlay = item.querySelector('.gallery-overlay');
            const animation = item.getAttribute('data-animation');
            
            if (overlay) {
                overlay.style.opacity = '0';
                
                // Reset to original animation position
                switch(animation) {
                    case 'slide-top-left':
                        overlay.style.transform = 'translate(-100%, -100%)';
                        break;
                    case 'slide-top-right':
                        overlay.style.transform = 'translate(100%, -100%)';
                        break;
                    case 'slide-bottom-left':
                        overlay.style.transform = 'translate(-100%, 100%)';
                        break;
                    case 'slide-bottom-right':
                        overlay.style.transform = 'translate(100%, 100%)';
                        break;
                }
            }
            
            // Reset content
            const content = item.querySelector('.gallery-content');
            const icon = item.querySelector('.gallery-icon');
            const tags = item.querySelectorAll('.gallery-tag');
            
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(30px)';
                content.style.transitionDelay = '0s';
            }
            
            if (icon) {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(0)';
                icon.style.transitionDelay = '0s';
            }
            
            tags.forEach(tag => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(10px)';
                tag.style.transitionDelay = '0s';
            });
        });
        
        // Touch support for mobile
        item.addEventListener('touchstart', () => {
            item.classList.add('touch-active');
        }, { passive: true });
        
        item.addEventListener('touchend', (e) => {
            item.classList.remove('touch-active');
            
            // Trigger hover effect on tap
            setTimeout(() => {
                item.dispatchEvent(new Event('mouseenter'));
                
                // Auto-hide after 3 seconds
                setTimeout(() => {
                    item.dispatchEvent(new Event('mouseleave'));
                }, 3000);
            }, 100);
        }, { passive: true });
    });
    
    // Initialize intersection observer for lazy loading animations
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.gallery-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 200);
                });
                
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe gallery sections
    const gallerySections = document.querySelectorAll('.media-production, .afrikalearns');
    gallerySections.forEach(section => {
        galleryObserver.observe(section);
    });
}

// Toggle gallery item on mobile
function toggleGalleryItem(item) {
    const overlay = item.querySelector('.gallery-overlay');
    const content = item.querySelector('.gallery-content');
    const icon = item.querySelector('.gallery-icon');
    const tags = item.querySelectorAll('.gallery-tag');
    
    const isActive = item.classList.contains('mobile-active');
    
    if (isActive) {
        // Hide overlay
        item.classList.remove('mobile-active');
        overlay.style.opacity = '0';
        
        // Hide content
        content.style.opacity = '0';
        content.style.transform = 'translateY(30px)';
        
        // Hide icon
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0)';
        
        // Hide tags
        tags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
        });
    } else {
        // Show overlay
        item.classList.add('mobile-active');
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(0, 0)';
        
        // Show content
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 200);
        
        // Show icon
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, 300);
        
        // Show tags
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
            }, 400 + (index * 100));
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (item.classList.contains('mobile-active')) {
                toggleGalleryItem(item);
            }
        }, 5000);
    }
}

// FIXED: Image loading with fallback
function loadGalleryImages() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    galleryImages.forEach(img => {
        // Add loading class
        img.classList.add('loading');
        
        // Check if image is already loaded
        if (img.complete) {
            img.classList.remove('loading');
            img.classList.add('loaded');
        } else {
            // Load image
            img.onload = function() {
                this.classList.remove('loading');
                this.classList.add('loaded');
                
                // Trigger parent animation
                const parent = this.closest('.gallery-item');
                if (parent) {
                    parent.classList.add('image-loaded');
                }
                
                // Re-equalize heights after image loads
                setTimeout(() => {
                    equalizeCardHeights();
                }, 100);
            };
            
            img.onerror = function() {
                this.classList.remove('loading');
                console.error('Failed to load image:', this.src);
                // Set a fallback background
                this.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            };
        }
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
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
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
    const increment = target / 50;
    const duration = 1500;
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
    
    // Add submit listener
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearInputError);
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
    } else {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
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
        <div class="status-icon">
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
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
    
    // Auto-remove after 8 seconds on mobile, 10 seconds on desktop
    const autoRemoveTime = isMobile() ? 8000 : 10000;
    setTimeout(() => {
        if (status.parentNode) {
            status.remove();
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
    
    // Add mobile-specific gallery styles
    const mobileGalleryCSS = document.createElement('style');
    mobileGalleryCSS.textContent = `
        @media (max-width: 768px) {
            .gallery-item.mobile-active .gallery-overlay {
                opacity: 1 !important;
                transform: translate(0, 0) !important;
                background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 70%) !important;
            }
            
            .gallery-item.mobile-active .gallery-content {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .gallery-item.mobile-active .gallery-icon {
                opacity: 1 !important;
                transform: scale(1) !important;
            }
            
            .gallery-item.mobile-active .gallery-tag {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        }
    `;
    document.head.appendChild(mobileGalleryCSS);
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
        // Re-equalize card heights
        equalizeCardHeights();
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
                    
                    // Add fade-in effect
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

// Add WhatsApp floating button
function addWhatsAppButton() {
    // Only add on mobile or if user prefers reduced motion
    if (isMobile() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = 'https://wa.me/27637055413';
        whatsappBtn.target = '_blank';
        whatsappBtn.rel = 'noopener noreferrer';
        whatsappBtn.className = 'whatsapp-badge';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappBtn.title = 'Chat on WhatsApp';
        whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
        
        // Add AI animation
        whatsappBtn.style.animation = 'pulse 2s ease-in-out infinite';
        
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

// Copy email to clipboard with AI feedback
function copyEmail(e) {
    const element = e.target;
    const email = element.textContent.trim();
    
    navigator.clipboard.writeText(email).then(() => {
        const original = element.textContent;
        element.textContent = '📋 Copied to clipboard!';
        element.style.color = '#10b981';
        
        setTimeout(() => {
            element.textContent = original;
            element.style.color = '';
        }, 2000);
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

// Portfolio guide functionality. It intentionally gives guided answers from content
// already on this site; it does not claim to be a live AI chat service.
function showAIAssistant() {
    if (document.querySelector('.ai-modal')) return;

    const aiModal = document.createElement('div');
    aiModal.className = 'ai-modal';
    aiModal.innerHTML = `
        <div class="ai-modal-content" role="dialog" aria-modal="true" aria-labelledby="guideTitle">
            <div class="ai-modal-header">
                <h3 id="guideTitle"><i class="fas fa-robot"></i> Portfolio Guide</h3>
                <button class="ai-modal-close" aria-label="Close portfolio guide">&times;</button>
            </div>
            <div class="ai-modal-body">
                <div class="ai-message ai-bot">
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="ai-text">
                        <p>Hi! I can help you explore Bright’s work, skills, and ways to connect. What would you like to see?</p>
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
                <form class="ai-guide-form">
                    <label class="sr-only" for="guideQuestion">Ask about this portfolio</label>
                    <input id="guideQuestion" type="text" autocomplete="off" placeholder="Try: What does Bright build?">
                    <button type="submit" aria-label="Send question"><i class="fas fa-arrow-up"></i></button>
                </form>
            </div>
            <div class="ai-modal-footer">
                <p><i class="fas fa-info-circle"></i> A quick guide to this portfolio</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(aiModal);
    
    // Add animations
    setTimeout(() => {
        aiModal.classList.add('show');
    }, 10);
    
    const closeGuide = () => {
        aiModal.classList.remove('show');
        setTimeout(() => aiModal.remove(), 300);
    };

    const closeBtn = aiModal.querySelector('.ai-modal-close');
    closeBtn.addEventListener('click', closeGuide);
    closeBtn.focus();
    
    // Close on outside click
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            closeGuide();
        }
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeGuide();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Handle AI options
    const options = aiModal.querySelectorAll('.ai-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            handleAIAction(action);
        });
    });

    const guideForm = aiModal.querySelector('.ai-guide-form');
    const guideQuestion = aiModal.querySelector('#guideQuestion');
    guideForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = guideQuestion.value.trim();
        if (!question) return;
        addGuideMessage(aiModal, question, 'user');
        guideQuestion.value = '';
        window.setTimeout(() => addGuideMessage(aiModal, getGuideReply(question), 'bot'), 250);
    });
}

function addGuideMessage(modal, message, sender) {
    const body = modal.querySelector('.ai-modal-body');
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ai-${sender}`;
    messageEl.innerHTML = sender === 'bot'
        ? `<div class="ai-avatar"><i class="fas fa-robot"></i></div><div class="ai-text"><p></p></div>`
        : '<div class="ai-text"><p></p></div>';
    messageEl.querySelector('p').textContent = message;
    body.insertBefore(messageEl, body.querySelector('.ai-guide-form'));
    body.scrollTop = body.scrollHeight;
}

function getGuideReply(question) {
    const text = question.toLowerCase();
    if (/project|build|app|work/.test(text)) return 'Bright has built a church attendance app with real-time tracking, member records, and analytics. Choose “View Projects” to explore it.';
    if (/skill|technology|tech|stack|python|react/.test(text)) return 'Bright works with Python, FastAPI, PostgreSQL, React, Next.js, HTML/CSS, and JavaScript. Choose “See Skills” for the full list.';
    if (/contact|email|whatsapp|phone|hire|collaborat/.test(text)) return 'You can email Bright, send a WhatsApp message, or use the contact form. Choose “Contact Bright” and the page will take you there.';
    if (/about|student|education|uct|experience/.test(text)) return 'Bright is a Computer Science and AI student at the University of Cape Town, with interests in AI, full-stack development, cybersecurity, and live production.';
    return 'I can help you find Bright’s projects, skills, background, or contact details. Try one of the buttons above.';
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

// Add CSS for theme toggle and AI enhancements
const themeStyles = document.createElement('style');
themeStyles.textContent = `
    /* Theme-specific styles */
    .form-status {
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: fadeIn 0.3s ease;
    }
    
    .form-status.success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        color: #10b981;
    }
    
    .form-status.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }
    
    .form-status.info {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
        color: #3b82f6;
    }
    
    .status-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .form-status.success .status-icon {
        background: rgba(16, 185, 129, 0.2);
    }
    
    .form-status.error .status-icon {
        background: rgba(239, 68, 68, 0.2);
    }
    
    .form-status.info .status-icon {
        background: rgba(59, 130, 246, 0.2);
    }
    
    .status-content {
        flex: 1;
    }
    
    .status-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .status-close:hover {
        opacity: 1;
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
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Touch feedback */
    .touch-active {
        opacity: 0.7;
        transform: scale(0.98);
    }
    
    /* Reduce motion */
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
    
    /* WhatsApp button */
    .whatsapp-badge {
        position: fixed;
        bottom: 90px;
        left: 20px;
        width: 56px;
        height: 56px;
        background: #25D366;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        z-index: 999;
        text-decoration: none;
        transition: transform 0.3s ease;
    }
    
    .whatsapp-badge:hover {
        transform: scale(1.1);
    }
    
    /* AI Action Message */
    .ai-action-message {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00d4ff, #a855f7, #10b981);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease, fadeOut 0.3s ease 2s forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .whatsapp-badge {
            bottom: 100px;
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
        }
        
        .ai-action-message {
            top: 80px;
            font-size: 0.9rem;
            padding: 8px 16px;
        }
    }
`;

document.head.appendChild(themeStyles);

// Neural Network Canvas Animation
function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createNodes() {
        const count = isMobile() ? 20 : 40;
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1
            });
        }
    }

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update positions
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
            if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        });

        // Draw connections
        const maxDist = isMobile() ? 100 : 150;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    const alpha = 1 - dist / maxDist;
                    ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.4})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
            ctx.fill();
        });

        animFrame = requestAnimationFrame(drawFrame);
    }

    resize();
    createNodes();
    drawFrame();

    window.addEventListener('resize', () => {
        resize();
        createNodes();
    });

    // Pause when page not visible to save CPU
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animFrame);
        } else {
            drawFrame();
        }
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    }, { passive: true });
}

// Cursor Glow Effect
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Expand on interactive elements
        const target = e.target;
        if (target.matches('a, button, .btn, .project-card, .achievement-card, .gallery-item')) {
            glow.style.width = '60px';
            glow.style.height = '60px';
            glow.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)';
        } else {
            glow.style.width = '20px';
            glow.style.height = '20px';
            glow.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)';
        }
    }, { passive: true });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// Active Nav Link Tracking
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
}

// Ripple Effect on Buttons
function initRippleEffect() {
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
            this.appendChild(ripple);

            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// Export functions for global access
window.copyEmail = copyEmail;
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.showAIAssistant = showAIAssistant;
