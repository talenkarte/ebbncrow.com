/* ---------- Board size ---------- */
const COLS = 5;          // tiles across
const ROWS = 8;          // total rows, including the reservoir row
const PLAY_ROWS = ROWS - 1;  // the bottom row is the clean reservoir
const MAX_FLAGS = 2;
const DRAIN_CHARGES = 3;
const BEAVER_BONUS = 2;  // shield added to every plank by the beaver
const HAND_SIZE = 3;     // cards drawn each turn, before flags
const EVENT_EVERY = 3;   // a disaster strikes every this many turns

/* ---------- Art (hand-drawn SVG) ---------- */
const ART = {
  plank: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="18" width="56" height="28" rx="3" fill="#9a6435"/><rect x="4" y="18" width="56" height="6" rx="2" fill="#b87a45"/><path d="M10 31h20M26 37h28M12 41h10" stroke="#6e4423" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="24" r="2" fill="#3a3a44"/><circle cx="54" cy="24" r="2" fill="#3a3a44"/><circle cx="10" cy="40" r="2" fill="#3a3a44"/><circle cx="54" cy="40" r="2" fill="#3a3a44"/></svg>`,
  plankUp: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="18" width="56" height="28" rx="3" fill="#7d4f28"/><rect x="4" y="18" width="56" height="6" rx="2" fill="#9a6435"/><path d="M10 31h20M26 37h28M12 41h10" stroke="#55341a" stroke-width="2" stroke-linecap="round"/><rect x="16" y="15" width="6" height="34" rx="1" fill="#9aa3b0" stroke="#525a66" stroke-width="1.5"/><rect x="42" y="15" width="6" height="34" rx="1" fill="#9aa3b0" stroke="#525a66" stroke-width="1.5"/></svg>`,
  drain: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 12h48L38 36v18H26V36z" fill="#c4743f" stroke="#7a3f1d" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="32" cy="12" rx="24" ry="5" fill="#2a1a14" stroke="#7a3f1d" stroke-width="2.5"/><path d="M18 19l9 11" stroke="#e8a46d" stroke-width="3" stroke-linecap="round"/><rect x="26" y="50" width="12" height="4" fill="#7a3f1d"/></svg>`,
  flag: `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="18" cy="58" rx="10" ry="3" fill="rgba(0,0,0,.35)"/><rect x="16" y="6" width="4" height="52" rx="1" fill="#d9d2c3"/><path d="M20 9L52 17L20 27z" fill="#f2c230" stroke="#9c7a12" stroke-width="2" stroke-linejoin="round"/></svg>`,
  monkey: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="13" cy="30" r="8" fill="#7a4a2a"/><circle cx="51" cy="30" r="8" fill="#7a4a2a"/><circle cx="13" cy="30" r="4" fill="#e3b58a"/><circle cx="51" cy="30" r="4" fill="#e3b58a"/><circle cx="32" cy="32" r="20" fill="#7a4a2a"/><path d="M20 35q0-12 12-12t12 12q0 13-12 13t-12-13z" fill="#e3b58a"/><circle cx="26" cy="31" r="2.5" fill="#1a1410"/><circle cx="38" cy="31" r="2.5" fill="#1a1410"/><path d="M27 41q5 4 10 0" stroke="#1a1410" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  wolf: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 8l14 16h12l14-16-2 26-18 22-18-22z" fill="#8a8f9a"/><path d="M17 15l7 10M47 15l-7 10" stroke="#5b606b" stroke-width="3" stroke-linecap="round"/><path d="M24 36l8 18 8-18z" fill="#d7d9de"/><circle cx="25" cy="31" r="2.5" fill="#f2c230"/><circle cx="39" cy="31" r="2.5" fill="#f2c230"/><path d="M29 50h6l-3 4z" fill="#1a1a20"/></svg>`,
  beaver: `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="57" rx="16" ry="5" fill="#4a3a30"/><circle cx="18" cy="15" r="5" fill="#6e4a2e"/><circle cx="46" cy="15" r="5" fill="#6e4a2e"/><circle cx="32" cy="30" r="20" fill="#8a5a36"/><ellipse cx="32" cy="36" rx="11" ry="8" fill="#c9926a"/><circle cx="24" cy="26" r="2.5" fill="#1a1410"/><circle cx="40" cy="26" r="2.5" fill="#1a1410"/><ellipse cx="32" cy="32" rx="3.5" ry="2.5" fill="#2a1a14"/><rect x="28" y="39" width="8" height="9" rx="1" fill="#fff6d8" stroke="#b8a77a"/><path d="M32 39v9" stroke="#b8a77a"/></svg>`,
  snake: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 52q14 4 18-8t18-10q12 0 10-14" stroke="#4f8a3a" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M10 52q14 4 18-8t18-10q12 0 10-14" stroke="#86c06a" stroke-width="3" stroke-dasharray="2 6" fill="none" stroke-linecap="round"/><ellipse cx="55" cy="16" rx="7" ry="6" fill="#4f8a3a"/><circle cx="57" cy="14" r="1.8" fill="#f2c230"/><path d="M55 10l-1-6m1 6l3-5" stroke="#d94a4a" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  bear: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="16" cy="16" r="8" fill="#4a2f1f"/><circle cx="48" cy="16" r="8" fill="#4a2f1f"/><circle cx="16" cy="16" r="4" fill="#7a5038"/><circle cx="48" cy="16" r="4" fill="#7a5038"/><circle cx="32" cy="34" r="22" fill="#5a3a26"/><ellipse cx="32" cy="42" rx="11" ry="8" fill="#a77b58"/><ellipse cx="32" cy="38" rx="4" ry="3" fill="#1a1410"/><circle cx="24" cy="30" r="2.5" fill="#1a1410"/><circle cx="40" cy="30" r="2.5" fill="#1a1410"/><path d="M28 46q4 3 8 0" stroke="#1a1410" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  bat: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 24c-3 0-5 2-6 5-5-6-14-9-22-7 5 3 7 8 6 14 3-3 8-3 10 1 2-3 6-4 8-2 1 4 2 7 4 9 2-2 3-5 4-9 2-2 6-1 8 2 2-4 7-4 10-1-1-6 1-11 6-14-8-2-17 1-22 7-1-3-3-5-6-5z" fill="#3b2f4a"/><path d="M27 25l1-6 3 4h2l3-4 1 6z" fill="#3b2f4a"/><circle cx="29.5" cy="28" r="1.7" fill="#f2c230"/><circle cx="34.5" cy="28" r="1.7" fill="#f2c230"/><path d="M30 33l1 2 1-2M33 33l1 2 1-2" stroke="#fff" stroke-width="1"/></svg>`,
  mole: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 3h16v8q0 6-8 9q-8-3-8-9z" fill="#8ee6ff" stroke="#3fb4dc" stroke-width="2"/><ellipse cx="32" cy="44" rx="20" ry="15" fill="#3d3440"/><ellipse cx="32" cy="50" rx="12" ry="8" fill="#5a4e5e"/><ellipse cx="32" cy="36" rx="5" ry="4" fill="#e89aa8"/><circle cx="24" cy="34" r="1.8" fill="#111"/><circle cx="40" cy="34" r="1.8" fill="#111"/><path d="M8 56q4-7 11-5M56 56q-4-7-11-5" stroke="#e89aa8" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
  ant: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 18l12 12" stroke="#8a6a4a" stroke-width="3" stroke-linecap="round"/><path d="M3 13l7-3 4 6-7 4z" fill="#c9ced6" stroke="#6b7380" stroke-width="1.2"/><path d="M26 42l-5 11M30 43v11M34 42l5 11M25 34l-6-8M30 33v-9M35 34l6-8" stroke="#5a2014" stroke-width="2.2" stroke-linecap="round"/><circle cx="16" cy="38" r="7" fill="#7a2e1e"/><ellipse cx="30" cy="38" rx="6" ry="5" fill="#7a2e1e"/><ellipse cx="47" cy="38" rx="11" ry="8" fill="#7a2e1e"/><path d="M12 32l-3-8M18 32l3-9" stroke="#7a2e1e" stroke-width="2" stroke-linecap="round"/><circle cx="13" cy="37" r="1.5" fill="#f2c230"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5z" fill="#8ee6ff" stroke="#0d3a4c" stroke-width="1.5"/></svg>`,
  drop: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z" fill="#e9fbff" stroke="#0d3a4c" stroke-width="1.5"/></svg>`,
  jar: `<svg viewBox="0 0 80 100" aria-hidden="true"><rect x="22" y="4" width="36" height="12" rx="3" fill="#8a6a4a" stroke="#4f3a26" stroke-width="2"/><path d="M18 18h44q6 0 6 8v58q0 12-12 12H24q-12 0-12-12V26q0-8 6-8z" fill="rgba(200,230,240,.18)" stroke="#d6eef5" stroke-width="3"/><path d="M15 52h50v32q0 9-9 9H24q-9 0-9-9z" fill="#2f5f86"/><circle cx="30" cy="70" r="4" fill="#6a8a4a"/><circle cx="48" cy="80" r="3" fill="#6a8a4a"/><path d="M22 26v18" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></svg>`,
  crow: `<svg viewBox="0 0 220 190" aria-hidden="true">
    <path d="M18 70Q34 18 104 22T198 62Q212 128 160 168Q96 190 42 160Q4 124 18 70z" fill="#5b4a6e"/>
    <path d="M30 150Q90 120 190 140" stroke="#8ee6ff" stroke-width="6" stroke-opacity=".35" fill="none" stroke-linecap="round"/>
    <path d="M28 160Q100 138 196 156" stroke="#2f5f86" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M70 152Q56 104 88 84Q110 70 132 82Q162 100 156 152z" fill="#18161e"/>
    <path d="M74 146L44 170L84 160z" fill="#18161e"/>
    <path d="M92 104Q114 122 108 150" stroke="#34303d" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="124" cy="72" r="28" fill="#18161e"/>
    <path d="M146 76Q172 86 176 110Q158 98 142 90z" fill="#2b2833"/>
    <path d="M112 56L136 64" stroke="#6b6577" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="128" cy="70" r="7" fill="#f2c230"/>
    <circle cx="129" cy="73" r="3" fill="#0f0e13"/>
    <path d="M131 82q-5 9 0 14q5-5 0-14z" fill="#8ee6ff"/>
  </svg>`
};

