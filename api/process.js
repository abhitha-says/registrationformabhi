const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  // Allow CORS for preview/testing (can be restricted later)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const { fullName, email, phone, dob, password, confirmPassword } = body;

    // Basic validation
    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({ status: 'error', message: 'Full name is required and must be at least 3 characters' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ status: 'error', message: 'A valid email is required' });
    }

    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ status: 'error', message: 'Phone number is required' });
    }

    if (!dob) {
      return res.status(400).json({ status: 'error', message: 'Date of Birth is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Log registration to a temp file (Vercel ephemeral filesystem)
    const fs = require('fs');
    const path = require('path');
    const logDir = '/tmp/registrations';
    try {
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
      const logFile = path.join(logDir, `registrations_${new Date().toISOString().slice(0,10)}.log`);
      const entry = JSON.stringify({ timestamp: new Date().toISOString(), fullName, email, phone, dob }) + '\n';
      fs.appendFileSync(logFile, entry);
    } catch (e) {
      // Fail silently for logging
      console.error('Logging error', e);
    }

    // Return success (do not return password/hash)
    return res.status(200).json({ status: 'success', message: `Registration successful! Welcome, ${fullName}` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
