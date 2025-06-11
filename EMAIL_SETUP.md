# EmailJS Setup Instructions

To enable email sending from your contact form, follow these steps:

## Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Connect SiteGround Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Custom SMTP"
4. Configure with your SiteGround SMTP settings:
   - **SMTP Server**: `mail.yourdomain.com` (replace with your actual domain)
   - **Port**: `587` (or `465` for SSL)
   - **Username**: `von@vonsit.com`
   - **Password**: Your email password
   - **Security**: `TLS` (or `SSL` if using port 465)
5. Test the connection
6. Note your **Service ID** (something like "service_abc123")

### SiteGround SMTP Settings:
- **Incoming Server (IMAP)**: `mail.yourdomain.com`
- **Outgoing Server (SMTP)**: `mail.yourdomain.com`
- **Port 587** (TLS) or **Port 465** (SSL)
- **Authentication**: Yes, use your full email and password

## Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

```
Subject: New Quote Request from {{from_name}}

Hello vonsIT Team,

You have received a new quote request:

Name: {{from_name}}
Email: {{from_email}}
Project Type: {{project_type}}

Requirements:
{{message}}

Please respond within 24 hours.

Best regards,
vonsIT Contact Form
```

4. Save the template and note your **Template ID** (something like "template_xyz789")

## Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** (something like "abc123def456")

## Step 5: Update Your Website
In your `script.js` file, replace these placeholders:

```javascript
// Replace "YOUR_PUBLIC_KEY" with your actual public key
emailjs.init("YOUR_PUBLIC_KEY");

// Replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID" with your actual IDs
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

## Example Configuration:
```javascript
// Initialize EmailJS
emailjs.init("abc123def456");

// Send email
emailjs.send('service_gmail123', 'template_contact789', templateParams)
```

## Testing
1. Fill out your contact form
2. Check your email at von@vonsit.com
3. Verify the email contains all form data

## Free Tier Limits
- 200 emails per month
- Perfect for most small business needs
- Upgrade available if needed

## Troubleshooting
- Check browser console for error messages
- Verify all IDs are correct
- Ensure email service is properly connected
- Test template in EmailJS dashboard first 