/* ---------- Cards ----------
   target: "tile" = tap a tile, "hand" = tap another card in your hand, "none" = press Use
   weight: how often the card is drawn (bigger = more often) */
const CARDS = {
  plank:  { name:"Wooden plank", text:"+1 shield on a dry tile. Stack to reinforce.", weight:6, target:"tile",
            hint:"Tap a dry tile, or a plank to reinforce it." },
  drain:  { name:"Funnel drain", text:"Play on water. Drains it, then soaks up 3 more flows.", weight:3, target:"tile",
            hint:"Tap a water tile." },
  flag:   { name:"Flag", text:"Draw 1 extra card each turn. Max 2 on the board.", weight:2, target:"tile",
            hint:"Tap a dry tile. Only 2 flags can stand at once." },
  monkey: { name:"Monkey", text:"Smash a stone, then draw 1 card.", weight:2, target:"tile",
            hint:"Tap a stone to smash it." },
  wolf:   { name:"Wolf", text:"Feed it a card from your hand. Next turn it brings 2 random cards.", weight:2, target:"hand",
            hint:"Tap another card in your hand to feed to the wolf." },
  beaver: { name:"Beaver", text:"Every plank on the board gains +2 shield.", weight:2, target:"none",
            hint:"Press Use to upgrade every plank on the board." },
  snake:  { name:"Snake", text:"Move a card on the board to a new tile.", weight:2, target:"tile",
            hint:"Tap a tile with a card on it to pick it up." },
  bear:   { name:"Bear", text:"Drop a stone on a dry tile. Discard a card to use it.", weight:2, target:"tile",
            hint:"Tap an empty dry tile for the stone." },
  bat:    { name:"Bat", text:"Pick a card in your hand. It stays in your hand between turns.", weight:2, target:"hand",
            hint:"Tap another card in your hand to keep it." },
  mole:   { name:"Mole", text:"Give a card on the board disaster shielding.", weight:2, target:"tile",
            hint:"Tap a card on the board to shield it from disasters." },
  ant:    { name:"Woodcutter ant", text:"Discard a card, draw 1. Discard a flag to draw 2.", weight:2, target:"hand",
            hint:"Tap another card in your hand to discard it." }
};

