# Online Registration Form - Complete Setup Guide

A professional, responsive registration web application built with **HTML5, CSS3, JavaScript (jQuery), and PHP**. This is a production-ready Single Page Application (SPA) with client-side validation, AJAX form submission, and robust server-side security.

---

## 📁 Project Structure

```
registration-app/
├── index.html          # Main HTML file with form
├── style.css           # Responsive CSS styling
├── script.js           # jQuery AJAX & validation logic
├── process.php         # PHP backend processor
├── composer.json       # Heroku deployment configuration
├── Procfile            # Heroku process file
├── logs/               # Directory for registration logs (auto-created)
└── README.md           # This file
```

---

## 🚀 Quick Start (Local Development)

### Step 1: Install PHP Server Extension

1. Open **VS Code**
2. Go to **Extensions** (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for **"PHP Server"** by *brapifra*
4. Click **Install**

### Step 2: Run the Project

1. Right-click on `index.html` in the VS Code editor
2. Select **"PHP Server: Serve project"**
3. Your browser will open at `http://localhost:3000` (or `http://localhost:5500`)
4. The form is ready to use!

### Step 3: Test the Form

- Fill in all fields with valid data
- Click "Register Now"
- Success message displays without page reload (AJAX)
- Data is logged to `logs/registrations_YYYY-MM-DD.log`

---

## ✨ Features

### Frontend
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Modern UI** - Gradient background, smooth animations, FontAwesome icons
- ✅ **Real-time Validation** - Client-side validation on blur
- ✅ **Password Visibility Toggle** - Show/hide password option
- ✅ **Error Messages** - Clear, inline error feedback
- ✅ **Loading State** - Button disabled with spinner during submission
- ✅ **Flexbox Layout** - Professional, centered form design

### Backend
- ✅ **AJAX Integration** - Form submits without page reload
- ✅ **Input Sanitization** - Protection against XSS attacks
- ✅ **Email Validation** - Using PHP's `filter_var()`
- ✅ **Password Hashing** - Bcrypt with cost factor 12
- ✅ **Error Handling** - Graceful error responses with JSON
- ✅ **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- ✅ **CORS Headers** - Cross-Origin Resource Sharing enabled
- ✅ **Logging System** - Registration data logged to file

### Validation Rules

| Field | Rules |
|-------|-------|
| **Full Name** | 3-100 characters, letters/spaces/apostrophes only |
| **Email** | Valid email format, max 254 characters |
| **Phone** | 7-20 characters, numbers/+/-/spaces/parentheses |
| **Password** | Min 6, max 128 characters |
| **Confirm Password** | Must match password field |

---

## 🔒 Security Features

1. **Input Sanitization** - `htmlspecialchars()` prevents XSS
2. **Email Validation** - `filter_var(FILTER_VALIDATE_EMAIL)`
3. **Regex Validation** - Format checking for all fields
4. **Password Hashing** - bcrypt with cost 12
5. **Security Headers** - Prevents common web vulnerabilities
6. **Request Method Check** - POST-only endpoint
7. **SQL Injection Prevention** - Prepared statements (when DB is used)

---

## 💾 Data Storage Options

### Option 1: File Logging (Default)
Data is logged to `logs/registrations_YYYY-MM-DD.log` (JSON format).
Perfect for simple projects and testing.

### Option 2: MySQL Database (Recommended for Production)

To enable database storage, uncomment the database section in `process.php`:

```php
// In process.php, uncomment the DATABASE INTEGRATION section
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'registration_db';
```

Create the table:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 Cloud Deployment

### Option 1: InfinityFree (FREE & EASIEST)

**Why InfinityFree?** Free hosting, unlimited bandwidth, full PHP/MySQL support.

1. **Sign up** at [infinityfree.net](https://infinityfree.net)
2. **Create an Account** and verify email
3. **Create a Free Website** with custom domain (optional)
4. **Access File Manager** from your dashboard
5. **Navigate to `htdocs` folder** (your public directory)
6. **Upload files:**
   - `index.html`
   - `style.css`
   - `script.js`
   - `process.php`
   - Create `logs` folder (give write permissions)
7. **Access your form** at `https://yourdomain.infinityfree.net`

**Note:** InfinityFree uses cPanel. Ensure file permissions are set correctly (folders should be 755, files 644).

---

### Option 2: Heroku (FREE TIER - Limited)

**Note:** Heroku's free tier was discontinued in late 2024. If using Heroku, use paid plans.

**Files required:**
- `composer.json` ✅ (included)
- `Procfile` ✅ (included)

**Steps:**

1. **Install Heroku CLI** from [heroku.com/cli](https://www.heroku.com/cli)
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```
5. **Deploy:**
   ```bash
   git push heroku main
   ```
6. **Open app:**
   ```bash
   heroku open
   ```

   ---

   ### Option 3: Vercel (Recommended for static + serverless)

   This project now includes a Vercel serverless API at `/api/process` (Node.js). The API performs the same validation and password hashing as the original PHP backend and logs registration entries to the ephemeral filesystem (`/tmp`) on the server. Note: Vercel's filesystem is ephemeral — logs are temporary and may be removed. For production you should connect a persistent database (MySQL, Postgres, MongoDB) or storage (S3, Airtable, Firebase).

   Files added for Vercel:

   - `api/process.js` - Serverless function (handles POST JSON, validation, password hashing)
   - `package.json` - Declares `bcryptjs` dependency used by the function

   Quick Vercel deploy steps:

   1. Install Vercel CLI (optional) and login:
   ```bash
   npm i -g vercel
   vercel login
   ```
   2. From your project root, deploy:
   ```bash
   vercel deploy --prod
   ```
   3. Vercel will detect the `api/` folder and deploy serverless functions automatically.

   Notes & recommendations:

   - Vercel serverless functions are ideal for small backends and testing. For production, configure a managed database and update the API to write to that database instead of ephemeral logs.
   - Keep any secrets (DB credentials, API keys) in Vercel Environment Variables via the Vercel dashboard or `vercel env` commands.
   - If you need persistent logs, consider writing registration records to an external store (database or object storage).


---

## 🛠️ Customization

### Modify Fields
Edit `index.html` to add/remove form fields. Remember to:
1. Add corresponding CSS in `style.css`
2. Add validation in `script.js`
3. Add PHP validation in `process.php`

### Change Color Scheme
In `style.css`, change the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Customize Success Message
In `process.php`, modify the success message:
```php
$response['message'] = 'Your custom message here!';
```

---

## 🧪 Testing Checklist

- [ ] Form displays correctly on desktop (1200px+)
- [ ] Form displays correctly on tablet (768px)
- [ ] Form displays correctly on mobile (320px)
- [ ] All input fields accept valid data
- [ ] Validation errors display correctly
- [ ] Form submits via AJAX without reload
- [ ] Success message appears
- [ ] Data is logged to file
- [ ] Error handling works (try entering invalid data)
- [ ] Password toggle works
- [ ] Mobile keyboard zoom is prevented

---

## 📝 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Fully Supported |
| Firefox | Latest | ✅ Fully Supported |
| Safari | Latest | ✅ Fully Supported |
| Edge | Latest | ✅ Fully Supported |
| IE 11 | 11.x | ⚠️ Partial (no CSS Grid) |

---

## 🐛 Troubleshooting

### "PHP Server: Serve project" option not appearing
- Ensure PHP Server extension is installed
- Restart VS Code
- Open a PHP or HTML file first

### Form doesn't submit / AJAX fails
- Check browser console (F12) for errors
- Ensure `process.php` is in the same directory
- Check that PHP is running (localhost:3000 in address bar)

### "logs" folder permission error
- Ensure `logs` directory exists
- Set permissions to `755` for folders, `644` for files

### Password field shows incorrect toggle icon
- Clear browser cache (Ctrl+Shift+Delete)
- Check that FontAwesome CDN is loaded (check Network tab in DevTools)

---

## 📧 Email Notifications (Optional)

To send confirmation emails, add to `process.php`:

```php
$to = $email;
$subject = 'Registration Successful';
$message = 'Welcome ' . $fullName . '! Your registration is complete.';
$headers = "From: noreply@yourdomain.com\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($to, $subject, $message, $headers);
```

---

## 🔗 Useful Resources

- [jQuery Documentation](https://api.jquery.com/)
- [PHP Security Best Practices](https://www.php.net/manual/en/security.php)
- [FontAwesome Icons](https://fontawesome.com/icons)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

## 📄 License

This project is free to use for educational and commercial purposes.

---

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Test in browser console (F12)
4. Check PHP error logs

---

**Last Updated:** November 2025
**Version:** 1.0
