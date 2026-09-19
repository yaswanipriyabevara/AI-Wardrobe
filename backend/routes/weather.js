const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');
const { validateLatLon } = require('../validation');

router.get('/', async (req, res) => {
  try {
    const { lat, lon } = validateLatLon(req.query.lat, req.query.lon);
    res.json(await getWeather(lat, lon));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
