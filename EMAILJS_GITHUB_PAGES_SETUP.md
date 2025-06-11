# EmailJS Setup for GitHub Pages + SiteGround Email

Since your website is hosted on **GitHub Pages** (static hosting) and only your **domain/email is on SiteGround**, we need EmailJS to handle form submissions.

## 🚀 Quick Setup (10 minutes)

### Step 0: Find Your SiteGround SMTP Settings
Before starting, you need to get your exact SMTP settings from SiteGround:

1. **Log into SiteGround cPanel**
2. **Go to Email** → **Email Accounts**
3. **Find your email account settings** or **create the email account** if needed
4. **Look for SMTP/Outgoing Mail settings** - common options:
   - `smtp.siteground.com`
   - Your server name (like `sg1234.siteground.us`)
   - Check SiteGround documentation for current servers

**Alternative**: Contact SiteGround support for current SMTP server details.

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month)
3. Verify your email address

### Step 2: Connect Your SiteGround Email
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail/Outlook/Other"** or **"Custom SMTP"**
4. For SiteGround email, use **Custom SMTP**:
   - **SMTP Server**: Choose one of these SiteGround servers:
     - `smtp.siteground.com` (primary)
     - `smtpout.secureserver.net` (alternative)
     - Or check your SiteGround cPanel for the exact server
   - **Port**: `587` (TLS recommended) or `465` (SSL)
   - **Username**: `von@vonsit.com`
   - **Password**: Your email password from SiteGround
   - **Security**: TLS (preferred) or SSL
5. Test the connection and save
6. Note your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

```
Subject: New Quote Request from {{from_name}}

Hello vonsIT Team,

You have received a new quote request from your website:

Name: {{from_name}}
Email: {{from_email}}
Project Type: {{project_type}}

Requirements:
{{message}}

Please respond within 24 hours.

Best regards,
vonsIT Website Contact Form
```

4. Save and note your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to **"Account"** → **"General"**
2. Copy your **Public Key** (e.g., `abc123def456`)

### Step 5: Update Your Website Code
In your `script.js` file, replace these 3 values:

```javascript
// Line ~26: Replace with your actual public key
emailjs.init("abc123def456");

// Line ~54: Replace with your actual service and template IDs
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

### Step 6: Push to GitHub
1. Commit and push changes to GitHub
2. GitHub Pages will automatically update your live site
3. Test your contact form

## ✅ Why This Works
- **GitHub Pages**: Serves your static website files
- **EmailJS**: Handles email sending from the browser
- **SiteGround**: Receives emails at `von@vonsit.com`
- **Free Tier**: 200 emails/month (perfect for most businesses)

## 🔧 Testing
1. Fill out your contact form
2. Check `von@vonsit.com` inbox (and spam folder)
3. Verify form shows green success message

## 🔧 Common SiteGround SMTP Issues

### If SMTP Connection Fails:
1. **Double-check server name** - try these in order:
   - `smtp.siteground.com`
   - Your specific server (e.g., `sg1234.siteground.us`)
   - `smtpout.secureserver.net`

2. **Verify email account exists**:
   - Log into SiteGround cPanel
   - Create `von@vonsit.com` if it doesn't exist
   - Set a strong password

3. **Check authentication**:
   - Use full email as username: `von@vonsit.com`
   - Use the exact password from SiteGround
   - Try both TLS (port 587) and SSL (port 465)

### Alternative: Use Gmail/Outlook
If SiteGround SMTP continues to fail:
1. **Create a Gmail account** (e.g., `vonsit.business@gmail.com`)
2. **Forward emails** from `von@vonsit.com` to Gmail
3. **Use Gmail SMTP** in EmailJS (much more reliable)

## 📞 Support
- **EmailJS Issues**: Check their documentation or support
- **SiteGround SMTP**: Contact SiteGround support for exact server settings
- **Form Errors**: Check browser console for error messages

This setup is perfect for static sites and works seamlessly with GitHub Pages! 