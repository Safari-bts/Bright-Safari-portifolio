// AI Effects & Animations

document.addEventListener('DOMContentLoaded', function() {
    // Create AI Particles
    createAIParticles();
    
    // Initialize skill bar animations
    initSkillBarAnimations();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Add typing effect to AI text
    initTypingEffect();
    
    // Add hover effects to achievement cards
    initAchievementHoverEffects();
});

// Create floating AI particles
function createAIParticles() {
    const particlesContainer = document.getElementById('aiParticles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ai-particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Set styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 212, 255, 0.3);
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            animation: floatParticle ${duration}s infinite ease-in-out ${delay}s;
            opacity: ${opacity};
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-20px) translateX(10px);
            }
            50% {
                transform: translateY(10px) translateX(-10px);
            }
            75% {
                transform: translateY(-10px) translateX(-5px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize skill bar animations on scroll
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0';
                
                setTimeout(() => {
                    skillBar.style.transition = 'width 1.5s ease-in-out';
                    skillBar.style.width = width;
                }, 300);
                
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.achievement-card, .project-card, .milestone-card, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize typing effect for AI text
function initTypingEffect() {
    const aiHighlight = document.querySelector('.ai-highlight');
    if (!aiHighlight) return;
    
    const text = aiHighlight.textContent;
    aiHighlight.textContent = '';
    
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            aiHighlight.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            // Add blinking cursor effect
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            aiHighlight.appendChild(cursor);
            
            setInterval(() => {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }, 500);
        }
    }, 100);
}

// Initialize achievement card hover effects
function initAchievementHoverEffects() {
    const cards = document.querySelectorAll('.achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const badge = card.querySelector('.certificate-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
                badge.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const badge = card.querySelector('.certificate-badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
                badge.style.boxShadow = 'none';
            }
        });
    });
}

// Add parallax effect to background
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.ai-node, .profile-picture-container');
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createAIParticles();
    initSkillBarAnimations();
    initScrollAnimations();
    initTypingEffect();
    initAchievementHoverEffects();
    initParallaxEffect();
    
    // Add click effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
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
                ripple.remove();
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