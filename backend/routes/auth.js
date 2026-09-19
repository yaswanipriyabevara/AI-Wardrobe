const express = require('express');
const router = express.Router();
const { register, login, publicUser, signToken, requireAuth } = require('../auth');

router.post('/register', async (req, res) => {
  try {
    const user = await register(req.body || {});
    res.status(201).json({ user: publicUser(user), token: signToken({ sub: user.id, email: user.email }) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await login(req.body || {});
    res.json({ user: publicUser(user), token: signToken({ sub: user.id, email: user.email }) });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/me', requireAuth, (req, res) => {
  const db = require('../db');
  const user = db.findUserById(req.user.sub);
  if (!user) return res.status(401).json({ error: 'Account no longer exists.' });
  res.json({ user: publicUser(user) });
});

module.exports = router;
