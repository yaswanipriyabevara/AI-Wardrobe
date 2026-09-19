const express = require('express');
const router = express.Router();
const db = require('../db');
const { tagGarment } = require('../services/aiService');
const { validateBase64Image, validateTags, cleanString } = require('../validation');

router.get('/', async (req, res) => res.json((await db.load(req.user.sub)).wardrobe));

router.post('/', async (req, res) => {
  try {
    const { imageBase64, imageUrl, tags } = req.body || {};
    if (!imageBase64 && !imageUrl) return res.status(400).json({ error: 'imageBase64 or imageUrl is required' });
    if (imageUrl && (!/^https?:\/\//i.test(imageUrl) || imageUrl.length > 1000)) return res.status(400).json({ error: 'imageUrl must be a valid http(s) URL.' });
    const safeImage = imageBase64 ? validateBase64Image(imageBase64) : null;
    const aiTags = tags ? validateTags(tags) : validateTags(await tagGarment(safeImage));
    const data = await db.load(req.user.sub);
    const item = {
      id: db.uuid(), createdAt: new Date().toISOString(), imageUrl: imageUrl || `data:image/jpeg;base64,${safeImage}`,
      timesWorn: 0, price: null, name: cleanString(req.body.name, 80) || `${aiTags.subtype}`,
      ...aiTags,
    };
    data.wardrobe.push(item);
    await db.save(req.user.sub, data);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await db.load(req.user.sub);
    const item = data.wardrobe.find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const allowed = ['name', 'subtype', 'category', 'color', 'pattern', 'formality', 'season', 'warmth', 'price'];
    const patch = Object.fromEntries(allowed.filter((key) => Object.prototype.hasOwnProperty.call(req.body || {}, key)).map((key) => [key, req.body[key]]));
    const merged = validateTags({ ...item, ...patch });
    Object.assign(item, merged, patch.name ? { name: cleanString(patch.name, 80) } : {});
    if (patch.price !== undefined) item.price = Number.isFinite(Number(patch.price)) && Number(patch.price) >= 0 ? Number(patch.price) : null;
    await db.save(req.user.sub, data);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const data = await db.load(req.user.sub);
  const before = data.wardrobe.length;
  data.wardrobe = data.wardrobe.filter((i) => i.id !== req.params.id);
  if (data.wardrobe.length === before) return res.status(404).json({ error: 'Item not found' });
  await db.save(req.user.sub, data);
  res.status(204).end();
});

module.exports = router;