/* ---------- Disasters (one strikes every EVENT_EVERY turns) ---------- */
const EVENTS = {
  hurricane:  { name:"Hurricane" },
  boulders:   { name:"Boulder storm" },
  tornado:    { name:"Tornado" },
  earthquake: { name:"Earthquake" },
  sunshine:   { name:"Clear sunshine" }
};

/* ---------- Sound effects (made with the Web Audio API, no files needed) ---------- */
let actx = null;
let muted = false;
try { muted = localStorage.getItem("ebbcrow-muted") === "1"; } catch(e){}

function audio(){
  if (muted) return null;
  if (!actx){
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; }
  }
  if (actx.state === "suspended") actx.resume();
  return actx;
}
function tone(freq, dur, { type="sine", vol=0.15, slide=0, delay=0 } = {}){
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, { vol=0.12, freq=1200, q=1, delay=0, filter="bandpass" } = {}){
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = filter; f.frequency.value = freq; f.Q.value = q;
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}
const SFX = {
  select:   () => tone(660, .07, { type:"square", vol:.05 }),
  deselect: () => tone(440, .06, { type:"square", vol:.04 }),
  invalid:  () => tone(140, .16, { type:"sawtooth", vol:.06 }),
  draw:     () => noise(.08, { freq:3000, vol:.07 }),
  plank:    () => { noise(.08, { freq:400, vol:.25 }); tone(180, .12, { type:"triangle", slide:-60 }); },
  drain:    () => { tone(500, .3, { slide:-380, vol:.12 }); noise(.3, { freq:900, vol:.07, delay:.05 }); },
  flag:     () => { tone(523, .08, { type:"triangle" }); tone(784, .14, { type:"triangle", delay:.07 }); },
  monkey:   () => { noise(.14, { freq:250, vol:.35, filter:"lowpass" }); tone(700, .08, { type:"square", vol:.05, delay:.12 }); tone(950, .1, { type:"square", vol:.05, delay:.2 }); },
  wolf:     () => { tone(330, .5, { slide:250, vol:.1 }); tone(580, .4, { slide:-200, vol:.08, delay:.45 }); },
  beaver:   () => { for (let i = 0; i < 4; i++) noise(.04, { freq:2500, vol:.18, delay:i * .07 }); },
  snake:    () => noise(.45, { freq:5000, vol:.09, filter:"highpass" }),
  bear:     () => { tone(90, .45, { type:"sawtooth", vol:.1, slide:-30 }); noise(.18, { freq:200, vol:.4, filter:"lowpass", delay:.32 }); },
  bat:      () => { tone(1800, .07, { slide:700, vol:.06 }); tone(2100, .07, { slide:700, vol:.06, delay:.1 }); },
  mole:     () => { for (let i = 0; i < 3; i++) noise(.08, { freq:300, vol:.3, filter:"lowpass", delay:i * .11 }); },
  ant:      () => { noise(.05, { freq:2200, vol:.2 }); noise(.05, { freq:2200, vol:.2, delay:.12 }); tone(880, .08, { type:"triangle", vol:.08, delay:.22 }); },
  hurricane:() => { noise(1.4, { freq:500, q:.4, vol:.18 }); tone(220, 1.2, { slide:300, vol:.04 }); },
  boulders: () => { for (let i = 0; i < 3; i++) noise(.25, { freq:160, vol:.5, filter:"lowpass", delay:i * .25 }); },
  tornado:  () => { noise(1.1, { freq:1400, q:.8, vol:.14 }); tone(160, 1.1, { slide:700, vol:.05 }); },
  earthquake:() => { tone(45, 1.3, { type:"sawtooth", vol:.14 }); noise(1.3, { freq:120, vol:.4, filter:"lowpass" }); },
  sunshine: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, .22, { type:"sine", vol:.09, delay:i * .1 })),
  flow:     () => noise(.35, { freq:600, vol:.07, q:.7 }),
  snap:     () => noise(.1, { freq:1800, vol:.25 }),
  milestone:() => [523, 659, 784, 1047].forEach((f, i) => tone(f, .16, { type:"triangle", vol:.12, delay:i * .09 })),
  lose:     () => [392, 330, 262, 196].forEach((f, i) => tone(f, .32, { type:"triangle", vol:.12, delay:i * .18 }))
};

