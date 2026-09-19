const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { wardrobe } = await db.load(req.user.sub);
  const mostWorn = [...wardrobe].sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0)).slice(0, 5);
  const neverWorn = wardrobe.filter((i) => !i.timesWorn);
  const colorCounts = {};
  wardrobe.forEach((i) => { colorCounts[i.color] = (colorCounts[i.color] || 0) + 1; });
  const total = wardrobe.length || 1;
  const colorDistribution = Object.entries(colorCounts).map(([color, count]) => ({ color, count, percent: Math.round((count / total) * 100) })).sort((a, b) => b.count - a.count);
  const costPerWear = wardrobe.filter((i) => Number.isFinite(Number(i.price)) && Number(i.price) >= 0).map((i) => ({ id: i.id, subtype: i.subtype, imageUrl: i.imageUrl, price: i.price, timesWorn: i.timesWorn || 0, costPerWear: i.timesWorn ? +(i.price / i.timesWorn).toFixed(2) : i.price })).sort((a, b) => b.costPerWear - a.costPerWear);
  res.json({ mostWorn, neverWorn, colorDistribution, costPerWear });
});

module.exports = router;
