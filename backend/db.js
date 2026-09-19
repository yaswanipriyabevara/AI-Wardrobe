const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { v4: uuid } = require('uuid');
const seedWardrobe = require('./data/seedWardrobe');

const DB_PATH = path.join(__dirname, 'db.json');
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY && process.env.STORAGE_PROVIDER !== 'json');

function emptyStore() { return { version: 2, users: [], states: {} }; }
function readStore() {
  if (!fs.existsSync(DB_PATH)) { const store = emptyStore(); saveStore(store); return store; }
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (parsed.wardrobe && !parsed.states) {
      const migrated = { version: 2, users: [], states: { 'legacy-demo-user': parsed } };
      saveStore(migrated); return migrated;
    }
    return parsed;
  } catch { const store = emptyStore(); saveStore(store); return store; }
}
function saveStore(store) {
  const temp = `${DB_PATH}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(temp, DB_PATH);
}
function defaultData() {
  return {
    wardrobe: seedWardrobe.map((item) => ({ id: uuid(), createdAt: new Date().toISOString(), ...item })),
    profile: { styles: ['casual', 'smart'], avoidColors: [], comfortPriority: 'balanced', location: null, onboarded: false },
    outfitHistory: [], ratings: [],
  };
}

async function supabaseRequest(pathname, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Supabase storage error (${response.status}): ${text.slice(0, 240)}`);
  return text ? JSON.parse(text) : [];
}

async function ensureUserState(userId) {
  if (!USE_SUPABASE) {
    const store = readStore();
    if (!store.states[userId]) { store.states[userId] = defaultData(); saveStore(store); }
    return store.states[userId];
  }
  const rows = await supabaseRequest(`stylesync_state?user_id=eq.${encodeURIComponent(userId)}&select=data&limit=1`);
  if (rows[0]?.data) return rows[0].data;
  const state = defaultData();
  await supabaseRequest('stylesync_state', { method: 'POST', body: JSON.stringify({ user_id: userId, data: state }) });
  return state;
}

async function load(userId) { if (!userId) throw new Error('userId is required'); return ensureUserState(userId); }
async function save(userId, data) {
  if (!userId) throw new Error('userId is required');
  if (!USE_SUPABASE) { const store = readStore(); store.states[userId] = data; saveStore(store); return; }
  await supabaseRequest(`stylesync_state?user_id=eq.${encodeURIComponent(userId)}`, { method: 'PATCH', body: JSON.stringify({ data, updated_at: new Date().toISOString() }) });
}

// Authentication records remain local so the project works without a hosted dependency.
function createUser(user) { const store = readStore(); store.users.push(user); saveStore(store); }
function findUserByEmail(email) { return readStore().users.find((user) => user.email === email); }
function findUserById(id) { return readStore().users.find((user) => user.id === id); }

module.exports = { load, save, uuid, createUser, findUserByEmail, findUserById, ensureUserState, storageProvider: USE_SUPABASE ? 'supabase' : 'json' };
