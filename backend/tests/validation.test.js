const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLatLon, validateProfile, validateTags } = require('../validation');

test('rejects invalid coordinates', () => {
  assert.throws(() => validateLatLon(95, 80), /Invalid latitude/);
});

test('sanitizes profile input to supported fields', () => {
  const result = validateProfile({ styles: ['casual', 'smart'], comfortPriority: 'comfort', password: 'should-not-survive' });
  assert.deepEqual(result, { styles: ['casual', 'smart'], comfortPriority: 'comfort' });
});

test('normalizes and validates garment tags', () => {
  const result = validateTags({ category: 'TOP', color: 'WHITE', formality: 'SMART', season: 'ALL', warmth: 8, subtype: ' Shirt ' });
  assert.equal(result.category, 'top');
  assert.equal(result.color, 'white');
  assert.equal(result.warmth, 5);
  assert.equal(result.subtype, 'Shirt');
});
