# EmailJS Setup for GitHub Pages + SiteGround Email

Since your website is hosted on **GitHub Pages** (static hosting) and only your **domain/email is on SiteGround**, we need EmailJS to handle form submissions.

## 🚀 Quick Setup (10 minutes)

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month)
3. Verify your email address

### Step 2: Connect Your SiteGround Email
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail/Outlook/Other"** or **"Custom SMTP"**
4. For SiteGround email, use **Custom SMTP**:
   - **SMTP Server**: `mail.vonsit.com`
   - **Port**: `587` (TLS) or `465` (SSL)
   - **Username**: `von@vonsit.com`
   - **Password**: Your email password
   - **Security**: TLS or SSL
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

## 📞 Support
- **EmailJS Issues**: Check their documentation or support
- **Email Not Received**: Check SiteGround email configuration
- **Form Errors**: Check browser console for error messages

This setup is perfect for static sites and works seamlessly with GitHub Pages! 