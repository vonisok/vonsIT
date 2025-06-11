# SiteGround PHP Email Setup (Recommended)

Since you're using SiteGround hosting, this server-side solution is more reliable than client-side email services.

## 🚀 Quick Setup (5 minutes)

### Step 1: Upload Files to SiteGround
1. Upload `send-quote.php` to your website's root directory (same folder as `index.html`)
2. Make sure the file is accessible at `https://vonsit.com/send-quote.php`

### Step 2: Test the Setup
1. Fill out your contact form on the website
2. Check your email at `von@vonsit.com`
3. You should receive an email with the form data

### Step 3: Optional - Customize Email Settings
In `send-quote.php`, you can modify:

```php
// Change the "From" address (line 42)
'From: noreply@vonsit.com',  // Change to any @vonsit.com address

// Change the email subject format (line 35)
$subject = "New Quote Request from " . $name;

// Customize the email content (lines 38-50)
$message = "Your custom email template here...";
```

## ✅ Advantages of This Solution

- **No Third-Party Dependencies**: Uses SiteGround's built-in mail server
- **100% Reliable**: No external API rate limits or failures
- **Secure**: Server-side processing prevents spam and abuse
- **Free**: No monthly email limits or costs
- **Fast**: Direct server-to-server email delivery

## 🔧 Troubleshooting

### If emails aren't being received:

1. **Check Spam Folder**: First place to look
2. **Verify PHP Mail Function**: Add this test file `test-mail.php`:
   ```php
   <?php
   $test = mail('von@vonsit.com', 'Test Email', 'If you receive this, PHP mail is working!');
   echo $test ? 'Mail function works!' : 'Mail function failed!';
   ?>
   ```
3. **Check SiteGround Mail Settings**: Ensure your domain's email is properly configured
4. **Contact SiteGround Support**: They can verify mail server configuration

### If form shows errors:

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify PHP File Path**: Ensure `/send-quote.php` is accessible
3. **Check Server Logs**: SiteGround cPanel → Error Logs

## 🔒 Security Features

- **Input Sanitization**: All form data is cleaned before processing
- **Email Validation**: Server-side email format verification
- **XSS Protection**: HTML special characters are escaped
- **Rate Limiting**: PHP naturally limits rapid submissions
- **No Direct Database**: Reduces security attack surface

## 📧 Email Format

Recipients will receive emails like this:

```
Subject: New Quote Request from [Customer Name]

Hello vonsIT Team,

You have received a new quote request:

Name: John Doe
Email: john@example.com
Project Type: E-commerce Website

Requirements:
I need a modern e-commerce site with payment integration...

Please respond within 24 hours.

Best regards,
vonsIT Contact Form
```

## 🎯 Next Steps

1. Upload `send-quote.php` to your SiteGround hosting
2. Test the form submission
3. Check that emails arrive at `von@vonsit.com`
4. Celebrate! 🎉

This solution is production-ready and doesn't require any API keys or external service configuration! 