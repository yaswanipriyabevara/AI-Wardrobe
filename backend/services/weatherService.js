// Open-Meteo needs no signup and no API key — ideal for a hackathon.
// Docs: https://open-meteo.com/en/docs

const fetch = require("node-fetch");

// WMO weather codes, simplified to a short human label.
function describeCode(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Stormy";
  return "Mild";
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,precipitation`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather lookup failed");
  const data = await res.json();
  const code = data.current.weather_code;
  return {
    tempC: Math.round(data.current.temperature_2m),
    condition: describeCode(code),
    willRain: data.current.precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code),
  };
}

module.exports = { getWeather };
