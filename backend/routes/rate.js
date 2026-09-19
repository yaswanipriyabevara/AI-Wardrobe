const express = require('express');
const router = express.Router();
const db = require('../db');
const { rateOutfit } = require('../services/aiService');
const { validateBase64Image } = require('../validation');

router.post('/', async (req, res) => {
  try {
    const imageBase64 = validateBase64Image(req.body?.imageBase64);
    const result = await rateOutfit(imageBase64);
    const score = Math.max(1, Math.min(10, Number(result.score) || 1));
    const data = await db.load(req.user.sub);
    const entry = { id: db.uuid(), date: new Date().toISOString(), score, strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 5) : [], improvements: Array.isArray(result.improvements) ? result.improvements.slice(0, 5) : [] };
    data.ratings.unshift(entry);
    data.ratings = data.ratings.slice(0, 100);
    await db.save(req.user.sub, data);
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