/* ---------- State ---------- */
let S;
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const key = (r,c) => r + "," + c;
const emptyCell = () => ({ water:false, card:null });
const mk = type => ({ type, kept:false });   // a card in your hand
const pick = (arr, n) => [...arr].sort(() => Math.random() - .5).slice(0, n);
const pressure = () => 1 + Math.floor((S.turn - 1) / 4);
let toastTimer = null;

function newRow(){
  const row = Array.from({length:COLS}, emptyCell);
  if (Math.random() < 0.4) row[Math.floor(Math.random() * COLS)].card = { type:"stone" };
  return row;
}

function newState(){
  return {
    grid: Array.from({length:PLAY_ROWS}, () => Array.from({length:COLS}, emptyCell)),
    turn:1, score:0, drained:0, held:0, hand:[], sel:-1, pending:null, den:0,
    hit:new Set(), lastEvent:null, lastEventTurn:0,
    nextMilestone:100, phase:"play", fresh:new Set(), lost:false, notes:[], snapped:false
  };
}

function drawCard(){
  const pool = Object.entries(CARDS);
  const total = pool.reduce((s,[,d]) => s + d.weight, 0);
  let roll = Math.random() * total;
  for (const [type, d] of pool){ roll -= d.weight; if (roll < 0) return type; }
  return "plank";
}

function countOnField(type){
  return S.grid.flat().filter(c => c.card && c.card.type === type).length;
}

/* Draws the new hand. Bat-kept cards stay; each fed wolf brings 2 random cards. */
function drawHand(){
  const kept = S.hand.filter(h => h.kept);
  const n = HAND_SIZE + countOnField("flag");
  S.hand = [...kept, ...Array.from({length:n}, () => mk(drawCard()))];
  const wolves = S.den;
  for (let i = 0; i < wolves * 2; i++) S.hand.push(mk(drawCard()));
  S.den = 0;
  S.sel = -1; S.pending = null;
  return { kept:kept.length, wolves };
}

function removeFromHand(indices){
  [...indices].sort((a,b) => b - a).forEach(i => S.hand.splice(i, 1));
}

/* ---------- Water ---------- */
/* Water tries to enter (r,c). Returns lost | full | blocked | absorbed | ok */
function flowInto(r, c, incoming, sideways){
  if (r >= PLAY_ROWS){ S.lost = true; return "lost"; }   // reached the reservoir row
  const cell = S.grid[r][c];
  if (cell.water) return "full";
  const card = cell.card;
  if (card){
    if (card.type === "stone") return "blocked";
    if (card.type === "plank"){
      if (!sideways){
        card.hp -= 1; S.held += 1; S.score += 1;
        if (card.hp <= 0){ cell.card = null; S.snapped = true; S.notes.push("A plank snapped under the pressure."); }
      }
      return "blocked";
    }
    if (card.type === "drain"){
      card.charges -= 1; S.drained += 1; S.score += 3;
      if (card.charges <= 0){ cell.card = null; S.notes.push("A funnel drain clogged up."); }
      return "absorbed";
    }
    // anything else (flags) gets washed away
    S.notes.push(`A ${CARDS[card.type] ? CARDS[card.type].name.toLowerCase() : card.type} washed away.`);
    cell.card = null;
  }
  incoming.add(key(r,c));
  return "ok";
}

function applyWater(incoming){
  for (const k of incoming){
    const [r,c] = k.split(",").map(Number);
    S.grid[r][c].water = true;
  }
  S.fresh = incoming;
}

