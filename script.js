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

// Form submission handling
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const messagesDiv = document.getElementById('form-messages');
    const submitBtn = document.getElementById('submit-btn');
    
    // Get form data with proper selectors
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const project = form.querySelector('input[name="project-type"]').value.trim();
    const message = form.querySelector('textarea[name="requirements"]').value.trim();
    
    // Enhanced validation
    if (!name || !email) {
        showMessage('Please fill in all required fields (Name and Email)', 'error');
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
    
    // Prepare form data
    const formData = {
        name: name,
        email: email,
        project_type: project || 'Not specified',
        requirements: message || 'No additional requirements specified'
    };
    
    // Send email using PHP endpoint
    fetch('/send-quote.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            form.reset();
            
            // Close modal after a delay
            setTimeout(() => {
                closeQuoteModal();
            }, 3000);
        } else {
            showMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Sorry, there was an error sending your request. Please try again or contact us directly at von@vonsit.com', 'error');
    })
    .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request to vonsIT';
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