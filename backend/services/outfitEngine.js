function mockSuggestOutfits({ wardrobe, weather, occasion }) {
  const temp = Number(weather?.tempC);

  const warmthNeeded = Number.isFinite(temp)
    ? (temp < 15 ? 3 : temp < 24 ? 2 : 1)
    : 1;

  const formality = {
    interview: ['formal', 'smart'],
    wedding: ['formal', 'smart'],
    party: ['smart', 'casual'],
    college: ['casual', 'smart'],
    gym: ['athletic'],
    date: ['smart', 'casual'],
  }[occasion] || ['casual', 'smart'];

  // ---------------------------------------
  // Helper: category matching
  // ---------------------------------------
  const getByCategory = (categories) =>
    wardrobe.filter((item) =>
      categories.includes(String(item.category || '').toLowerCase())
    );

  // ---------------------------------------
  // Helper: formality matching
  // ---------------------------------------
  const getByFormality = (items) => {
    const filtered = items.filter((item) =>
      formality.includes(String(item.formality || '').toLowerCase())
    );

    // If no item matches formality, don't remove the item.
    // This ensures outfits are still generated.
    return filtered.length ? filtered : items;
  };

  // ---------------------------------------
  // TOPS
  // Supports both "top" and "tops"
  // ---------------------------------------
  const allTops = getByCategory(['top', 'tops']);

  // ---------------------------------------
  // BOTTOMS
  // Supports both "bottom" and "bottoms"
  // ---------------------------------------
  const allBottoms = getByCategory(['bottom', 'bottoms']);

  // ---------------------------------------
  // SHOES
  // Supports both "shoe" and "shoes"
  // ---------------------------------------
  const allShoes = getByCategory(['shoe', 'shoes']);

  // ---------------------------------------
  // DRESSES / ONE-PIECE
  // Important for women's outfits
  // ---------------------------------------
  const dresses = getByCategory([
    'dress',
    'dresses',
    'one-piece',
    'onepiece',
    'one piece',
    'gown'
  ]);

  // ---------------------------------------
  // INDIAN / ETHNIC WEAR
  // Supports saree, kurti, lehenga etc.
  // ---------------------------------------
  const indianWear = getByCategory([
    'indian',
    'ethnic',
    'traditional',
    'saree',
    'lehenga',
    'kurti',
    'kurta'
  ]);

  // ---------------------------------------
  // OUTERWEAR
  // ---------------------------------------
  const outerwear = wardrobe.filter((item) => {
    const category = String(item.category || '').toLowerCase();

    return (
      ['outerwear', 'outer', 'jacket', 'coat'].includes(category) &&
      Number(item.warmth) >= warmthNeeded
    );
  });

  // ---------------------------------------
  // Apply formality preference
  // ---------------------------------------
  const tops = getByFormality(allTops);
  const bottoms = getByFormality(allBottoms);
  const shoes = getByFormality(allShoes);
  const formalDresses = getByFormality(dresses);
  const formalIndianWear = getByFormality(indianWear);

  const outfits = [];
  const used = new Set();

  // ---------------------------------------
  // Helper to add outfit safely
  // ---------------------------------------
  const addOutfit = (items, reason) => {
    const validItems = items.filter(Boolean);

    if (!validItems.length) return;

    const itemIds = validItems
      .map((item) => item.id)
      .filter(Boolean);

    if (!itemIds.length) return;

    const key = itemIds.join('|');

    if (used.has(key)) return;

    used.add(key);

    outfits.push({
      itemIds,
      reason
    });
  };

  // ---------------------------------------
  // 1. DRESS / ONE-PIECE OUTFITS
  // ---------------------------------------
  if (formalDresses.length > 0) {
    formalDresses.slice(0, 3).forEach((dress, index) => {
      const shoe = shoes[index % Math.max(shoes.length, 1)];

      const layer =
        warmthNeeded >= 3
          ? outerwear[index % Math.max(outerwear.length, 1)]
          : null;

      const items = [dress, shoe, layer];

      addOutfit(
        items,
        `${dress.subtype || 'Dress'}${shoe ? ` + ${shoe.subtype || 'Shoes'}` : ''}${layer ? ` + ${layer.subtype || 'Outerwear'}` : ''} suits ${occasion} and the current weather.`
      );
    });
  }

  // ---------------------------------------
  // 2. INDIAN / ETHNIC OUTFITS
  // ---------------------------------------
  if (formalIndianWear.length > 0) {
    formalIndianWear.slice(0, 3).forEach((indianItem, index) => {
      const shoe = shoes[index % Math.max(shoes.length, 1)];

      addOutfit(
        [indianItem, shoe],
        `${indianItem.subtype || 'Traditional wear'}${shoe ? ` + ${shoe.subtype || 'Shoes'}` : ''} suits ${occasion} and the current weather.`
      );
    });
  }

  // ---------------------------------------
  // 3. NORMAL TOP + BOTTOM OUTFITS
  // ---------------------------------------
  if (tops.length > 0 && bottoms.length > 0) {
    const count = Math.min(
      3,
      tops.length,
      bottoms.length,
      shoes.length || 1
    );

    for (let i = 0; i < count; i += 1) {
      const top = tops[i];
      const bottom = bottoms[i];
      const shoe = shoes.length
        ? shoes[i % shoes.length]
        : null;

      const layer =
        warmthNeeded >= 3 && outerwear.length
          ? outerwear[i % outerwear.length]
          : null;

      addOutfit(
        [top, bottom, shoe, layer],
        `${top.subtype || 'Top'} + ${bottom.subtype || 'Bottom'}${shoe ? ` + ${shoe.subtype || 'Shoes'}` : ''}${layer ? ` + ${layer.subtype || 'Outerwear'}` : ''} suits ${occasion} and the current weather.`
      );
    }
  }

  // ---------------------------------------
  // 4. FALLBACK
  // If formality filtering produced nothing,
  // use available wardrobe items directly.
  // ---------------------------------------
  if (outfits.length === 0) {
    const fallbackTops = allTops;
    const fallbackBottoms = allBottoms;
    const fallbackShoes = allShoes;

    const count = Math.min(
      3,
      fallbackTops.length,
      fallbackBottoms.length
    );

    for (let i = 0; i < count; i += 1) {
      const top = fallbackTops[i];
      const bottom = fallbackBottoms[i];

      const shoe = fallbackShoes.length
        ? fallbackShoes[i % fallbackShoes.length]
        : null;

      addOutfit(
        [top, bottom, shoe],
        `${top.subtype || 'Top'} + ${bottom.subtype || 'Bottom'}${shoe ? ` + ${shoe.subtype || 'Shoes'}` : ''} is a practical outfit from your wardrobe for ${occasion}.`
      );
    }
  }

  // ---------------------------------------
  // 5. FINAL FALLBACK FOR WOMEN'S DRESSES
  // Even if formality doesn't match,
  // don't hide available dresses.
  // ---------------------------------------
  if (outfits.length === 0 && dresses.length > 0) {
    dresses.slice(0, 3).forEach((dress, index) => {
      const shoe = allShoes.length
        ? allShoes[index % allShoes.length]
        : null;

      addOutfit(
        [dress, shoe],
        `${dress.subtype || 'Dress'}${shoe ? ` + ${shoe.subtype || 'Shoes'}` : ''} selected from your wardrobe for ${occasion}.`
      );
    });
  }

  // ---------------------------------------
  // 6. FINAL FALLBACK FOR INDIAN WEAR
  // ---------------------------------------
  if (outfits.length === 0 && indianWear.length > 0) {
    indianWear.slice(0, 3).forEach((item, index) => {
      const shoe = allShoes.length
        ? allShoes[index % allShoes.length]
        : null;

      addOutfit(
        [item, shoe],
        `${item.subtype || 'Traditional wear'}${shoe ? ` + ${shoe.subtype || 'Shoes'}` : ''} selected from your wardrobe for ${occasion}.`
      );
    });
  }

  return { outfits };
}

module.exports = { mockSuggestOutfits };