function pourFromJar(){
  const incoming = new Set();
  for (let c = 0; c < COLS; c++) flowInto(0, c, incoming, false);
  applyWater(incoming);
}

function spread(r, c, incoming){
  for (const dc of [-1, 1]){
    const nc = c + dc;
    if (nc < 0 || nc >= COLS) continue;
    flowInto(r, nc, incoming, true);
  }
}

function flowStep(){
  const incoming = new Set();
  const sources = [];
  for (let r = 0; r < PLAY_ROWS; r++) for (let c = 0; c < COLS; c++) if (S.grid[r][c].water) sources.push([r,c]);
  for (const [r,c] of sources){
    const res = flowInto(r + 1, c, incoming, false);
    if (S.lost) return;
    if (res === "blocked") spread(r, c, incoming);
  }
  applyWater(incoming);
}

function shiftMap(){
  S.grid.shift();
  S.grid.push(newRow());
}

/* ---------- Card rules ---------- */
/* Returns an error message if the selected card can't target tile (r,c), or null if it can. */
function tileError(type, r, c){
  const cell = S.grid[r][c];
  const card = cell.card;
  const dryEmpty = !cell.water && !card;
  switch (type){
    case "plank":
      if (cell.water) return "Planks need a dry tile.";
      if (card && card.type !== "plank") return "Something is already on that tile.";
      return null;
    case "drain":
      if (!cell.water) return "Funnel drains go on a water tile.";
      if (card) return "Something is already on that tile.";
      return null;
    case "flag":
      if (!dryEmpty) return "Flags need an empty dry tile.";
      if (countOnField("flag") >= MAX_FLAGS) return `Only ${MAX_FLAGS} flags can stand at once.`;
      return null;
    case "monkey":
      if (!card || card.type !== "stone") return "The monkey only smashes stones.";
      return null;
    case "bear":
      if (!dryEmpty) return "The bear needs an empty dry tile.";
      if (S.hand.length < 2) return "You need another card in your hand to discard.";
      return null;
    case "mole":
      if (!card) return "The mole needs a card on the board to protect.";
      if (card.shielded) return "That card is already shielded.";
      return null;
    case "snake": {
      if (!S.pending){
        if (!card) return "Pick a tile with a card on it.";
        return null;
      }
      const [fr, fc] = S.pending.from;
      if (fr === r && fc === c) return "Pick a different tile.";
      const moving = S.grid[fr][fc].card;
      if (moving.type === "drain"){
        if (!cell.water || card) return "A drain can only move onto a water tile.";
        return null;
      }
      if (!dryEmpty) return "Move it onto an empty dry tile.";
      return null;
    }
    default:
      return "That card isn’t played on a tile.";
  }
}

function selectedType(){ return S.sel >= 0 ? S.hand[S.sel].type : null; }

function wantsHandPick(){
  const t = selectedType();
  return t === "wolf" || t === "bat" || t === "ant" || (t === "bear" && S.pending);
}

function finishPlay(indices){
  removeFromHand(indices);
  S.sel = -1; S.pending = null; S.fresh = new Set(); S.hit = new Set();
  render();
}

function onCell(r, c){
  if (S.phase !== "play") return;
  const type = selectedType();
  if (!type){ say("Pick a card from your hand first."); return; }
  const def = CARDS[type];
  if (def.target !== "tile"){ say(def.hint); SFX.invalid(); return; }
  const err = tileError(type, r, c);
  if (err){ say(err); SFX.invalid(); return; }
  const cell = S.grid[r][c];

  if (type === "plank"){
    if (cell.card){ cell.card.hp += 1; say(`Barrier reinforced to ${cell.card.hp} shield.`); }
    else { cell.card = { type:"plank", hp:1 }; say("Plank placed: 1 shield."); }
    SFX.plank();
  } else if (type === "drain"){
    cell.water = false;
    cell.card = { type:"drain", charges:DRAIN_CHARGES };
    S.drained += 1; S.score += 3;
    say("Funnel drain placed. The water gurgles away.");
    SFX.drain();
  } else if (type === "flag"){
    cell.card = { type:"flag" };
    say(`Flag planted (${countOnField("flag")}/${MAX_FLAGS}). You’ll draw an extra card next turn.`);
    SFX.flag();
  } else if (type === "monkey"){
    cell.card = null;
    removeFromHand([S.sel]);
    const drawn = drawCard();
    S.hand.push(mk(drawn));
    S.sel = -1; S.pending = null; S.fresh = new Set(); S.hit = new Set();
    say(`The monkey smashes the stone and hands you a ${CARDS[drawn].name}.`);
    SFX.monkey(); SFX.draw();
    render();
    return;
  } else if (type === "mole"){
    cell.card.shielded = true;
    const nm = cell.card.type === "stone" ? "stone" : CARDS[cell.card.type].name.toLowerCase();
    say(`The mole digs in around the ${nm}. It’s safe from disasters now.`);
    SFX.mole();
  } else if (type === "bear"){
    S.pending = { r, c };
    say("Now tap a card in your hand to discard.");
    SFX.select();
    render();
    return;
  } else if (type === "snake"){
    if (!S.pending){
      S.pending = { from:[r, c] };
      say("Now tap where the snake should move it.");
      SFX.select();
      render();
      return;
    }
    const [fr, fc] = S.pending.from;
    const moving = S.grid[fr][fc].card;
    S.grid[fr][fc].card = null;
    if (moving.type === "drain"){ cell.water = false; S.drained += 1; S.score += 3; }
    cell.card = moving;
    say("The snake slithers the card to its new spot.");
    SFX.snake();
  }
  finishPlay([S.sel]);
}

