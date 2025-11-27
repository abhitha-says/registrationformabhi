# QUICK REFERENCE GUIDE

## 🚀 Get Started in 3 Steps

### Step 1: Install Extension
- Open VS Code → Extensions (Ctrl+Shift+X)
- Search "PHP Server" by brapifra
- Click Install

### Step 2: Run Project
- Right-click `index.html`
- Select "PHP Server: Serve project"
- Browser opens at localhost:3000

### Step 3: Test It
- Fill the form
- Click "Register Now"
- Success! Data saved without reload

---

## 📁 File Guide

| File | Purpose |
|------|---------|
| `index.html` | Form HTML structure with FontAwesome icons |
| `style.css` | Responsive design (Flexbox, gradients, animations) |
| `script.js` | jQuery AJAX, validation, error handling |
| `process.php` | Server logic, sanitization, data storage |
| `composer.json` | Heroku deployment file |
| `Procfile` | Heroku process configuration |
| `.htaccess` | Apache server security & caching |
| `database.sql` | MySQL table setup (optional) |
| `README.md` | Full documentation |

---

## ✅ Validation Rules

**Full Name:** 3-100 chars, letters/spaces/apostrophes
**Email:** Valid format, max 254 chars
**Phone:** 7-20 chars, numbers/+/-/spaces
**Password:** 6-128 chars (must match confirm)

---

## 🔐 Security Features

✅ XSS Prevention (htmlspecialchars)
✅ Email Validation (filter_var)
✅ Bcrypt Password Hashing (cost 12)
✅ SQL Injection Prevention (prepared statements)
✅ Security Headers (X-Frame-Options, etc.)
✅ CORS Support

---

## 🌐 Deploy to Cloud

### InfinityFree (FREE & EASIEST)
1. Sign up at infinityfree.net
2. Upload files to `htdocs` folder
3. Done! Works immediately

### Heroku (Paid)
1. Install Heroku CLI
2. `git push heroku main`
3. App deploys automatically

---

## 🛠️ Customize

### Change Colors
Edit `style.css` line 22:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add Database
Uncomment DB section in `process.php` (lines 150-170)

### Change Success Message
Edit `process.php` line 185:
```php
$response['message'] = 'Your message';
```

### Enable Email Notifications
Add to `process.php` (after line 185):
```php
mail($email, 'Welcome!', 'Thanks for registering');
```

---

## 🧪 Test Scenarios

1. **Valid Registration**
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: Test@123
   - Result: ✅ Success

2. **Invalid Email**
   - Email: invalid.email
   - Result: ❌ Error shown

3. **Password Mismatch**
   - Password: Test@123
   - Confirm: Test@124
   - Result: ❌ Error shown

4. **Empty Field**
   - Leave any field blank
   - Result: ❌ Error shown

---

## 🐛 Common Issues

**Issue:** "PHP Server" option missing
**Fix:** Restart VS Code, ensure extension installed

**Issue:** Form doesn't submit
**Fix:** Check browser console (F12), verify process.php exists

**Issue:** Data not saving
**Fix:** Check `logs` folder exists, has write permissions (755)

---

## 📊 Response Examples

### Success Response
```json
{
  "status": "success",
  "message": "Registration successful! Welcome, John Doe! We will contact you soon."
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Invalid email address"
}
```

---

## 🔗 Key CDN Links (Already Included)

- **jQuery:** `code.jquery.com/jquery-3.6.0.min.js`
- **FontAwesome:** `cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

---

## 💡 Pro Tips

1. **Mobile Testing:** Press F12 → Ctrl+Shift+M to toggle device mode
2. **Clear Cache:** Ctrl+Shift+Delete to clear browser cache
3. **Console Debugging:** Open F12 console to see AJAX requests
4. **File Permissions:** SSH: `chmod 755 logs/`
5. **Monitor Logs:** `logs/registrations_2025-11-20.log`

---

## 📞 Support Files

- **README.md** - Complete documentation
- **database.sql** - Database setup
- **.htaccess** - Server configuration
- **This file** - Quick reference

---

**Version:** 1.0 | **Updated:** November 2025
