// backend/src/routes/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { User } = require('../models');           // ← pulls from src/models/index.js
const authMiddleware = require('../middleware/authMiddleware');
const router  = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email & password required.' });

  try {
    const exists = await User.findOne({ where:{ email } });
    if (exists)
      return res.status(409).json({ message: 'Email already in use.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn:'1h' });
    return res.status(201).json({
      token,
      user: { id:user.id, name:user.name, email:user.email }
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message:'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message:'Email & password required.' });

  try {
    const user = await User.findOne({ where:{ email } });
    if (!user) 
      return res.status(401).json({ message:'Invalid credentials.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message:'Invalid credentials.' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn:'1h' });
    return res.json({
      token,
      user: { id:user.id, name:user.name, email:user.email }
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message:'Server error during login.' });
  }
});

// GET /api/auth/profile  (protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) 
      return res.status(404).json({ message:'User not found.' });
    return res.json({ id:user.id, name:user.name, email:user.email });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message:'Server error retrieving profile.' });
  }
});

module.exports = router;
