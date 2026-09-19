// All AI calls for the app go through this file:
//  - tagGarment        (photo -> structured tags)
//  - suggestOutfits    (wardrobe + weather + occasion -> 3 outfits)
//  - analyzeGaps       (wardrobe -> missing-item suggestions)
//  - rateOutfit        (photo -> score + feedback)
//
// AI_PROVIDER in .env controls which backend is used: "anthropic", "openai",
// "gemini", or "mock" (the default). Mock mode is not a placeholder to be
// embarrassed about — it's a deliberate demo-safety net: rule-based logic
// that always returns a sensible, valid answer even with no internet and no
// API key, which matters a lot when you're on stage with 3 minutes and one
// shot at the Wi-Fi. Swap in a real key any time; nothing else in the app
// needs to change.

const fetch = require("node-fetch");

const PROVIDER = (process.env.AI_PROVIDER || "mock").toLowerCase();

const ALLOWED_CATEGORIES = ["top", "bottom", "outerwear", "shoes", "accessory", "activewear"];
const ALLOWED_COLORS = [
  "white", "black", "grey", "navy", "blue", "red", "green", "beige",
  "brown", "khaki", "cream", "burgundy", "mustard", "teal", "pink", "silver",
];
const ALLOWED_FORMALITY = ["casual", "smart", "formal", "athletic"];
const ALLOWED_SEASON = ["all", "summer", "winter"];

/** Strip ```json fences and parse; throws if it still isn't valid JSON. */
function parseJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function callAnthropic(systemPrompt, userContent) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Anthropic API error");
  const text = data.content?.map((b) => b.text || "").join("\n") || "";
  return parseJson(text);
}

async function callOpenAI(systemPrompt, userContent) {
  // userContent here is a plain string or an array of OpenAI-style content parts.
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // vision-capable; check current model names before your demo
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "OpenAI API error");
  return parseJson(data.choices[0].message.content);
}

// ---------------------------------------------------------------------------
// Mock helpers (no network, no key, always succeed)
// ---------------------------------------------------------------------------

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function mockTagGarment() {
  // A real vision model would look at the photo; the mock returns a
  // plausible, schema-valid guess so the "edit tags" flow always has
  // something sane to start from.
  return {
    category: pick(ALLOWED_CATEGORIES),
    subtype: "Item",
    color: pick(ALLOWED_COLORS),
    pattern: pick(["solid", "striped", "patterned"]),
    formality: pick(ALLOWED_FORMALITY),
    season: pick(ALLOWED_SEASON),
    warmth: Math.ceil(Math.random() * 5),
  };
}

/** Rule-based outfit builder: always produces valid top+bottom(+shoes) combos. */
const { mockSuggestOutfits } = require('./outfitEngine');

function mockAnalyzeGaps({ wardrobe }) {
  const has = (pred) => wardrobe.some(pred);
  const gaps = [];
  if (!has((i) => i.category === "shoes" && i.formality === "formal"))
    gaps.push({ item: "black formal shoes", reason: "No formal shoes for interviews or weddings.", searchQuery: "black formal shoes men" });
  if (!has((i) => i.category === "outerwear" && (i.subtype || "").toLowerCase().includes("rain")))
    gaps.push({ item: "a rain jacket", reason: "No waterproof layer for wet weather.", searchQuery: "packable rain jacket" });
  if (!has((i) => i.category === "outerwear" && i.formality === "formal"))
    gaps.push({ item: "a navy blazer", reason: "No blazer to smarten up an outfit quickly.", searchQuery: "navy blazer men" });
  if (!has((i) => i.category === "bottom" && i.formality === "formal"))
    gaps.push({ item: "tailored dress trousers", reason: "Limited options for formal occasions.", searchQuery: "tailored dress trousers" });
  if (!has((i) => i.category === "accessory" && (i.subtype || "").toLowerCase().includes("tie")))
    gaps.push({ item: "a plain tie", reason: "Nothing to pair with the smart shirts on hand.", searchQuery: "plain silk tie" });
  return { gaps: gaps.slice(0, 5) };
}

function mockRateOutfit() {
  const score = 6 + Math.floor(Math.random() * 4); // 6-9, demo-friendly
  return {
    score,
    strengths: ["Colors are coordinated well", "Fit looks proportionate"],
    improvements: ["Try adding one accessory for contrast", "Consider rolling sleeves for a more relaxed look"],
  };
}


function sanitizeOutfitResult(result, wardrobe) {
  const valid = new Set(wardrobe.map((item) => item.id));
  const outfits = Array.isArray(result?.outfits) ? result.outfits.map((o) => ({
    itemIds: Array.isArray(o.itemIds) ? [...new Set(o.itemIds.filter((id) => valid.has(id)))].slice(0, 6) : [],
    reason: String(o.reason || "Personalized combination").slice(0, 300),
  })).filter((o) => o.itemIds.length >= 3) : [];
  return { outfits: outfits.slice(0, 3) };
}

