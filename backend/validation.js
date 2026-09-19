const CATEGORIES = ['top', 'bottom', 'outerwear', 'shoes', 'accessory', 'activewear'];
const COLORS = ['white', 'black', 'grey', 'navy', 'blue', 'red', 'green', 'beige', 'brown', 'khaki', 'cream', 'burgundy', 'mustard', 'teal', 'pink', 'silver'];
const FORMALITY = ['casual', 'smart', 'formal', 'athletic'];
const SEASON = ['all', 'summer', 'winter'];
const OCCASIONS = ['college', 'interview', 'party', 'wedding', 'gym'];

function cleanString(value, max = 120) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function validateBase64Image(value) {
  if (typeof value !== 'string' || value.length < 50) throw new Error('A valid image is required.');
  if (value.length > 8 * 1024 * 1024) throw new Error('Image is too large. Maximum size is 6 MB of base64 payload.');
  return value.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
}

function validateLatLon(lat, lon) {
  const a = Number(lat); const b = Number(lon);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < -90 || a > 90 || b < -180 || b > 180) throw new Error('Invalid latitude or longitude.');
  return { lat: a, lon: b };
}

function validateTags(tags = {}) {
  const category = cleanString(tags.category).toLowerCase();
  const color = cleanString(tags.color).toLowerCase();
  const formality = cleanString(tags.formality).toLowerCase();
  const season = cleanString(tags.season).toLowerCase();
  if (!CATEGORIES.includes(category)) throw new Error('Invalid garment category.');
  if (!COLORS.includes(color)) throw new Error('Invalid garment color.');
  if (!FORMALITY.includes(formality)) throw new Error('Invalid formality value.');
  if (!SEASON.includes(season)) throw new Error('Invalid season value.');
  const warmth = Math.max(1, Math.min(5, Number(tags.warmth) || 1));
  return { category, subtype: cleanString(tags.subtype, 60) || 'Item', color, pattern: cleanString(tags.pattern, 40) || 'solid', formality, season, warmth };
}

function validateProfile(body = {}) {
  const styles = Array.isArray(body.styles) ? body.styles.map((x) => cleanString(x, 40)).filter(Boolean).slice(0, 8) : undefined;
  const avoidColors = Array.isArray(body.avoidColors) ? body.avoidColors.map((x) => cleanString(x, 30)).filter(Boolean).slice(0, 12) : undefined;
  const comfortPriority = ['balanced', 'comfort', 'style'].includes(cleanString(body.comfortPriority).toLowerCase()) ? cleanString(body.comfortPriority).toLowerCase() : undefined;
  const location = body.location ? { ...validateLatLon(body.location.lat, body.location.lon), label: cleanString(body.location.label, 100) } : undefined;
  return { ...(styles ? { styles } : {}), ...(avoidColors ? { avoidColors } : {}), ...(comfortPriority ? { comfortPriority } : {}), ...(location ? { location } : {}) };
}

module.exports = { CATEGORIES, COLORS, FORMALITY, SEASON, OCCASIONS, cleanString, validateBase64Image, validateLatLon, validateTags, validateProfile };
