function mockSuggestOutfits({ wardrobe, weather, occasion }) {
  const temp = Number(weather?.tempC);
  const warmthNeeded = Number.isFinite(temp) ? (temp < 15 ? 3 : temp < 24 ? 2 : 1) : 1;
  const formality = {
    interview: ['formal', 'smart'], wedding: ['formal', 'smart'], party: ['smart', 'casual'], college: ['casual', 'smart'], gym: ['athletic'],
  }[occasion] || ['casual', 'smart'];
  const byCategory = (cat) => wardrobe.filter((i) => i.category === cat && formality.includes(i.formality));
  const tops = byCategory('top').length ? byCategory('top') : wardrobe.filter((i) => i.category === 'top');
  const bottoms = byCategory('bottom').length ? byCategory('bottom') : wardrobe.filter((i) => i.category === 'bottom');
  const shoes = byCategory('shoes').length ? byCategory('shoes') : wardrobe.filter((i) => i.category === 'shoes');
  const outer = wardrobe.filter((i) => i.category === 'outerwear' && Number(i.warmth) >= warmthNeeded);
  const outfits = [];
  const used = new Set();
  const count = Math.min(3, tops.length, bottoms.length, shoes.length);
  for (let i = 0; i < count; i += 1) {
    const top = tops[i]; const bottom = bottoms[i]; const shoe = shoes[i];
    const itemIds = [top.id, bottom.id, shoe.id];
    const layer = warmthNeeded >= 3 && outer[i % Math.max(outer.length, 1)];
    if (layer) itemIds.push(layer.id);
    const key = itemIds.join('|');
    if (used.has(key)) continue;
    used.add(key);
    outfits.push({ itemIds, reason: `${top.subtype} + ${bottom.subtype}${layer ? ` + ${layer.subtype}` : ''} suits ${occasion} and the current weather.` });
  }
  return { outfits };
}

module.exports = { mockSuggestOutfits };
