// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const contactForm = document.getElementById('contactForm');

// Google Analytics Event Tracking
function trackEvent(category, action, label, value = 1) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
        console.log(`GA Event: ${category} - ${action} - ${label}`);
    }
}

// Track page view with custom parameters
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-6M1BLSXKPQ', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }
}

// Theme Toggle Functionality
function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme');
    
    // Update icon
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    themeIcons.forEach(icon => {
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    });
    
    // Save to localStorage
    localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
    
    // Track theme change
    trackEvent('Settings', 'theme_toggle', isDark ? 'to_light' : 'to_dark');
}

// Initialize theme
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
    const isOpening = !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    
    // Track mobile menu interaction
    if (isOpening) {
        trackEvent('Navigation', 'mobile_menu_open', 'open');
    }
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
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
                // Track navigation click
                const linkText = this.textContent.trim() || this.querySelector('i')?.className || 'unknown';
                trackEvent('Navigation', 'section_navigate', linkText);
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Calculate position
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Form submission handler with tracking
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Track form submission attempt
    trackEvent('Contact', 'form_submit_attempt', data.subject || 'unknown');
    
    // Validate form
    if (!data.name || !data.email || !data.message) {
        showFormStatus('error', 'Please fill in all required fields.');
        trackEvent('Contact', 'form_validation_failed', 'missing_fields');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Track successful validation
    trackEvent('Contact', 'form_validation_success', data.subject);
    
    // Submit the form (FormSubmit.co will handle it)
    // Since we're using FormSubmit.co, we can just let the form submit normally
    // But we'll add a small delay to ensure tracking happens
    setTimeout(() => {
        contactForm.submit();
        
        // Track successful submission
        trackEvent('Contact', 'form_submit_success', data.subject, 1);
        
        // Show success message (will redirect to thank-you page)
        showFormStatus('success', 'Sending message...');
    }, 1000);
}

// Show form status messages
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
        ${message}
    `;
    
    contactForm.parentNode.insertBefore(status, contactForm.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (status.parentNode) {
            status.style.opacity = '0';
            status.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (status.parentNode) status.parentNode.removeChild(status);
            }, 300);
        }
    }, 5000);
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
                
                // Track skill section view
                const skillName = skillBar.closest('.skill-item')?.querySelector('.skill-name')?.textContent || 'unknown';
                trackEvent('Skills', 'skill_view', skillName);
                
                // Animate skill bar
                setTimeout(() => {
                    skillBar.style.transition = 'width 1.5s ease-in-out';
                    skillBar.style.width = width;
                }, 300);
                
                // Stop observing
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = 'var(--shadow)';
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Setup event tracking for various interactions
function setupEventTracking() {
    // Track social media clicks
    document.querySelectorAll('[id$="Link"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkType = this.id.replace('Link', '').replace('Btn', '');
            trackEvent('Social', 'social_click', linkType);
        });
    });
    
    // Track project clicks
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const projectTitle = this.closest('.project-card')?.querySelector('.project-title')?.textContent || 'unknown';
            trackEvent('Projects', 'project_click', projectTitle);
        });
    });
    
    // Track gallery image clicks
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const imgId = this.querySelector('img')?.id || 'unknown';
            trackEvent('Gallery', 'image_click', imgId);
        });
    });
    
    // Track achievement card clicks
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.achievement-title')?.textContent || 'unknown';
            trackEvent('Achievements', 'achievement_view', title);
        });
    });
    
    // Track external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('External', 'external_link_click', this.href);
        });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.id.includes('submitBtn') && !btn.id.includes('clearFormBtn')) {
            btn.addEventListener('click', function() {
                const btnText = this.textContent.trim() || this.querySelector('i')?.className || 'unknown';
                trackEvent('Buttons', 'button_click', btnText);
            });
        }
    });
    
    // Track copy email
    document.querySelectorAll('.contact-link').forEach(link => {
        if (link.href.startsWith('mailto:')) {
            link.addEventListener('click', function() {
                trackEvent('Contact', 'direct_email_click', 'email_link');
            });
        }
    });
    
    // Track WhatsApp clicks
    document.querySelectorAll('[href*="wa.me"], [href*="whatsapp"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Contact', 'whatsapp_click', 'whatsapp_link');
        });
    });
    
    // Track SMS clicks
    document.querySelectorAll('[href^="sms:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Contact', 'sms_click', 'sms_link');
        });
    });
}

// Track scroll depth
function initScrollTracking() {
    const sections = document.querySelectorAll('section');
    const viewedSections = new Set();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !viewedSections.has(entry.target.id)) {
                viewedSections.add(entry.target.id);
                const sectionName = entry.target.querySelector('.section-title')?.textContent || entry.target.id;
                trackEvent('Engagement', 'section_view', sectionName);
                
                // Track time on page
                if (entry.target.id === 'home') {
                    const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);
                    trackEvent('Engagement', 'time_on_page', `${timeOnPage}s`);
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Track form field interactions
function trackFormInteractions() {
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            trackEvent('Contact', 'form_field_focus', this.name || this.id);
        });
        
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                trackEvent('Contact', 'form_field_filled', this.name || this.id);
            }
        });
    });
}

// Initialize everything
let pageLoadTime = Date.now();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initTheme();
    initSmoothScrolling();
    initSkillBars();
    initNavbarScroll();
    initScrollTracking();
    
    // Setup event listeners
    themeToggle.addEventListener('click', toggleTheme);
    mobileThemeToggle.addEventListener('click', toggleTheme);
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    // Form handling
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        trackFormInteractions();
        
        // Clear form button
        const clearFormBtn = document.getElementById('clearFormBtn');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', function() {
                trackEvent('Contact', 'form_clear', 'clear_form');
            });
        }
    }
    
    // Setup event tracking
    setupEventTracking();
    
    // Scroll to form button
    const scrollToFormBtn = document.getElementById('scrollToFormBtn');
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', function() {
            trackEvent('Navigation', 'scroll_to_form', 'contact_form');
            document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Track page load
    trackEvent('Engagement', 'page_load', document.title);
    trackPageView();
    
    // Track initial page view after a brief delay
    setTimeout(() => {
        const initialSection = document.querySelector('section:not([style*="display: none"])')?.id || 'home';
        trackEvent('Engagement', 'initial_section_view', initialSection);
    }, 1000);
});

// Track visibility change (tab switching)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        trackEvent('Engagement', 'tab_return', 'user_returned');
    } else {
        const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);
        trackEvent('Engagement', 'tab_away', `${timeOnPage}s`);
    }
});

// Track beforeunload (page leaving)
window.addEventListener('beforeunload', function() {
    const totalTime = Math.floor((Date.now() - pageLoadTime) / 1000);
    trackEvent('Engagement', 'page_exit', `${totalTime}s`, totalTime);
    
    // Track scroll depth on exit
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    trackEvent('Engagement', 'scroll_depth_on_exit', `${scrollPercent}%`, scrollPercent);
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const projectTitle = this.querySelector('.project-title')?.textContent || 'unknown';
            trackEvent('Projects', 'project_hover', projectTitle);
        });
    });
    
    // Add click effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Track window resize (responsive design usage)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const width = window.innerWidth;
        let deviceType = 'desktop';
        
        if (width < 768) deviceType = 'mobile';
        else if (width < 992) deviceType = 'tablet';
        
        trackEvent('Device', 'window_resize', `${deviceType}_${width}px`);
    }, 500);
});