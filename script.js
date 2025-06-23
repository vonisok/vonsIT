// Modal functionality
function openQuoteModal() {
    document.getElementById('quoteModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    document.getElementById('quoteModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('quoteModal');
    if (event.target == modal) {
        closeQuoteModal();
    }
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuoteModal();
    }
});

// Initialize EmailJS
(function() {
    emailjs.init("UqQaBw_B9feqjwjR0"); // Replace with your actual EmailJS public key
})();

// Form submission handling
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const messagesDiv = document.getElementById('form-messages');
    const submitBtn = document.getElementById('submit-btn');
    
    // Get form data with proper selectors
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();
    const projectType = form.querySelector('select[name="project-type"]').value.trim();
    const budgetRange = form.querySelector('select[name="budget-range"]').value.trim();
    const projectDetails = form.querySelector('textarea[name="project-details"]').value.trim();
    const referralSource = form.querySelector('input[name="referral-source"]').value.trim();
    const newsletterOptIn = form.querySelector('input[name="newsletter-opt-in"]').checked;
    
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
    
    // Get current timestamp
    const currentDate = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
    
    // Create well-formatted email content
    const emailSubject = `[QUOTE REQUEST] ${projectType} - ${budgetRange} | ${name}`;
    const emailBody = `
🎯 NEW QUOTE REQUEST FROM VONSIT.COM

📅 SUBMITTED: ${currentDate}

👤 CLIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${name}
• Email: ${email}
• Phone: ${phone || 'Not provided'}

💼 PROJECT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Project Type: ${projectType}
• Budget Range: ${budgetRange}
• How They Found Us: ${referralSource || 'Not specified'}
• Newsletter Opt-in: ${newsletterOptIn ? 'Yes' : 'No'}

📝 PROJECT DESCRIPTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${projectDetails || 'No additional details provided'}

🔗 NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review project requirements
2. Prepare detailed quote
3. Send proposal within 24 hours to: ${email}

---
This message was sent from vonsIT.com contact form
Generated on: ${currentDate}
    `.trim();
    
    // Prepare template parameters for EmailJS with improved formatting
    const templateParams = {
        to_email: 'von@vonsit.com',
        from_name: name,
        from_email: email,
        reply_to: email,
        subject: emailSubject,
        message: emailBody,
        
        // Individual fields for template flexibility
        client_name: name,
        client_email: email,
        client_phone: phone || 'Not provided',
        project_type: projectType,
        budget_range: budgetRange,
        project_details: projectDetails || 'No additional details provided',
        referral_source: referralSource || 'Not specified',
        newsletter_opt_in: newsletterOptIn ? 'Yes' : 'No',
        submission_date: currentDate
    };
    
    // Send email using EmailJS
    emailjs.send('service_hizp1xz', 'template_8tzebgb', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage(`✅ Thank you, ${name}! Your quote request has been sent successfully. We'll get back to you within 24 hours at ${email}.`, 'success');
            form.reset();
            
            // Close modal after a delay
            setTimeout(() => {
                closeQuoteModal();
            }, 3000);
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showMessage('Email service error - please contact von@vonsit.com directly. (Error Code: EMAILJS-001)', 'error');
        })
        .finally(function() {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get My Custom Quote →';
        });
});

// Helper function to show messages
function showMessage(message, type) {
    const messagesDiv = document.getElementById('form-messages');
    messagesDiv.textContent = message;
    messagesDiv.className = `form-messages ${type}`;
    messagesDiv.style.display = 'block';
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messagesDiv.style.display = 'none';
        }, 5000);
    }
}

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

navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// Add mobile menu styles dynamically
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 0 0 15px 15px;
        }
        
        .nav-menu.active li {
            margin: 0.5rem 0;
        }
        
        .nav-menu.active .nav-cta {
            display: inline-block;
            text-align: center;
            margin: 0.5rem auto;
        }
        
        .nav {
            position: relative;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-item, .service-card, .testimonial');
    const processSteps = document.querySelectorAll('.step');
    const processConclusion = document.querySelector('.process-conclusion');
    
    // Handle regular animated elements
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Special observer for process section with staggered animations
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger process steps animations
                processSteps.forEach((step, index) => {
                    step.style.animationPlayState = 'running';
                });
                
                // Trigger conclusion animation
                if (processConclusion) {
                    processConclusion.style.animationPlayState = 'running';
                }
                
                processObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Set initial state for process elements and add wireframe borders
    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.animationPlayState = 'paused';
        
        // Add wireframe border element
        const wireframeBorder = document.createElement('div');
        wireframeBorder.className = 'wireframe-border';
        wireframeBorder.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px dashed rgba(99, 102, 241, 0.3);
            border-radius: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        `;
        step.appendChild(wireframeBorder);
        
        // Add hover effect for wireframe border
        step.addEventListener('mouseenter', () => {
            wireframeBorder.style.opacity = '1';
        });
        
        step.addEventListener('mouseleave', () => {
            wireframeBorder.style.opacity = '0';
        });
    });
    
    if (processConclusion) {
        processConclusion.style.animationPlayState = 'paused';
    }
    
    // Observe the process section
    const processSection = document.querySelector('.process');
    if (processSection) {
        processObserver.observe(processSection);
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Tech stack animation handling
document.addEventListener('DOMContentLoaded', function() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
        const delay = parseFloat(getComputedStyle(item).getPropertyValue('--delay').replace('s', '')) * 1000;
        const entranceDelay = delay + 800;
        
        setTimeout(() => {
            item.classList.add('loaded');
        }, entranceDelay);
    });
});

// Page loading animation
document.body.style.opacity = '0';

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
}); 