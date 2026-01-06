/**
 * FormBackup.js - Contact form handler with Email.js integration
 * Free email service for contact forms
 */

class FormBackup {
    constructor() {
        // Email.js configuration (free service)
        this.emailjs = {
            service_id: 'service_hz81ggk', // Create your own at https://www.emailjs.com
            template_id: 'template_4n83fn8', // Create your template
            user_id: 'user_AbC123XyZ' // Your public key
        };
        
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Show loading state
        this.setLoading(true);
        
        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Validate
            if (!this.validate(data)) {
                throw new Error('Please fill in all required fields.');
            }
            
            // Send using multiple methods
            const results = await Promise.allSettled([
                this.sendViaEmailJS(data),
                this.sendViaSMTP(data),
                this.createLocalBackup(data)
            ]);
            
            // Check if at least one method succeeded
            const succeeded = results.some(result => result.status === 'fulfilled' && result.value);
            
            if (succeeded) {
                this.showSuccess();
                this.form.reset();
            } else {
                throw new Error('All sending methods failed. Please try emailing directly.');
            }
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    validate(data) {
        const required = ['name', 'email', 'subject', 'message'];
        return required.every(field => data[field] && data[field].trim());
    }
    
    async sendViaEmailJS(data) {
        try {
            // Load Email.js if not loaded
            if (typeof emailjs === 'undefined') {
                await this.loadEmailJS();
            }
            
            const templateParams = {
                to_name: 'Bright Safari',
                from_name: data.name,
                from_email: data.email,
                phone: data.phone || 'Not provided',
                subject: data.subject,
                message: data.message,
                reply_to: data.email
            };
            
            // Send using Email.js
            const response = await emailjs.send(
                this.emailjs.service_id,
                this.emailjs.template_id,
                templateParams,
                this.emailjs.user_id
            );
            
            console.log('Email.js success:', response);
            return true;
            
        } catch (error) {
            console.warn('Email.js failed:', error);
            return false;
        }
    }
    
    async sendViaSMTP(data) {
        try {
            // Using FormSubmit.co (free service)
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
                    _template: 'table'
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success === 'true') {
                console.log('FormSubmit success:', result);
                return true;
            }
            
            throw new Error(result.message || 'FormSubmit failed');
            
        } catch (error) {
            console.warn('SMTP failed:', error);
            return false;
        }
    }
    
    async createLocalBackup(data) {
        try {
            // Store in localStorage as backup
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            
            messages.push({
                timestamp: new Date().toISOString(),
                ...data,
                status: 'pending'
            });
            
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            
            // Also log to console for debugging
            console.log('Message saved locally:', data);
            
            return true;
            
        } catch (error) {
            console.warn('Local backup failed:', error);
            return false;
        }
    }
    
    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(this.emailjs.user_id);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setLoading(loading) {
        if (loading) {
            this.submitBtn.classList.add('btn-loading');
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<div class="btn-loading"></div>';
        } else {
            this.submitBtn.classList.remove('btn-loading');
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message <div class="ai-submit-effect"></div>';
        }
    }
    
    showSuccess() {
        this.showStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
    }
    
    showError(message) {
        this.showStatus('error', message || 'Failed to send message. Please try emailing directly.');
    }
    
    showStatus(type, message) {
        // Remove existing status
        const existing = document.querySelector('.form-status');
        if (existing) existing.remove();
        
        // Create new status
        const status = document.createElement('div');
        status.className = `form-status ${type}`;
        status.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        this.form.parentNode.insertBefore(status, this.form.nextSibling);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (status.parentNode) {
                status.style.opacity = '0';
                status.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (status.parentNode) status.parentNode.removeChild(status);
                }, 300);
            }
        }, 10000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FormBackup();
    
    // Add WhatsApp floating button
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/255748042678';
    whatsappBtn.target = '_blank';
    whatsappBtn.className = 'whatsapp-badge';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.title = 'Chat on WhatsApp';
    document.body.appendChild(whatsappBtn);
    
    // Add copy email functionality
    document.querySelectorAll('.contact-item').forEach(item => {
        const email = item.querySelector('p');
        if (email && email.textContent.includes('@')) {
            email.style.cursor = 'pointer';
            email.title = 'Click to copy';
            email.addEventListener('click', () => {
                navigator.clipboard.writeText(email.textContent.trim()).then(() => {
                    const original = email.textContent;
                    email.textContent = 'Copied!';
                    email.style.color = '#10b981';
                    setTimeout(() => {
                        email.textContent = original;
                        email.style.color = '';
                    }, 2000);
                });
            });
        }
    });
});