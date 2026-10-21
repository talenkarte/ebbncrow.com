const COLS = 4, ROWS = 5;

const ART = {
  plank: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="18" width="56" height="28" rx="3" fill="#9a6435"/><rect x="4" y="18" width="56" height="6" rx="2" fill="#b87a45"/><path d="M10 31h20M26 37h28M12 41h10" stroke="#6e4423" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="24" r="2" fill="#3a3a44"/><circle cx="54" cy="24" r="2" fill="#3a3a44"/><circle cx="10" cy="40" r="2" fill="#3a3a44"/><circle cx="54" cy="40" r="2" fill="#3a3a44"/></svg>`,
  drain: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 12h48L38 36v18H26V36z" fill="#c4743f" stroke="#7a3f1d" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="32" cy="12" rx="24" ry="5" fill="#2a1a14" stroke="#7a3f1d" stroke-width="2.5"/><path d="M18 19l9 11" stroke="#e8a46d" stroke-width="3" stroke-linecap="round"/><rect x="26" y="50" width="12" height="4" fill="#7a3f1d"/></svg>`,
  flag: `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="18" cy="58" rx="10" ry="3" fill="rgba(0,0,0,.35)"/><rect x="16" y="6" width="4" height="52" rx="1" fill="#d9d2c3"/><path d="M20 9L52 17L20 27z" fill="#f2c230" stroke="#9c7a12" stroke-width="2" stroke-linejoin="round"/></svg>`,
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

const CARDS = {
  plank: { name:"Wooden plank", text:"+1 shield on a dry tile. Stack to reinforce.", weight:5 },
  drain: { name:"Funnel drain", text:"Play on water. Drains it, then soaks up 3 more flows.", weight:3 },
  flag:  { name:"Flag", text:"Draw 1 extra card each turn while it stands.", weight:2 }
};
const DRAIN_CHARGES = 3;

let S;
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const key = (r,c) => r + "," + c;
const isRes = (r,c) => r === ROWS - 1 && c === COLS - 1;
const emptyCell = () => ({ water:false, card:null });
const pressure = () => 1 + Math.floor((S.turn - 1) / 4);

function newRow(){
  const row = Array.from({length:COLS}, emptyCell);
  if (Math.random() < 0.4) row[Math.floor(Math.random() * (COLS - 1))].card = { type:"stone" };
  return row;
}

function newState(){
  return {
    grid: Array.from({length:ROWS}, emptyCell).map(() => Array.from({length:COLS}, emptyCell)),
    turn:1, score:0, drained:0, held:0, hand:[], sel:-1,
    phase:"play", fresh:new Set(), lost:false, notes:[]
  };
}

function drawCard(){
  const pool = Object.entries(CARDS);
  const total = pool.reduce((s,[,d]) => s + d.weight, 0);
  let roll = Math.random() * total;
  for (const [type, d] of pool){ roll -= d.weight; if (roll < 0) return type; }
  return "plank";
}

function flagsOnField(){
  return S.grid.flat().filter(c => c.card && c.card.type === "flag").length;
}

function drawHand(){
  const n = 3 + flagsOnField();
  S.hand = Array.from({length:n}, drawCard);
  S.sel = -1;
}

/* Water tries to enter (r,c). Returns lost | full | blocked | absorbed | ok */
function flowInto(r, c, incoming, sideways){
  if (isRes(r,c)){ S.lost = true; return "lost"; }
  const cell = S.grid[r][c];
  if (cell.water) return "full";
  const card = cell.card;
  if (card){
    if (card.type === "stone") return "blocked";
    if (card.type === "plank"){
      if (!sideways){
        card.hp -= 1; S.held += 1; S.score += 1;
        if (card.hp <= 0){ cell.card = null; S.notes.push("A plank snapped under the pressure."); }
      }
      return "blocked";
    }
    if (card.type === "drain"){
      card.charges -= 1; S.drained += 1; S.score += 3;
      if (card.charges <= 0){ cell.card = null; S.notes.push("A funnel drain clogged up."); }
      return "absorbed";
    }
    if (card.type === "flag"){ cell.card = null; S.notes.push("A flag washed away."); }
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
    if (flowInto(r, nc, incoming, true) === "lost") return;
  }
}

function flowStep(){
  const incoming = new Set();
  const sources = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (S.grid[r][c].water) sources.push([r,c]);
  for (const [r,c] of sources){
    if (r === ROWS - 1){ spread(r, c, incoming); }
    else {
      const res = flowInto(r + 1, c, incoming, false);
      if (res === "blocked") spread(r, c, incoming);
    }
    if (S.lost) return;
  }
  applyWater(incoming);
}

function shiftMap(){
  S.grid.shift();
  S.grid.push(newRow());
}

function cardError(type, r, c){
  if (isRes(r,c)) return "That’s the clean reservoir. Protect it, don’t build on it.";
  const cell = S.grid[r][c];
  if (cell.card && cell.card.type === "stone") return "Stone is already solid.";
  if (type === "plank"){
    if (cell.water) return "Planks need a dry tile.";
    if (cell.card && cell.card.type !== "plank") return "Something is already on that tile.";
    return null;
  }
  if (type === "drain"){
    if (!cell.water) return "Funnel drains go on a water tile.";
    if (cell.card) return "Something is already on that tile.";
    return null;
  }
  if (type === "flag"){
    if (cell.water) return "Flags need a dry tile.";
    if (cell.card) return "Something is already on that tile.";
    return null;
  }
  return "Can’t play that here.";
}

function playCard(r, c){
  const type = S.hand[S.sel];
  const err = cardError(type, r, c);
  if (err){ say(err); return; }
  const cell = S.grid[r][c];
  if (type === "plank"){
    if (cell.card) { cell.card.hp += 1; say(`Barrier reinforced to ${cell.card.hp} shield.`); }
    else { cell.card = { type:"plank", hp:1 }; say("Plank placed: 1 shield."); }
  } else if (type === "drain"){
    cell.water = false;
    cell.card = { type:"drain", charges:DRAIN_CHARGES };
    S.drained += 1; S.score += 3;
    say("Funnel drain placed. The water gurgles away.");
  } else if (type === "flag"){
    cell.card = { type:"flag" };
    say("Flag planted. You’ll draw an extra card next turn.");
  }
  S.hand.splice(S.sel, 1);
  S.sel = -1;
  S.fresh = new Set();
  render();
}

async function endTurn(){
  if (S.phase !== "play") return;
  const run = S;
  S.phase = "flowing"; S.sel = -1; S.notes = [];
  const steps = pressure();
  render();
  for (let i = 0; i < steps; i++){
    flowStep();
    render();
    if (S.lost){ await sleep(reduceMotion ? 0 : 500); if (S !== run) return; return gameOver(); }
    await sleep(reduceMotion ? 120 : 420);
    if (S !== run) return; // the player reset mid-flow
  }
  S.score += S.turn;
  S.turn += 1;
  shiftMap();
  pourFromJar();
  drawHand();
  S.phase = "play";
  const extra = steps < pressure() ? " Pressure is rising." : "";
  say((S.notes.length ? [...new Set(S.notes)].join(" ") + " " : "") + "The sewer shifts down a level." + extra);
  render();
}

function gameOver(){
  S.phase = "over";
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

function say(t){ $("msg").textContent = t; }

function threatened(){
  const r = ROWS - 1, c = COLS - 1;
  return S.grid[r-1][c].water || S.grid[r][c-1].water;
}

function render(){
  $("turn").textContent = `Turn ${S.turn}`;
  $("score").textContent = `Score: ${S.score}`;
  $("pressure").textContent = pressure();

  const board = $("board");
  board.innerHTML = "";
  const selType = S.sel >= 0 ? S.hand[S.sel] : null;
  const danger = threatened();
  for (let r = 0; r < ROWS; r++){
    for (let c = 0; c < COLS; c++){
      const cell = S.grid[r][c];
      const b = document.createElement("button");
      b.className = "cell";
      b.setAttribute("role", "gridcell");
      let label = `Row ${r+1}, column ${c+1}: `;
      if (isRes(r,c)){
        b.innerHTML = `<div class="reservoir">${ART.drop}<span>Reservoir</span></div>`;
        if (danger) b.classList.add("threat");
        label += "clean reservoir";
      } else {
        let html = "";
        if (cell.water){ html += `<div class="water"></div>`; label += "dirty water"; }
        const card = cell.card;
        if (card){
          if (card.type === "stone"){ html += `<div class="stone"></div>`; label += "stone"; }
          if (card.type === "plank"){ html += `<div class="icon">${ART.plank}</div><span class="badge">${card.hp}</span>`; label += `plank barrier, ${card.hp} shield`; }
          if (card.type === "drain"){ html += `<div class="icon">${ART.drain}</div><span class="badge">${card.charges}</span>`; label += `funnel drain, ${card.charges} drains left`; }
          if (card.type === "flag"){ html += `<div class="icon">${ART.flag}</div>`; label += "flag"; }
        }
        if (!cell.water && !card) label += "empty";
        b.innerHTML = html;
        if (S.fresh.has(key(r,c))) b.classList.add("fresh");
      }
      if (selType && !cardError(selType, r, c)) b.classList.add("target");
      b.setAttribute("aria-label", label);
      b.disabled = S.phase !== "play";
      b.addEventListener("click", () => onCell(r, c));
      board.appendChild(b);
    }
  }

  const hand = $("hand");
  hand.innerHTML = "";
  S.hand.forEach((type, i) => {
    const d = CARDS[type];
    const b = document.createElement("button");
    b.className = "card";
    b.setAttribute("aria-pressed", String(S.sel === i));
    b.innerHTML = `${ART[type]}<span class="name">${d.name}</span><span class="text">${d.text}</span>`;
    b.disabled = S.phase !== "play";
    b.addEventListener("click", () => {
      S.sel = S.sel === i ? -1 : i;
      if (S.sel >= 0) say(`${d.name} selected. Tap a highlighted tile.`);
      render();
    });
    hand.appendChild(b);
  });
  if (!S.hand.length && S.phase === "play"){
    const p = document.createElement("p");
    p.className = "msg";
    p.textContent = "Hand empty. End your turn to let the water flow.";
    hand.appendChild(p);
  }
  $("endTurn").disabled = S.phase !== "play";
}

function onCell(r, c){
  if (S.phase !== "play") return;
  if (S.sel < 0){ say("Pick a card from your hand first."); return; }
  playCard(r, c);
}

function startGame(){
  S = newState();
  // a couple of stones to start with, never on the reservoir
  S.grid[2][Math.floor(Math.random()*3)].card = { type:"stone" };
  S.grid[3][1 + Math.floor(Math.random()*2)].card = { type:"stone" };
  pourFromJar();
  drawHand();
  $("title").classList.remove("show");
  $("over").classList.remove("show");
  say("The jar tips over. Build barriers or drain the flow before ending your turn.");
  render();
}

$("jarSmall").innerHTML = ART.jar;
$("jarBig").innerHTML = ART.jar;
$("crowArt").innerHTML = ART.crow;
$("startBtn").addEventListener("click", startGame);
$("againBtn").addEventListener("click", startGame);
$("endTurn").addEventListener("click", endTurn);
$("resetBtn").addEventListener("click", startGame);
S = newState();
render();