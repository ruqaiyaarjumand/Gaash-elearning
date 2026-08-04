/* =====================================================================
   GAASH — APP LOGIC (skeleton)
   One source of truth (state) drives what the learner sees.
   Every action updates state; state updates the screen.
   Screen-specific logic (lesson, quiz, reward) gets added as we build
   each one. This file currently handles: state, navigation, stats,
   and saving/loading progress.
   ===================================================================== */

const STORAGE_KEY = "gaash-progress";

/* ---- Single source of truth ---- */
const state = {
  points: 0,
  streak: 0,
  foundParts: [],   // ids of discovered parts
  quizScore: 0,
  screen: "welcome"
};

/* ---- Show one screen, hide the rest ---- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(section => {
    section.classList.toggle("is-active", section.id === "screen-" + id);
  });
  state.screen = id;
  save();
}

/* ---- Reflect points + streak in the top bar ---- */
function renderStats() {
  document.getElementById("points-value").textContent = state.points;
  document.getElementById("streak-value").textContent = state.streak;
}

/* ---- Persistence = the "user tracking" feature (localStorage) ---- */
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* private-mode or storage-full: fail quietly, app still works */
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) Object.assign(state, saved);
  } catch (e) {
    /* no saved data yet — start fresh */
  }
}

/* ---- Navigation via data-goto attributes, e.g. <button data-goto="lesson"> ---- */
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-goto]");
  if (trigger) showScreen(trigger.dataset.goto);
});

/* ---- Boot ---- */
document.addEventListener("DOMContentLoaded", () => {
  load();
  renderStats();
  showScreen(state.screen);
});
