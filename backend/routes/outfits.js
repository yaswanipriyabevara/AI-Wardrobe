const express = require('express');
const router = express.Router();
const db = require('../db');
const { suggestOutfits, analyzeGaps } = require('../services/aiService');
const { OCCASIONS, cleanString } = require('../validation');

router.post('/suggest', async (req, res) => {
  try {
    const occasion = cleanString(req.body?.occasion).toLowerCase();
    if (!OCCASIONS.includes(occasion)) return res.status(400).json({ error: `occasion must be one of: ${OCCASIONS.join(', ')}` });
    const weather = req.body?.weather || null;
    const data = await db.load(req.user.sub);
    const [outfitResult, gapResult] = await Promise.all([
      suggestOutfits({ wardrobe: data.wardrobe, weather, occasion, profile: data.profile }),
      analyzeGaps({ wardrobe: data.wardrobe, profile: data.profile }),
    ]);
    const byId = Object.fromEntries(data.wardrobe.map((i) => [i.id, i]));
    const outfits = (outfitResult.outfits || []).map((o) => ({ items: (o.itemIds || []).map((id) => byId[id]).filter(Boolean), reason: cleanString(o.reason, 300) })).filter((o) => o.items.length > 0).slice(0, 3);
    res.json({ outfits, gaps: Array.isArray(gapResult.gaps) ? gapResult.gaps.slice(0, 5) : [] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/wear', async (req, res) => {
  const { occasion, itemIds } = req.body || {};
  if (!Array.isArray(itemIds) || itemIds.length === 0 || itemIds.length > 8) return res.status(400).json({ error: 'itemIds must contain 1 to 8 items.' });
  const data = await db.load(req.user.sub);
  const validIds = new Set(data.wardrobe.map((i) => i.id));
  const safeIds = [...new Set(itemIds.filter((id) => typeof id === 'string' && validIds.has(id)))];
  if (!safeIds.length) return res.status(400).json({ error: 'No valid wardrobe item ids were supplied.' });
  data.wardrobe.forEach((item) => { if (safeIds.includes(item.id)) item.timesWorn = (item.timesWorn || 0) + 1; });
  const entry = { id: db.uuid(), date: new Date().toISOString(), occasion: cleanString(occasion, 40) || 'general', itemIds: safeIds };
  data.outfitHistory.unshift(entry);
  data.outfitHistory = data.outfitHistory.slice(0, 200);
  await db.save(req.user.sub, data);
  res.status(201).json(entry);
});

router.get('/history', async (req, res) => res.json((await db.load(req.user.sub)).outfitHistory));

module.exports = router;
