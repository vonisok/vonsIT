// Netlify Forms Handler for vonsIT Quote Form
// Enhanced UX with Netlify's built-in form processing and Gmail SMTP

// Form submission handling for Netlify
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return; // Exit if form doesn't exist on this page
    
    quoteForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const messagesDiv = document.getElementById('form-messages');
    const submitBtn = document.getElementById('submit-btn');
    const formData = new FormData(form);
    
    // Get form values for validation and UX
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const projectType = formData.get('project-type').trim();
    const budgetRange = formData.get('budget-range').trim();
    
    // Enhanced validation
    if (!name || !email || !projectType || !budgetRange) {
        showMessage('Please fill in all required fields (marked with *)', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    showMessage('Sending your request...', 'loading');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Submit to Netlify Forms
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        if (response.ok) {
            // Success
            showMessage(`✅ Thank you, ${name}! Your quote request has been sent successfully. Redirecting...`, 'success');
            form.reset();
            
            // Track form submission for Google Analytics
            if (typeof gtag !== 'undefined') {
                // Standard Analytics event
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: 'quote_request',
                    value: budgetRange
                });
                
                // Google Ads conversion tracking - DISABLED until conversion ID is configured
                // Uncomment and configure when you have your Google Ads conversion ID
                /*
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXXXXXX/CONVERSION_LABEL', // Replace with your actual conversion ID/label
                    'value': 1.0,
                    'currency': 'USD',
                    'transaction_id': Date.now().toString() // Unique transaction ID
                });
                */
                
                // Enhanced conversion tracking (more detailed)
                gtag('event', 'generate_lead', {
                    'currency': 'USD',
                    'value': 1.0,
                    'event_category': 'ecommerce',
                    'event_label': 'quote_request_submission',
                    'project_type': projectType,
                    'budget_range': budgetRange
                });
            }
            
            // Generate random token and redirect to confirmation page
            const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            
            setTimeout(() => {
                try {
                    window.location.href = `/quote-confirmed?token=${randomToken}`;
                } catch (error) {
                    console.error('Redirect error:', error);
                    // Fallback: show success message instead of redirect
                    showMessage(`✅ Thank you, ${name}! Your quote request has been sent successfully. We'll get back to you within 24 hours.`, 'success');
                }
            }, 1500);
            
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('There was an error sending your message. Please try again or contact von@vonsit.com directly.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get My Custom Quote →';
    });
    });
});

// Helper function to show messages
function showMessage(message, type) {
    const messagesDiv = document.getElementById('form-messages');
    messagesDiv.textContent = message;
    messagesDiv.className = `form-messages ${type}`;
    messagesDiv.style.display = 'block';
    
    // Auto-hide messages after appropriate time
    let hideDelay = 0;
    switch(type) {
        case 'error':
            hideDelay = 8000; // 8 seconds for errors
            break;
        case 'loading':
            hideDelay = 15000; // 15 seconds safety for loading
            break;
        case 'success':
            hideDelay = 10000; // 10 seconds for success
            break;
    }
    
    if (hideDelay > 0) {
        setTimeout(() => {
            if (messagesDiv.classList.contains(type)) {
                messagesDiv.style.display = 'none';
            }
        }, hideDelay);
    }
}

// Enhanced form UX improvements
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quoteForm');
    const submitBtn = document.getElementById('submit-btn');
    
    // Exit if form elements don't exist on this page
    if (!form || !submitBtn) return;
    
    // Add form field animations and improvements
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            
            // Add validation feedback
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            } else if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value)) {
                    this.style.borderColor = 'rgba(34, 197, 94, 0.6)';
                } else {
                    this.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                }
            } else if (this.value.trim()) {
                this.style.borderColor = 'rgba(34, 197, 94, 0.6)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }
        });
        
        // Real-time validation feedback
        input.addEventListener('input', function() {
            if (this.style.borderColor.includes('239, 68, 68')) {
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }
        });
    });
    
    // Add form progress indicator
    const requiredFields = form.querySelectorAll('[required]');
    
    function updateProgress() {
        let filled = 0;
        requiredFields.forEach(field => {
            if (field.value.trim()) filled++;
        });
        
        const progress = (filled / requiredFields.length) * 100;
        
        // Update submit button based on progress
        if (progress === 100) {
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            submitBtn.style.transform = 'scale(1.02)';
        } else {
            submitBtn.style.background = 'linear-gradient(135deg, #4f46e5, #ec4899)';
            submitBtn.style.transform = 'scale(1)';
        }
    }
    
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Page loading animation
document.body.style.opacity = '0';

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
}); 