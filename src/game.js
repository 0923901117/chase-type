import {
  StateMachine,
  createChaseState,
  createDuelTransitionState,
  createDuelState,
  createWantedPosterState,
  createGameOverState
} from "./state-machine.js";
import { NPCS, randomWord } from "./npc-data.js";

// ---- DOM refs ----
const canvas = document.getElementById("game-canvas");
const c = canvas.getContext("2d");
const inputEl = document.getElementById("typing-input");
const wordDisplay = document.getElementById("current-word");
const npcNameEl = document.getElementById("npc-name");
const distanceFill = document.getElementById("distance-bar-fill");
const chaseHpFill = document.getElementById("chase-hp-fill");
const duelHpFill = document.getElementById("duel-hp-fill");

// ---- Resize canvas ----
function resizeCanvas() {
  const wrapper = document.getElementById("canvas-wrapper");
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ---- Game state context ----
const ctx = {
  canvas,
  c,
  // State tracking
  currentNPCIndex: 0,
  npc: NPCS[0],
  // HP — independent for chase and duel
  chaseHP: NPCS[0].chaseHP,
  duelHP: NPCS[0].duelHP,
  // Chase
  playerPos: 50,
  npcPos: 0,  // will be set on chase enter
  currentWord: "",
  // Transition timer
  transitionTimer: 0,
};

// ---- Create state machine ----
const sm = new StateMachine({
  chase: createChaseState(),
  duelTransition: createDuelTransitionState(),
  duel: createDuelState(),
  wantedPoster: createWantedPosterState(),
  gameOver: createGameOverState()
}, "chase");

// Initialize NPC position
ctx.npcPos = canvas.width - 100;

// ---- HUD update ----
function updateHUD() {
  // Distance bar
  const maxDist = canvas.width - 160;
  const dist = Math.max(0, ctx.npcPos - ctx.playerPos);
  const pct = Math.max(0, Math.min(100, (1 - dist / maxDist) * 100));
  distanceFill.style.width = pct + "%";

  // HP bars
  const npc = ctx.npc || NPCS[0];
  chaseHpFill.style.width = (ctx.chaseHP / npc.chaseHP * 100) + "%";
  duelHpFill.style.width = (ctx.duelHP / npc.duelHP * 100) + "%";

  // Current word
  wordDisplay.textContent = ctx.currentWord || "---";

  // NPC name
  npcNameEl.textContent = npc.name;
}

// ---- Input handling ----
inputEl.addEventListener("input", () => {
  const typed = inputEl.value.trim().toLowerCase();
  
  // If typed matches current word
  if (ctx.currentWord && typed === ctx.currentWord.toLowerCase()) {
    inputEl.value = "";
    inputEl.classList.add("correct");
    setTimeout(() => inputEl.classList.remove("correct"), 150);
    
    // Notify state
    ctx.wordCompleted = true;
    ctx.currentWord = randomWord();
  } else if (ctx.currentWord && !ctx.currentWord.toLowerCase().startsWith(typed)) {
    // Wrong character
    inputEl.classList.add("wrong");
    setTimeout(() => inputEl.classList.remove("wrong"), 200);
  }
});

// Keep focus on input
document.addEventListener("click", (e) => {
  if (e.target !== inputEl) {
    inputEl.focus();
  }
});

// Wanted poster and GameOver clicks
canvas.addEventListener("click", () => {
  if (sm.current === "wantedPoster") {
    ctx.currentNPCIndex++;
    if (ctx.currentNPCIndex >= NPCS.length) {
      // Victory! — restart from beginning for now
      ctx.currentNPCIndex = 0;
    }
    ctx.npc = NPCS[ctx.currentNPCIndex];
    ctx.chaseHP = ctx.npc.chaseHP;
    ctx.duelHP = ctx.npc.duelHP;
    ctx.playerPos = 50;
    ctx.npcPos = canvas.width - 100;
    ctx.currentWord = randomWord();
    sm.transition("chase", ctx);
  } else if (sm.current === "gameOver") {
    // Retry from current NPC
    ctx.chaseHP = ctx.npc.chaseHP;
    ctx.duelHP = ctx.npc.duelHP;
    ctx.playerPos = 50;
    ctx.npcPos = canvas.width - 100;
    ctx.currentWord = randomWord();
    sm.transition("chase", ctx);
  }
});

// ---- Debug: keyboard shortcuts ----
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) return;
  
  switch (e.key) {
    case "1": sm.transition("chase", ctx); break;
    case "2": sm.transition("duelTransition", ctx); break;
    case "3": sm.transition("duel", ctx); break;
    case "4": sm.transition("wantedPoster", ctx); break;
    case "5": sm.transition("gameOver", ctx); break;
  }
});

// ---- Game loop ----
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1); // cap at 100ms
  lastTime = timestamp;

  // Update state
  sm.update(ctx, dt);

  // Render
  c.clearRect(0, 0, canvas.width, canvas.height);
  sm.render(ctx);

  // Update HUD
  updateHUD();

  requestAnimationFrame(gameLoop);
}

// ---- Start ----
ctx.currentWord = randomWord();
inputEl.focus();
requestAnimationFrame(gameLoop);

console.log("[Chase-Type] Game started");
console.log("[Chase-Type] State machine states: chase, duelTransition, duel, wantedPoster, gameOver");
console.log("[Chase-Type] Press 1-5 to switch states for testing");
console.log("[Chase-Type] NPCs:", NPCS.map(n => n.name).join(", "));