function onHandCard(i){
  if (S.phase !== "play") return;
  const type = selectedType();

  // Second step for the wolf or bear: choosing another card in hand
  if (type && i !== S.sel && wantsHandPick()){
    const picked = S.hand[i];
    const pname = CARDS[picked.type].name;
    if (type === "wolf"){
      S.den += 1;
      say(`The wolf gobbles up your ${pname}. It’ll bring 2 random cards next turn.`);
      SFX.wolf();
    } else if (type === "bat"){
      if (picked.kept){ say(`Your ${pname} is already being kept.`); SFX.invalid(); return; }
      picked.kept = true;
      say(`The bat hangs onto your ${pname}. It’ll stay in your hand between turns.`);
      SFX.bat();
      finishPlay([S.sel]);
      return;
    } else if (type === "ant"){
      const n = picked.type === "flag" ? 2 : 1;
      removeFromHand([S.sel, i]);
      const drawn = Array.from({length:n}, drawCard);
      drawn.forEach(t => S.hand.push(mk(t)));
      say(`The ant chops up your ${pname} and you draw ${drawn.map(t => CARDS[t].name).join(" and ")}.`);
      SFX.ant(); SFX.draw();
      finishPlay([]);
      return;
    } else {
      const { r, c } = S.pending;
      S.grid[r][c].card = { type:"stone" };
      say(`You discard the ${pname}. The bear drops a stone.`);
      SFX.bear();
    }
    finishPlay([S.sel, i]);
    return;
  }

  if (S.sel === i){
    S.sel = -1; S.pending = null;
    say("Card put back.");
    SFX.deselect();
  } else {
    S.sel = i; S.pending = null;
    const t = S.hand[i].type, d = CARDS[t];
    if (CARDS[t].target === "hand" && S.hand.length < 2) say(`There’s no other card in your hand for the ${d.name.toLowerCase()}.`);
    else say(`${d.name}: ${d.hint}`);
    SFX.select();
  }
  render();
}

function useSelected(){
  if (S.phase !== "play") return;
  const type = selectedType();
  if (type !== "beaver") return;
  const planks = S.grid.flat().filter(c => c.card && c.card.type === "plank");
  if (!planks.length){ say("There are no planks for the beaver to upgrade."); SFX.invalid(); return; }
  planks.forEach(c => { c.card.hp += BEAVER_BONUS; c.card.upgraded = true; });
  say(`The beaver gnaws and patches ${planks.length} plank${planks.length > 1 ? "s" : ""}: +${BEAVER_BONUS} shield each.`);
  SFX.beaver();
  finishPlay([S.sel]);
}

/* ---------- Turn flow ---------- */
async function endTurn(){
  if (S.phase !== "play") return;
  const run = S;
  S.phase = "flowing"; S.sel = -1; S.pending = null; S.notes = []; S.hit = new Set();
  const steps = pressure();
  render();
  for (let i = 0; i < steps; i++){
    S.snapped = false;
    flowStep();
    SFX.flow();
    if (S.snapped) SFX.snap();
    render();
    if (S.lost){ await sleep(reduceMotion ? 0 : 500); if (S !== run) return; return gameOver(); }
    await sleep(reduceMotion ? 120 : 420);
    if (S !== run) return; // the player reset mid-flow
  }
  S.score += S.turn;
  S.turn += 1;
  shiftMap();
  pourFromJar();
  const drew = drawHand();
  SFX.draw();
  S.phase = "play";
  const parts = [...new Set(S.notes)];
  parts.push("The sewer shifts down a level.");
  if (drew.wolves) parts.push(`The wolf brings you ${drew.wolves * 2} cards.`);
  if (drew.kept) parts.push(`The bat kept ${drew.kept} card${drew.kept > 1 ? "s" : ""} in your hand.`);
  if (steps < pressure()) parts.push("Pressure is rising.");
  let eventKey = null;
  if (S.turn % EVENT_EVERY === 0){
    eventKey = pick(Object.keys(EVENTS), 1)[0];
    parts.unshift(runEvent(eventKey));
  }
  say(parts.join(" "));
  render();
  if (eventKey){
    showToast(`${EVENTS[eventKey].name}!`);
    SFX[eventKey]();
    if ((eventKey === "earthquake" || eventKey === "boulders") && !reduceMotion){
      const b = $("board"); b.classList.remove("quake"); void b.offsetWidth; b.classList.add("quake");
    }
  }
}

/* ---------- Disasters ---------- */
const safe = cell => cell.card && cell.card.shielded;