function sanitizeGaps(result) {
  const gaps = Array.isArray(result?.gaps) ? result.gaps.map((g) => ({
    item: String(g.item || "Wardrobe essential").slice(0, 80),
    reason: String(g.reason || "Useful addition to the wardrobe.").slice(0, 240),
    searchQuery: String(g.searchQuery || g.item || "fashion essential").slice(0, 120),
  })).slice(0, 5) : [];
  return { gaps };
}

function sanitizeRating(result) {
  const score = Math.max(1, Math.min(10, Number(result?.score) || 1));
  return {
    score,
    strengths: Array.isArray(result?.strengths) ? result.strengths.map((x) => String(x).slice(0, 180)).slice(0, 5) : [],
    improvements: Array.isArray(result?.improvements) ? result.improvements.map((x) => String(x).slice(0, 180)).slice(0, 5) : [],
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

async function tagGarment(imageBase64) {
  if (PROVIDER === "mock" || !imageBase64) return mockTagGarment();
  const systemPrompt = `You are a fashion tagging assistant. Look at the clothing photo and respond with ONLY a JSON object (no markdown, no prose) with keys: category (one of ${ALLOWED_CATEGORIES.join(", ")}), subtype (short string, e.g. "T-shirt"), color (one of ${ALLOWED_COLORS.join(", ")}), pattern ("solid" | "striped" | "patterned"), formality (one of ${ALLOWED_FORMALITY.join(", ")}), season (one of ${ALLOWED_SEASON.join(", ")}), warmth (integer 1-5).`;
  try {
    if (PROVIDER === "anthropic") {
      return await callAnthropic(systemPrompt, [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: "Tag this garment." },
      ]);
    }
    if (PROVIDER === "openai") {
      return await callOpenAI(systemPrompt, [
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        { type: "text", text: "Tag this garment." },
      ]);
    }
    return mockTagGarment();
  } catch (err) {
    console.error("tagGarment AI call failed, falling back to mock:", err.message);
    return mockTagGarment();
  }
}

async function suggestOutfits({ wardrobe, weather, occasion, profile }) {
  if (PROVIDER === "mock") return mockSuggestOutfits({ wardrobe, weather, occasion });
  const systemPrompt = `You are a personal stylist. Given a JSON wardrobe (array of items with id, category, color, formality, season, warmth), today's weather, an occasion, and a style profile, respond with ONLY JSON: { "outfits": [ { "itemIds": ["..."], "reason": "short reason" }, ... exactly 3 ] }. Every outfit must include at least one "top", one "bottom", and one "shoes" item id from the wardrobe. Only use ids that exist in the wardrobe provided.`;
  const userContent = JSON.stringify({ wardrobe, weather, occasion, profile });
  try {
    const provider = PROVIDER === "openai" ? callOpenAI : callAnthropic;
    const result = sanitizeOutfitResult(await provider(systemPrompt, userContent), wardrobe);
    if (!result.outfits.length) throw new Error("AI returned no valid outfits");
    return result;
  } catch (err) {
    console.error("suggestOutfits AI call failed, falling back to mock:", err.message);
    return mockSuggestOutfits({ wardrobe, weather, occasion });
  }
}

async function analyzeGaps({ wardrobe, profile }) {
  if (PROVIDER === "mock") return mockAnalyzeGaps({ wardrobe });
  const systemPrompt = `You are a wardrobe consultant. Given a JSON wardrobe and a style profile, respond with ONLY JSON: { "gaps": [ { "item": "navy blazer", "reason": "short reason", "searchQuery": "navy blazer men" }, ... up to 5 ] }. Suggest specific, purchasable items that are genuinely missing, not items the wardrobe already covers.`;
  const userContent = JSON.stringify({ wardrobe, profile });
  try {
    const provider = PROVIDER === "openai" ? callOpenAI : callAnthropic;
    const result = sanitizeGaps(await provider(systemPrompt, userContent));
    return result;
  } catch (err) {
    console.error("analyzeGaps AI call failed, falling back to mock:", err.message);
    return mockAnalyzeGaps({ wardrobe });
  }
}

async function rateOutfit(imageBase64) {
  if (PROVIDER === "mock" || !imageBase64) return mockRateOutfit();
  const systemPrompt = `You are a friendly stylist rating an outfit photo. Respond with ONLY JSON: { "score": integer 1-10, "strengths": ["...", "..."], "improvements": ["...", "..."] }. Be specific and encouraging, never harsh.`;
  try {
    let result;
    if (PROVIDER === "anthropic") {
      result = await callAnthropic(systemPrompt, [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: "Rate this outfit." },
      ]);
    } else if (PROVIDER === "openai") {
      result = await callOpenAI(systemPrompt, [
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        { type: "text", text: "Rate this outfit." },
      ]);
    } else {
      result = mockRateOutfit();
    }
    return sanitizeRating(result);
  } catch (err) {
    console.error("rateOutfit AI call failed, falling back to mock:", err.message);
    return mockRateOutfit();
  }
}

module.exports = { tagGarment, suggestOutfits, analyzeGaps, rateOutfit, PROVIDER };
