const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateProfile } = require('../validation');

router.get('/', async (req, res) => res.json((await db.load(req.user.sub)).profile));

router.post('/', async (req, res) => {
  try {
    const data = await db.load(req.user.sub);
    data.profile = { ...data.profile, ...validateProfile(req.body), onboarded: true };
    await db.save(req.user.sub, data);
    res.json(data.profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