function wreck(r, c){
  const cell = S.grid[r][c];
  S.hit.add(key(r,c));
  if (cell.card && !cell.card.shielded){ cell.card = null; return 1; }
  return 0;
}

function runEvent(type){
  S.lastEvent = type; S.lastEventTurn = S.turn;
  S.hit = new Set();
  const all = [];
  for (let r = 0; r < PLAY_ROWS; r++) for (let c = 0; c < COLS; c++) all.push([r, c]);
  const saved = all.filter(([r,c]) => safe(S.grid[r][c])).length;
  const shieldNote = saved ? " Shielded cards held firm." : "";

  if (type === "hurricane"){
    let n = 0;
    for (const [r,c] of all){
      const cell = S.grid[r][c];
      if (cell.card && cell.card.type === "plank"){ S.hit.add(key(r,c)); if (!cell.card.shielded){ cell.card = null; n++; } }
    }
    return `Hurricane! The wind tears away ${n} wooden plank${n === 1 ? "" : "s"}.${shieldNote}`;
  }
  if (type === "boulders"){
    const spots = pick(all.filter(([r,c]) => {
      const card = S.grid[r][c].card;
      return !card || (!card.shielded && card.type !== "stone");
    }), 3);
    let crushed = 0;
    for (const [r,c] of spots){
      const cell = S.grid[r][c];
      if (cell.card) crushed++;
      cell.card = { type:"stone" };
      cell.water = false;
      S.hit.add(key(r,c));
    }
    return `Boulder storm! ${spots.length} rocks crash down${crushed ? `, crushing ${crushed} card${crushed > 1 ? "s" : ""}` : ""}.`;
  }
  if (type === "tornado"){
    const cols = pick([...Array(COLS).keys()], 2).sort((a,b) => a - b);
    let n = 0;
    for (const c of cols) for (let r = 0; r < PLAY_ROWS; r++) n += wreck(r, c);
    return `Tornado! Columns ${cols.map(c => c + 1).join(" and ")} are swept clean, ${n} card${n === 1 ? "" : "s"} lost.${shieldNote}`;
  }
  if (type === "earthquake"){
    const rows = pick([...Array(PLAY_ROWS).keys()], 3).sort((a,b) => a - b);
    let n = 0;
    for (const r of rows) for (let c = 0; c < COLS; c++) n += wreck(r, c);
    return `Earthquake! Rows ${rows.map(r => r + 1).join(", ")} crumble, ${n} card${n === 1 ? "" : "s"} lost.${shieldNote}`;
  }
  // clear sunshine
  let n = 0;
  for (const [r,c] of all){
    const cell = S.grid[r][c];
    if (cell.water){ cell.water = false; n++; S.hit.add(key(r,c)); }
  }
  S.fresh = new Set();
  return `Clear sunshine! ${n} tile${n === 1 ? "" : "s"} of water dry up.`;
}

function gameOver(){
  S.phase = "over";
  SFX.lose();
  let best = S.score;
  try {
    best = Math.max(S.score, Number(localStorage.getItem("ebbcrow-best")) || 0);
    localStorage.setItem("ebbcrow-best", String(best));
  } catch(e){}
  $("oTurns").textContent = S.turn - 1;
  $("oDrained").textContent = S.drained;
  $("oScore").textContent = S.score;
  $("oBest").textContent = best;
  $("over").classList.add("show");
  $("againBtn").focus();
}

/* ---------- Milestones ---------- */
function checkMilestone(){
  if (S.phase === "title" || S.score < S.nextMilestone) return;
  const reached = Math.floor(S.score / 100) * 100;
  S.nextMilestone = reached + 100;
  showToast(`Milestone! ${reached} points`);
  SFX.milestone();
}

const toastQueue = [];
function showToast(text){
  toastQueue.push(text);
  if (!toastTimer) nextToast();
}
function nextToast(){
  const t = $("toast");
  if (!toastQueue.length){ toastTimer = null; return; }
  t.textContent = toastQueue.shift();
  t.classList.add("show");
  toastTimer = setTimeout(() => {
    t.classList.remove("show");
    toastTimer = setTimeout(nextToast, 300);
  }, 2200);
}

/* ---------- Drawing the screen ---------- */
function say(t){ $("msg").textContent = t; }

function threatened(){
  return S.grid[PLAY_ROWS - 1].some(c => c.water);
}

