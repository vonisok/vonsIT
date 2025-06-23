// Netlify Function for Quote Form Submission
// Uses Gmail SMTP for direct email sending

const nodemailer = require('nodemailer');

// Configure Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER, // von@vonsit.com
      pass: process.env.GMAIL_PASS  // Gmail App Password
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

// Spam protection keywords
const SPAM_KEYWORDS = ['casino', 'viagra', 'lottery', 'winner', 'million dollars', 'cryptocurrency', 'bitcoin'];

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse form data
    const formData = new URLSearchParams(event.body);
    
    // Extract form fields
    const name = formData.get('name')?.trim() || '';
    const email = formData.get('email')?.trim() || '';
    const phone = formData.get('phone')?.trim() || '';
    const projectType = formData.get('project-type')?.trim() || '';
    const budgetRange = formData.get('budget-range')?.trim() || '';
    const projectDetails = formData.get('project-details')?.trim() || '';
    const referralSource = formData.get('referral-source')?.trim() || '';
    const newsletterOptIn = formData.get('newsletter-opt-in') === 'yes';

    // Validate required fields
    if (!name || !email || !projectType || !budgetRange) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['name', 'email', 'project-type', 'budget-range']
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Basic spam protection
    const combinedText = (name + ' ' + email + ' ' + projectDetails).toLowerCase();
    const hasSpamKeywords = SPAM_KEYWORDS.some(keyword => combinedText.includes(keyword));
    
    if (hasSpamKeywords) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Message flagged as spam' })
      };
    }

    // Rate limiting by IP
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || event.headers['x-real-ip'] || 'unknown';
    const now = Date.now();
    const rateLimitKey = `rate_limit_${clientIP}`;
    
    if (rateLimitStore.has(rateLimitKey)) {
      const lastSubmission = rateLimitStore.get(rateLimitKey);
      if (now - lastSubmission < 60000) { // 1 minute cooldown
        return {
          statusCode: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Please wait before submitting another form' })
        };
      }
    }

    // Update rate limit
    rateLimitStore.set(rateLimitKey, now);

    // Create timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Create email content
    const subject = `[QUOTE REQUEST] ${projectType} - ${budgetRange} | ${name}`;
    
    const emailBody = `
🎯 NEW QUOTE REQUEST FROM VONSIT.COM

📅 SUBMITTED: ${timestamp}

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
Generated on: ${timestamp}
Client IP: ${clientIP}
    `.trim();

    // Create transporter and send email
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'vonsIT Contact Form',
        address: process.env.GMAIL_USER
      },
      to: process.env.GMAIL_USER, // von@vonsit.com
      replyTo: {
        name: name,
        address: email
      },
      subject: subject,
      text: emailBody,
      headers: {
        'X-Originating-IP': clientIP,
        'X-Form-Source': 'vonsit.com',
        'X-Submission-Time': timestamp
      }
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Clean up old rate limit entries (simple cleanup)
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value > 3600000) { // Remove entries older than 1 hour
        rateLimitStore.delete(key);
      }
    }

    // Log successful submission
    console.log(`Quote form submitted successfully from: ${email} (${clientIP})`);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: `Thank you, ${name}! Your quote request has been sent successfully. We'll get back to you within 24 hours at ${email}.`
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to send email. Please try again or contact von@vonsit.com directly.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
}; 