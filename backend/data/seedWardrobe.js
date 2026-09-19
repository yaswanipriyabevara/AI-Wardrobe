// Demo wardrobe so the app never opens empty. Images are generated on the
// fly by placehold.co (free, no key) so the repo stays tiny — swap these
// for real photos of your team's clothes before the live demo, per the
// brief's advice that real photos land better on stage than stock ones.
//
// formality: "casual" | "smart" | "formal" | "athletic"
// season: "all" | "summer" | "winter"

function img(hex, label) {
  return `https://placehold.co/400x500/${hex}/ffffff?font=roboto&text=${encodeURIComponent(label)}`;
}

const seedWardrobe = [
  { category: "top", subtype: "T-shirt", color: "white", pattern: "solid", formality: "casual", season: "all", warmth: 1, imageUrl: img("e5e5e5", "White Tee"), price: 15, timesWorn: 6 },
  { category: "top", subtype: "T-shirt", color: "black", pattern: "solid", formality: "casual", season: "all", warmth: 1, imageUrl: img("222222", "Black Tee"), price: 15, timesWorn: 9 },
  { category: "top", subtype: "Button-down shirt", color: "blue", pattern: "solid", formality: "smart", season: "all", warmth: 2, imageUrl: img("3b5a76", "Blue Shirt"), price: 45, timesWorn: 3 },
  { category: "top", subtype: "Button-down shirt", color: "white", pattern: "striped", formality: "smart", season: "all", warmth: 2, imageUrl: img("cfd6dc", "Striped Shirt"), price: 40, timesWorn: 1 },
  { category: "top", subtype: "Blouse", color: "cream", pattern: "solid", formality: "smart", season: "all", warmth: 2, imageUrl: img("efe3d0", "Cream Blouse"), price: 38, timesWorn: 0 },
  { category: "top", subtype: "Polo shirt", color: "navy", pattern: "solid", formality: "casual", season: "summer", warmth: 1, imageUrl: img("28324a", "Navy Polo"), price: 28, timesWorn: 4 },
  { category: "top", subtype: "Hoodie", color: "grey", pattern: "solid", formality: "casual", season: "winter", warmth: 4, imageUrl: img("6b6b6b", "Grey Hoodie"), price: 35, timesWorn: 11 },
  { category: "top", subtype: "Sweater", color: "burgundy", pattern: "solid", formality: "smart", season: "winter", warmth: 4, imageUrl: img("6e2c3a", "Sweater"), price: 42, timesWorn: 2 },
  { category: "bottom", subtype: "Jeans", color: "blue", pattern: "solid", formality: "casual", season: "all", warmth: 2, imageUrl: img("3a4a63", "Blue Jeans"), price: 55, timesWorn: 14 },
  { category: "bottom", subtype: "Jeans", color: "black", pattern: "solid", formality: "casual", season: "all", warmth: 2, imageUrl: img("1c1c1c", "Black Jeans"), price: 55, timesWorn: 8 },
  { category: "bottom", subtype: "Chinos", color: "khaki", pattern: "solid", formality: "smart", season: "all", warmth: 2, imageUrl: img("b8a074", "Khaki Chinos"), price: 48, timesWorn: 5 },
  { category: "bottom", subtype: "Dress trousers", color: "grey", pattern: "solid", formality: "formal", season: "all", warmth: 2, imageUrl: img("4a4a4a", "Grey Trousers"), price: 60, timesWorn: 1 },
  { category: "bottom", subtype: "Shorts", color: "beige", pattern: "solid", formality: "casual", season: "summer", warmth: 1, imageUrl: img("d8c7a1", "Beige Shorts"), price: 25, timesWorn: 6 },
  { category: "bottom", subtype: "Skirt", color: "black", pattern: "solid", formality: "smart", season: "all", warmth: 2, imageUrl: img("111111", "Black Skirt"), price: 30, timesWorn: 0 },
  { category: "outerwear", subtype: "Denim jacket", color: "blue", pattern: "solid", formality: "casual", season: "all", warmth: 3, imageUrl: img("415d78", "Denim Jacket"), price: 65, timesWorn: 5 },
  { category: "outerwear", subtype: "Blazer", color: "navy", pattern: "solid", formality: "formal", season: "all", warmth: 3, imageUrl: img("1f2b45", "Navy Blazer"), price: 90, timesWorn: 0 },
  { category: "outerwear", subtype: "Puffer jacket", color: "black", pattern: "solid", formality: "casual", season: "winter", warmth: 5, imageUrl: img("161616", "Puffer Jacket"), price: 80, timesWorn: 7 },
  { category: "shoes", subtype: "Sneakers", color: "white", pattern: "solid", formality: "casual", season: "all", warmth: 1, imageUrl: img("f0f0f0", "White Sneakers"), price: 70, timesWorn: 20 },
  { category: "shoes", subtype: "Sneakers", color: "black", pattern: "solid", formality: "casual", season: "all", warmth: 1, imageUrl: img("0d0d0d", "Black Sneakers"), price: 70, timesWorn: 12 },
  { category: "shoes", subtype: "Running shoes", color: "grey", pattern: "solid", formality: "athletic", season: "all", warmth: 1, imageUrl: img("8a8a8a", "Running Shoes"), price: 85, timesWorn: 9 },
  { category: "shoes", subtype: "Sandals", color: "brown", pattern: "solid", formality: "casual", season: "summer", warmth: 1, imageUrl: img("7a5533", "Sandals"), price: 30, timesWorn: 3 },
  { category: "accessory", subtype: "Leather belt", color: "brown", pattern: "solid", formality: "smart", season: "all", warmth: 1, imageUrl: img("5b3a24", "Brown Belt"), price: 20, timesWorn: 4 },
  { category: "accessory", subtype: "Watch", color: "silver", pattern: "solid", formality: "smart", season: "all", warmth: 1, imageUrl: img("9fa3a8", "Watch"), price: 120, timesWorn: 15 },
  { category: "accessory", subtype: "Scarf", color: "mustard", pattern: "solid", formality: "casual", season: "winter", warmth: 3, imageUrl: img("d6a542", "Scarf"), price: 22, timesWorn: 2 },
  { category: "activewear", subtype: "Track pants", color: "black", pattern: "solid", formality: "athletic", season: "all", warmth: 2, imageUrl: img("101010", "Track Pants"), price: 32, timesWorn: 10 },
  { category: "activewear", subtype: "Gym T-shirt", color: "teal", pattern: "solid", formality: "athletic", season: "all", warmth: 1, imageUrl: img("2f6b63", "Gym Tee"), price: 18, timesWorn: 13 },
];

module.exports = seedWardrobe;