function render(){
  $("turn").textContent = `Turn ${S.turn}`;
  $("score").textContent = `Score: ${S.score}`;
  $("pressure").textContent = pressure();
  checkMilestone();
  if (S.phase === "title") $("forecast").textContent = "";
  else if (S.lastEventTurn === S.turn && S.lastEvent)
    $("forecast").innerHTML = `This turn: <b>${EVENTS[S.lastEvent].name}</b>. Next disaster in ${EVENT_EVERY} turns.`;
  else {
    const n = EVENT_EVERY - (S.turn % EVENT_EVERY);
    $("forecast").innerHTML = n === 1 ? "<b>A disaster strikes next turn!</b>" : `Next disaster in ${n} turns.`;
  }

  const board = $("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  const selType = selectedType();
  const tileMode = selType && CARDS[selType].target === "tile" && !wantsHandPick();

  for (let r = 0; r < PLAY_ROWS; r++){
    for (let c = 0; c < COLS; c++){
      const cell = S.grid[r][c];
      const b = document.createElement("button");
      b.className = "cell";
      b.setAttribute("role", "gridcell");
      let label = `Row ${r+1}, column ${c+1}: `;
      let html = "";
      if (cell.water){ html += `<div class="water"></div>`; label += "dirty water "; }
      const card = cell.card;
      if (card){
        if (card.type === "stone"){ html += `<div class="stone"></div>`; label += "stone"; }
        if (card.type === "plank"){
          html += `<div class="icon">${card.upgraded ? ART.plankUp : ART.plank}</div><span class="badge${card.upgraded ? " up" : ""}">${card.hp}</span>`;
          label += `${card.upgraded ? "upgraded " : ""}plank barrier, ${card.hp} shield`;
        }
        if (card.type === "drain"){ html += `<div class="icon">${ART.drain}</div><span class="badge">${card.charges}</span>`; label += `funnel drain, ${card.charges} drains left`; }
        if (card.type === "flag"){ html += `<div class="icon">${ART.flag}</div>`; label += "flag"; }
        if (card.shielded){ html += `<span class="shield-mark">${ART.shield}</span>`; label += ", disaster shielded"; }
      }
      if (!cell.water && !card) label += "empty";
      b.innerHTML = html;
      if (S.fresh.has(key(r,c))) b.classList.add("fresh");
      if (S.hit.has(key(r,c))) b.classList.add("hit");
      if (tileMode && !tileError(selType, r, c)) b.classList.add("target");
      if (S.pending && S.pending.from && S.pending.from[0] === r && S.pending.from[1] === c) b.classList.add("picked");
      if (S.pending && S.pending.r === r && S.pending.c === c) b.classList.add("picked");
      b.setAttribute("aria-label", label.trim());
      b.disabled = S.phase !== "play";
      b.addEventListener("click", () => onCell(r, c));
      board.appendChild(b);
    }
  }
  const res = document.createElement("div");
  res.className = "reservoir-row" + (threatened() ? " threat" : "");
  res.innerHTML = `${ART.drop}<span>Clean reservoir</span>${ART.drop}`;
  board.appendChild(res);

  const hand = $("hand");
  hand.innerHTML = "";
  const picking = wantsHandPick();
  S.hand.forEach((h, i) => {
    const type = h.type, d = CARDS[type];
    const b = document.createElement("button");
    b.className = "card" + (picking && i !== S.sel ? " pickable" : "");
    b.setAttribute("aria-pressed", String(S.sel === i));
    b.innerHTML = `${h.kept ? `<span class="kept">Kept</span>` : ""}${ART[type]}<span class="name">${d.name}</span><span class="text">${d.text}</span>`;
    b.setAttribute("aria-label", `${d.name}${h.kept ? " (kept by the bat)" : ""}: ${d.text}`);
    b.disabled = S.phase !== "play";
    b.addEventListener("click", () => onHandCard(i));
    hand.appendChild(b);
  });
  if (!S.hand.length && S.phase === "play"){
    const p = document.createElement("p");
    p.className = "msg";
    p.textContent = "Hand empty. End your turn to let the water flow.";
    hand.appendChild(p);
  }

  $("den").textContent = S.den
    ? `The wolf will bring you ${S.den * 2} extra cards next turn.`
    : "";

  const useBtn = $("useBtn");
  useBtn.hidden = !(selType && CARDS[selType].target === "none");
  if (!useBtn.hidden) useBtn.textContent = `Use ${CARDS[selType].name}`;
  $("endTurn").disabled = S.phase !== "play";
}

function updateMuteButton(){
  $("muteBtn").textContent = muted ? "Sound: off" : "Sound: on";
  $("muteBtn").setAttribute("aria-pressed", String(muted));
}

function startGame(){
  S = newState();
  // a few stones to start with
  for (const r of [3, 4, 5]) if (Math.random() < 0.7) S.grid[r][Math.floor(Math.random() * COLS)].card = { type:"stone" };
  pourFromJar();
  drawHand();
  $("title").classList.remove("show");
  $("over").classList.remove("show");
  say("The jar tips over. Build barriers or drain the flow before ending your turn.");
  SFX.draw();
  render();
}

$("jarSmall").innerHTML = ART.jar;
$("jarBig").innerHTML = ART.jar;
$("crowArt").innerHTML = ART.crow;
$("startBtn").addEventListener("click", startGame);
$("againBtn").addEventListener("click", startGame);
$("endTurn").addEventListener("click", endTurn);
$("resetBtn").addEventListener("click", startGame);
$("useBtn").addEventListener("click", useSelected);
$("muteBtn").addEventListener("click", () => {
  muted = !muted;
  try { localStorage.setItem("ebbcrow-muted", muted ? "1" : "0"); } catch(e){}
  updateMuteButton();
  if (!muted) SFX.select();
});
updateMuteButton();
S = newState();
S.phase = "title";
render();