// Alternative Contact Form Handler
// Can use either PHP backend or EmailJS based on configuration

// Configuration - set USE_PHP_BACKEND to true to use the PHP handler
const USE_PHP_BACKEND = false; // Set to true when you have PHP hosting
const PHP_HANDLER_URL = '/contact-handler.php';

// Initialize EmailJS only if not using PHP backend
if (!USE_PHP_BACKEND) {
    (function() {
        emailjs.init("UqQaBw_B9feqjwjR0"); // Replace with your actual EmailJS public key
    })();
}

// Enhanced form submission handling
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const messagesDiv = document.getElementById('form-messages');
    const submitBtn = document.getElementById('submit-btn');
    
    // Get form data
    const formData = {
        name: form.querySelector('input[name="name"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        phone: form.querySelector('input[name="phone"]').value.trim(),
        project_type: form.querySelector('select[name="project-type"]').value.trim(),
        budget_range: form.querySelector('select[name="budget-range"]').value.trim(),
        project_details: form.querySelector('textarea[name="project-details"]').value.trim(),
        referral_source: form.querySelector('input[name="referral-source"]').value.trim(),
        newsletter_opt_in: form.querySelector('input[name="newsletter-opt-in"]').checked
    };
    
    // Enhanced validation
    if (!formData.name || !formData.email || !formData.project_type || !formData.budget_range) {
        showMessage('Please fill in all required fields (marked with *)', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    showMessage('Sending your request...', 'loading');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Choose submission method
    if (USE_PHP_BACKEND) {
        submitViaPHP(formData, form, submitBtn);
    } else {
        submitViaEmailJS(formData, form, submitBtn);
    }
});

// PHP Backend submission
function submitViaPHP(formData, form, submitBtn) {
    fetch(PHP_HANDLER_URL, {
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
                if (typeof closeQuoteModal === 'function') {
                    closeQuoteModal();
                }
            }, 3000);
        } else {
            showMessage(data.message || 'Failed to send email. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    })
    .finally(() => {
        resetSubmitButton(submitBtn);
    });
}

// EmailJS submission (improved version)
function submitViaEmailJS(formData, form, submitBtn) {
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
    const emailSubject = `[QUOTE REQUEST] ${formData.project_type} - ${formData.budget_range} | ${formData.name}`;
    const emailBody = `
🎯 NEW QUOTE REQUEST FROM VONSIT.COM

📅 SUBMITTED: ${currentDate}

👤 CLIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone || 'Not provided'}

💼 PROJECT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Project Type: ${formData.project_type}
• Budget Range: ${formData.budget_range}
• How They Found Us: ${formData.referral_source || 'Not specified'}
• Newsletter Opt-in: ${formData.newsletter_opt_in ? 'Yes' : 'No'}

📝 PROJECT DESCRIPTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.project_details || 'No additional details provided'}

🔗 NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review project requirements
2. Prepare detailed quote
3. Send proposal within 24 hours to: ${formData.email}

---
This message was sent from vonsIT.com contact form
Generated on: ${currentDate}
    `.trim();
    
    // Prepare template parameters for EmailJS with improved formatting
    const templateParams = {
        to_email: 'von@vonsit.com',
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email,
        subject: emailSubject,
        message: emailBody,
        
        // Individual fields for template flexibility
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone || 'Not provided',
        project_type: formData.project_type,
        budget_range: formData.budget_range,
        project_details: formData.project_details || 'No additional details provided',
        referral_source: formData.referral_source || 'Not specified',
        newsletter_opt_in: formData.newsletter_opt_in ? 'Yes' : 'No',
        submission_date: currentDate
    };
    
    // Send email using EmailJS
    emailjs.send('service_hizp1xz', 'template_8tzebgb', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage(`✅ Thank you, ${formData.name}! Your quote request has been sent successfully. We'll get back to you within 24 hours at ${formData.email}.`, 'success');
            form.reset();
            
            // Close modal after a delay
            setTimeout(() => {
                if (typeof closeQuoteModal === 'function') {
                    closeQuoteModal();
                }
            }, 3000);
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showMessage('Email service error - please contact von@vonsit.com directly. (Error Code: EMAILJS-001)', 'error');
        })
        .finally(function() {
            resetSubmitButton(submitBtn);
        });
}

// Helper function to reset submit button
function resetSubmitButton(submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Get My Custom Quote →';
}

// Helper function to show messages
function showMessage(message, type) {
    const messagesDiv = document.getElementById('form-messages');
    messagesDiv.textContent = message;
    messagesDiv.className = `form-messages ${type}`;
    messagesDiv.style.display = 'block';
    
    // Auto-hide error messages after 8 seconds
    if (type === 'error') {
        setTimeout(() => {
            messagesDiv.style.display = 'none';
        }, 8000);
    }
    
    // Auto-hide loading messages after 10 seconds (safety)
    if (type === 'loading') {
        setTimeout(() => {
            if (messagesDiv.classList.contains('loading')) {
                messagesDiv.style.display = 'none';
            }
        }, 10000);
    }
} 