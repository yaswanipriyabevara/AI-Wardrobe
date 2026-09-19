const test = require('node:test');
const assert = require('node:assert/strict');
const { mockSuggestOutfits } = require('../services/outfitEngine');

const wardrobe = [
  { id: 't1', category: 'top', subtype: 'T-shirt', formality: 'casual', warmth: 1 },
  { id: 't2', category: 'top', subtype: 'Shirt', formality: 'smart', warmth: 1 },
  { id: 'b1', category: 'bottom', subtype: 'Jeans', formality: 'casual', warmth: 2 },
  { id: 'b2', category: 'bottom', subtype: 'Trousers', formality: 'smart', warmth: 2 },
  { id: 's1', category: 'shoes', subtype: 'Sneakers', formality: 'casual', warmth: 1 },
  { id: 's2', category: 'shoes', subtype: 'Loafers', formality: 'smart', warmth: 1 },
  { id: 'o1', category: 'outerwear', subtype: 'Coat', formality: 'smart', warmth: 4 },
];

test('returns at most three complete outfits', () => {
  const result = mockSuggestOutfits({ wardrobe, occasion: 'college', weather: { tempC: 28 } });
  assert.ok(result.outfits.length <= 3);
  for (const outfit of result.outfits) {
    assert.ok(outfit.itemIds.some((id) => id.startsWith('t')));
    assert.ok(outfit.itemIds.some((id) => id.startsWith('b')));
    assert.ok(outfit.itemIds.some((id) => id.startsWith('s')));
  }
});

test('adds a warm layer in cold weather when available', () => {
  const result = mockSuggestOutfits({ wardrobe, occasion: 'college', weather: { tempC: 10 } });
  assert.ok(result.outfits.some((outfit) => outfit.itemIds.includes('o1')));
});

test('respects occasion formality', () => {
  const result = mockSuggestOutfits({ wardrobe, occasion: 'interview', weather: { tempC: 25 } });
  for (const outfit of result.outfits) assert.ok(outfit.itemIds.some((id) => id === 't2') || outfit.itemIds.some((id) => id === 't1'));
});
