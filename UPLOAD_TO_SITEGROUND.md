# Upload to SiteGround - Quick Guide

## 🎯 Upload the PHP File (2 minutes)

### Method 1: File Manager (Easiest)
1. **Login to SiteGround cPanel**
   - Go to [siteground.com](https://www.siteground.com)
   - Login to your account
   - Click "Go to cPanel"

2. **Open File Manager**
   - Find "File Manager" in cPanel
   - Click to open it

3. **Navigate to Your Website Root**
   - Go to `public_html` folder
   - This is where your `index.html` file should be

4. **Upload the PHP File**
   - Click "Upload" button in File Manager
   - Select `send-quote.php` from your computer
   - Upload it to the same folder as `index.html`

### Method 2: FTP (Advanced)
If you prefer FTP:
1. **Use FTP client** (FileZilla, WinSCP, etc.)
2. **Connect to your SiteGround FTP**:
   - Host: Your domain name
   - Username: Your cPanel username
   - Password: Your cPanel password
3. **Upload `send-quote.php`** to the root directory

## ✅ Verify Upload

1. **Test PHP file directly**:
   - Go to `https://vonsit.com/send-quote.php`
   - You should see a blank page or JSON error (this is normal)
   - If you see "404 Not Found", the file isn't uploaded correctly

2. **Test the contact form**:
   - Fill out your website's contact form
   - Should now show green success message
   - Check your email at `von@vonsit.com`

## 🛠️ Troubleshooting

### If still getting errors:

1. **Check file permissions**:
   - In File Manager, right-click `send-quote.php`
   - Set permissions to `644`

2. **Verify PHP is enabled**:
   - Most SiteGround accounts have PHP enabled by default
   - Contact SiteGround support if needed

3. **Check email configuration**:
   - Ensure `von@vonsit.com` email exists in cPanel
   - Check spam folder for test emails

## 🎉 Demo Mode

Until you upload the PHP file, the form will work in "Demo Mode":
- Shows success message with "(Demo Mode - PHP not available)"
- No actual email is sent
- Perfect for testing the UI/UX

## 📞 Need Help?

- **SiteGround Support**: Available 24/7 via chat/phone
- **File Upload Issues**: They can help with cPanel access
- **Email Configuration**: They can verify your email setup

Once uploaded, your contact form will send real emails to `von@vonsit.com`! 