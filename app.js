/* =====================================================================
   GAASH: APP LOGIC
   Data-driven: the lesson comes from lessons/<id>.js (registered into
   window.LESSONS). Every screen is built from that data, so swapping
   cow -> buffalo -> goat is just a different file.

   One `state` object is the single source of truth. All interaction is
   handled by ONE delegated click listener (below), so rebuilding a
   screen never stacks duplicate handlers. Progress is saved to
   localStorage.
   ===================================================================== */

const STORAGE_KEY = "gaash-progress";
let lesson = null;
const sessionStart = Date.now();

/* Temporary quiz-interaction variables (describe the current attempt,
   so they live outside `state` and are never persisted). */
let quizAnswered = false;

/* ---- Single source of truth ---- */
const state = {
  lessonId: "cow",
  screen: "welcome",
  foundParts: [],
  points: 0,
  rewarded: [],          // keys of things already scored, so nothing double-counts
  earnedBadges: [],      // badge ids the learner has completed
  quizIndex: 0,
  quizScore: 0,
  answers: []            // { id, correct, category, bloom } -> powers the summary
};

/* ---- Persistence = the "user tracking" feature ---- */
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { /* private mode / full: fail quietly */ }
}
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.lessonId === state.lessonId) Object.assign(state, saved);
  } catch (e) { /* nothing saved yet */ }
}

/* ---- Show one screen, hide the rest ---- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.toggle("is-active", s.id === "screen-" + id));
  state.screen = id;
  save();
}

/* ---- Reflect points in the top bar ---- */
function renderStats() {
  document.getElementById("points-value").textContent = state.points;
}

/* ---- Daily learning streak: consecutive days the learner opens Gaash.
   Stored separately from lesson state so it survives lesson switches. ---- */
function updateDailyStreak() {
  const KEY = "gaash-streak";
  const pad = n => String(n).padStart(2, "0");
  const now = new Date();
  const todayStr = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
  if (!data || !data.last) {
    data = { count: 1, last: todayStr };
  } else if (data.last !== todayStr) {
    const last = new Date(data.last + "T00:00:00");
    const today = new Date(todayStr + "T00:00:00");
    const diffDays = Math.round((today - last) / 86400000);
    data.count = (diffDays === 1) ? data.count + 1 : 1;   // 1 day apart continues; a gap resets
    data.last = todayStr;
  }
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  return data.count;
}

/* ---- Animal illustrations (same style system, picked per lesson) ---- */
function animalSVG(l) { return l.id === "buffalo" ? buffaloSVG() : cowSVG(); }

function buffaloSVG() {
  return `
  <svg viewBox="0 0 320 240" class="cow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="160" cy="214" rx="118" ry="14" fill="#CFE0C0"/>
    <g stroke="#2A3A2E" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <rect x="110" y="150" width="22" height="58" rx="7" fill="#8A929B"/>
      <rect x="148" y="156" width="22" height="52" rx="7" fill="#8A929B"/>
      <rect x="196" y="156" width="22" height="52" rx="7" fill="#8A929B"/>
      <rect x="230" y="150" width="22" height="58" rx="7" fill="#8A929B"/>
      <rect x="108" y="198" width="26" height="12" rx="4" fill="#2E3338" stroke="none"/>
      <rect x="146" y="198" width="26" height="12" rx="4" fill="#2E3338" stroke="none"/>
      <rect x="194" y="198" width="26" height="12" rx="4" fill="#2E3338" stroke="none"/>
      <rect x="228" y="198" width="26" height="12" rx="4" fill="#2E3338" stroke="none"/>
      <path d="M266 112 q24 22 14 68" fill="none"/>
      <path d="M272 172 q-6 14 2 24 q10 -8 5 -24 Z" fill="#2E3338" stroke="none"/>
      <ellipse cx="180" cy="174" rx="30" ry="20" fill="#6E767E"/>
      <ellipse cx="178" cy="120" rx="102" ry="64" fill="#8A929B"/>
      <ellipse cx="70" cy="122" rx="38" ry="44" fill="#8A929B"/>
      <ellipse cx="50" cy="150" rx="25" ry="19" fill="#6E767E"/>
      <ellipse cx="42" cy="150" rx="2.8" ry="4" fill="#3A3F44" stroke="none"/>
      <ellipse cx="56" cy="150" rx="2.8" ry="4" fill="#3A3F44" stroke="none"/>
      <ellipse cx="40" cy="92" rx="12" ry="8" fill="#8A929B"/>
      <ellipse cx="100" cy="96" rx="12" ry="8" fill="#8A929B"/>
      <path d="M60 80 C 42 72 22 66 8 68 C 6 73 10 78 20 80 C 34 83 48 86 56 92 Z" fill="#3A3F44"/>
      <path d="M80 80 C 98 72 118 66 132 68 C 134 73 130 78 120 80 C 106 83 92 86 84 92 Z" fill="#3A3F44"/>
      <circle cx="58" cy="108" r="4.6" fill="#22262A" stroke="none"/>
      <circle cx="82" cy="108" r="4.6" fill="#22262A" stroke="none"/>
    </g>
  </svg>`;
}

/* ---- The cow illustration (one source, reused across screens) ---- */
function cowSVG() {
  return `
  <svg viewBox="0 0 320 240" class="cow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="160" cy="214" rx="118" ry="14" fill="#CFE0C0"/>
    <g stroke="#2A3A2E" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <rect x="112" y="150" width="18" height="58" rx="7" fill="#fff"/>
      <rect x="150" y="156" width="18" height="52" rx="7" fill="#fff"/>
      <rect x="196" y="156" width="18" height="52" rx="7" fill="#fff"/>
      <rect x="230" y="150" width="18" height="58" rx="7" fill="#fff"/>
      <rect x="110" y="198" width="22" height="12" rx="4" fill="#3A2E28" stroke="none"/>
      <rect x="148" y="198" width="22" height="12" rx="4" fill="#3A2E28" stroke="none"/>
      <rect x="194" y="198" width="22" height="12" rx="4" fill="#3A2E28" stroke="none"/>
      <rect x="228" y="198" width="22" height="12" rx="4" fill="#3A2E28" stroke="none"/>
      <path d="M262 112 q22 20 14 66" fill="none"/>
      <path d="M270 168 q-6 14 2 24 q10 -8 5 -24 Z" fill="#3A2E28" stroke="none"/>
      <ellipse cx="180" cy="172" rx="30" ry="20" fill="#F2B8B8"/>
      <ellipse cx="176" cy="120" rx="96" ry="60" fill="#fff"/>
      <path d="M150 96 q20 -12 34 4 q-4 22 -30 16 q-12 -10 -4 -20 Z" fill="#33291F" stroke="none"/>
      <ellipse cx="210" cy="140" rx="20" ry="15" fill="#33291F" stroke="none"/>
      <ellipse cx="70" cy="120" rx="36" ry="42" fill="#fff"/>
      <ellipse cx="52" cy="146" rx="24" ry="18" fill="#F2C9C0"/>
      <ellipse cx="44" cy="146" rx="2.8" ry="4" fill="#7A5A55" stroke="none"/>
      <ellipse cx="58" cy="146" rx="2.8" ry="4" fill="#7A5A55" stroke="none"/>
      <ellipse cx="44" cy="86" rx="12" ry="8" fill="#fff"/>
      <ellipse cx="96" cy="90" rx="12" ry="8" fill="#fff"/>
      <path d="M62 74 q-5 -16 5 -24 q5 10 2 24 Z" fill="#F0E2BE"/>
      <path d="M84 76 q5 -16 -3 -25 q-6 10 -3 25 Z" fill="#F0E2BE"/>
      <circle cx="58" cy="104" r="4.6" fill="#2A3A2E" stroke="none"/>
      <circle cx="82" cy="104" r="4.6" fill="#2A3A2E" stroke="none"/>
    </g>
  </svg>`;
}

/* =====================================================================
   SCREEN 1: WELCOME  (educational module, built from lesson data)
   ===================================================================== */
function buildWelcome(l) {
  const outcomes = l.outcomes.map(o => `<li>${o}</li>`).join("");
  const earned = state.earnedBadges.includes(l.badge.id);
  const lockIcon = `<svg width="14" height="14" viewBox="-8 -8 16 16" aria-hidden="true">`
    + `<rect x="-6" y="-1" width="12" height="10" rx="2" fill="#C9992F"/>`
    + `<path d="M-3 -1 v-3 a3 3 0 0 1 6 0 v3" fill="none" stroke="#C9992F" stroke-width="2"/></svg>`;
  const medalIcon = `<svg width="14" height="14" viewBox="-8 -8 16 16" aria-hidden="true">`
    + `<circle cx="0" cy="0" r="7" fill="#EBB84A"/>`
    + `<path d="M-3 0 l2 2.5 l4 -5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const badgeChip = `<div class="badge-chip ${earned ? "badge-chip--earned" : "badge-chip--locked"}">`
    + `${earned ? medalIcon : lockIcon} ${l.badge.name}</div>`;
  document.getElementById("screen-welcome").innerHTML = `
    <div class="welcome">
      <div class="welcome__intro">
        <p class="eyebrow">${l.subject}</p>
        <h1 class="welcome__title">${l.title}</h1>

        <div class="module">
          <p class="module__objective"><strong>Today's lesson.</strong> ${l.objective}</p>
          <p class="module__label">By the end, you'll be able to:</p>
          <ul class="module__outcomes">${outcomes}</ul>
          <div class="meta">
            <span class="meta__item">${l.difficulty}</span>
            <span class="meta__item">~${l.estMinutes} min</span>
            <span class="meta__item">${l.parts.length} structures</span>
            <span class="meta__item">${l.quiz.length} questions</span>
          </div>
        </div>

        <button class="btn btn-primary" data-goto="lesson">
          Begin lesson
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <path d="M1 6h15M11 1l5 5-5 5" stroke="#EBB84A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        ${badgeChip}
      </div>

      <div class="welcome__hero">
        ${animalSVG(l)}
        <span class="tease tease--1" aria-hidden="true"></span>
        <span class="tease tease--2" aria-hidden="true"></span>
        <span class="tease tease--3" aria-hidden="true"></span>
        <span class="hero__hint">Tap parts to explore &rarr;</span>
      </div>
    </div>`;
}

/* ---- Boot ---- */
function init() {
  load();
  lesson = window.LESSONS && window.LESSONS[state.lessonId];
  if (!lesson) {
    document.getElementById("main").innerHTML =
      '<p class="placeholder">Lesson data failed to load. Check that ' +
      'lessons/' + state.lessonId + '.js is included before app.js.</p>';
    return;
  }
  document.getElementById("streak-value").textContent = updateDailyStreak();
  rebuildAll();
  showScreen(state.screen);
}
document.addEventListener("DOMContentLoaded", init);

/* =====================================================================
   INTERACTION: ONE delegated listener for the whole app.
   Because screens are rebuilt when the lesson changes, binding clicks
   here (once) is what prevents stale/duplicate handlers.
   ===================================================================== */
document.addEventListener("click", (e) => {
  // Top bar
  if (e.target.closest("#restart-btn")) return restartLesson();

  // Summary -> switch to the other lesson
  if (e.target.closest("#next-lesson-btn"))
    return switchLesson(state.lessonId === "cow" ? "buffalo" : "cow");

  // Lesson -> Continue always starts a FRESH quiz attempt
  const cont = e.target.closest("#continue-btn");
  if (cont && !cont.disabled) return startQuiz();

  // Progressive disclosure inside a part card
  const disc = e.target.closest(".disclose");
  if (disc) return toggleDisclosure(disc);

  // Quiz answering (only before this question is locked in)
  if (!quizAnswered) {
    const opt = e.target.closest(".q-option");
    if (opt) return answerQuestion(lesson, opt.dataset.choice);
    const qhs = e.target.closest(".hotspot--quiz");
    if (qhs) return answerQuestion(lesson, qhs.dataset.choice);
  }

  // Quiz -> next question / results
  if (e.target.closest("#quiz-next")) return nextQuestion(lesson);

  // Lesson discovery hotspot (quiz hotspots are excluded, handled above)
  const hs = e.target.closest(".hotspot:not(.hotspot--quiz)");
  if (hs) return onHotspot(lesson, hs.dataset.part);

  // Generic navigation: Begin lesson, Review lesson, brand -> home
  const nav = e.target.closest("[data-goto]");
  if (nav) return showScreen(nav.dataset.goto);
});

/* Toggle a part card's clinical detail (progressive disclosure) */
function toggleDisclosure(d) {
  const detail = d.nextElementSibling;
  const opening = detail.hasAttribute("hidden");
  detail.toggleAttribute("hidden", !opening);
  d.setAttribute("aria-expanded", String(opening));
  d.textContent = opening ? "Hide clinical detail" : "Clinical detail";
}

/* Rebuild every screen from the current `lesson` */
function rebuildAll() {
  buildWelcome(lesson);
  buildLesson(lesson);
  buildQuiz(lesson);
  buildReward();
  renderStats();
}

/* Clear the current lesson's session (used by restart + switch) */
function resetLessonState() {
  // Clears the current lesson's session only. Cumulative points and the
  // rewarded set persist, so switching or restarting never wipes your
  // total, and re-doing a lesson earns no extra points.
  state.foundParts = [];
  state.quizIndex = 0;
  state.quizScore = 0;
  state.answers = [];
  state.screen = "welcome";
  quizAnswered = false;
}

/* Restart the CURRENT lesson from scratch */
function restartLesson() {
  if (!confirm("Restart this lesson? Your progress in this lesson will be reset. Your total points stay.")) return;
  resetLessonState();
  save();
  rebuildAll();
  showScreen("welcome");
}

/* Switch to ANOTHER lesson: sync lessonId + lesson, then reset + rebuild */
function switchLesson(id) {
  if (!window.LESSONS[id]) return;
  state.lessonId = id;
  lesson = window.LESSONS[id];
  resetLessonState();
  save();
  rebuildAll();
  showScreen("welcome");
}

/* Start a FRESH quiz attempt (called from Continue). Resets ONLY the
   quiz-attempt state so a previous attempt's quizIndex can't leak. */
function startQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  state.answers = [];
  quizAnswered = false;
  save();
  renderQuestion(lesson);
  showScreen("quiz");
}

/* =====================================================================
   SCREEN 2: LESSON  (tap-to-discover + progressive-disclosure cards)
   ===================================================================== */
function buildLesson(l) {
  const hotspots = l.parts.map(p => `
    <button class="hotspot" data-part="${p.id}" style="left:${p.x}%;top:${p.y}%"
            aria-label="Discover ${p.name}"></button>`).join("");

  document.getElementById("screen-lesson").innerHTML = `
    <div class="lesson">
      <div class="lesson__main">
        <div class="lesson__progress">
          <span class="lesson__progress-label">Parts discovered</span>
          <div class="bar"><div class="bar__fill" id="lesson-bar"></div></div>
          <span class="lesson__count"><span id="found-count">0</span> / ${l.parts.length}</span>
        </div>
        <div class="stage">
          <div class="stage__cow">
            ${animalSVG(l)}
            <div class="hotspots" id="hotspots">${hotspots}</div>
          </div>
          <p class="stage__hint">Tap the glowing dots to discover each part</p>
        </div>
      </div>

      <aside class="lesson__rail">
        <div class="partcard" id="partcard">
          <p class="partcard__empty">Tap a part on the cow to begin discovering.</p>
        </div>
        <div class="feed">
          <h2 class="feed__title">Recently discovered</h2>
          <ul class="feed__list" id="feed-list">
            <li class="feed__empty">Nothing yet, start tapping!</li>
          </ul>
        </div>
        <button class="btn continue" id="continue-btn" disabled>
          Discover all parts to unlock the quiz
        </button>
      </aside>
    </div>`;

  refreshLessonUI(l); // restore any previously-found parts
}

function onHotspot(l, id) {
  const part = l.parts.find(p => p.id === id);
  const already = state.foundParts.includes(id);
  let awarded = false;
  if (!already) {
    state.foundParts.push(id);
    const rkey = state.lessonId + ":part:" + id;
    if (!state.rewarded.includes(rkey)) {   // points only the first time, ever
      state.points += part.points;
      state.rewarded.push(rkey);
      addToFeed(part);
      renderStats();
      awarded = true;
    }
    save();
  }
  markFound(id, part.name);
  renderPartCard(part, awarded);
  updateLessonProgress(l);
}

function renderPartCard(part, justFound) {
  const bits = [];
  if (part.clinical) bits.push(`<p><strong>Clinical importance.</strong> ${part.clinical}</p>`);
  if (part.tip)      bits.push(`<p><strong>Observation tip.</strong> ${part.tip}</p>`);
  if (part.fact)     bits.push(`<p><strong>Did you know?</strong> ${part.fact}</p>`);
  const detail = bits.length ? `
    <button class="disclose" aria-expanded="false">Clinical detail</button>
    <div class="partcard__detail" hidden>${bits.join("")}</div>` : "";

  document.getElementById("partcard").innerHTML = `
    <p class="partcard__cat">${part.category}</p>
    <h2 class="partcard__name">${part.name}
      ${justFound ? `<span class="pts">+${part.points}</span>` : ""}</h2>
    <p class="partcard__fn">${part.function}</p>
    ${detail}`;
}

function markFound(id, name) {
  const btn = document.querySelector(`.hotspot[data-part="${id}"]`);
  if (btn) { btn.classList.add("is-found"); btn.setAttribute("aria-label", "Discovered: " + name); }
}

function addToFeed(part) {
  const list = document.getElementById("feed-list");
  const empty = list.querySelector(".feed__empty");
  if (empty) empty.remove();
  const li = document.createElement("li");
  li.innerHTML = `<span class="chk" aria-hidden="true">&#10003;</span>${part.name}
                  <span class="pts">+${part.points}</span>`;
  list.prepend(li);
}

function updateLessonProgress(l) {
  const found = state.foundParts.length, total = l.parts.length;
  document.getElementById("found-count").textContent = found;
  document.getElementById("lesson-bar").style.width = (found / total * 100) + "%";
  const cont = document.getElementById("continue-btn");
  if (found === total) {
    cont.disabled = false;
    cont.innerHTML = 'Continue to quiz &rarr;';
  }
}

function refreshLessonUI(l) {
  state.foundParts.forEach(id => {
    const part = l.parts.find(p => p.id === id);
    if (part) { markFound(id, part.name); addToFeed(part); }
  });
  updateLessonProgress(l);
}

/* =====================================================================
   SCREEN 3: QUIZ  (Bloom's-tagged, MCQ + tap-on-cow, instant feedback)
   Scoring is weighted by difficulty. Every answer is recorded into
   state.answers (with category + Bloom) to power the Learning Summary.
   No lives. Wrong answers still proceed and teach through feedback.
   Colour is never the only signal (icon + text too), a WCAG habit.
   ===================================================================== */
function buildQuiz(l) {
  document.getElementById("screen-quiz").innerHTML = `<div id="quiz-root"></div>`;
  renderQuestion(l);
}

function renderQuestion(l) {
  quizAnswered = false;
  const i = state.quizIndex;
  const q = l.quiz[i];
  const last = i === l.quiz.length - 1;

  // Dots always come from the CURRENT lesson (data-driven count)
  const dots = l.quiz.map((qq, idx) => {
    let cls = "dot";
    if (idx < i) cls += (state.answers[idx] && state.answers[idx].correct) ? " dot--right" : " dot--wrong";
    else if (idx === i) cls += " dot--current";
    return `<span class="${cls}"></span>`;
  }).join("");

  let body;
  if (q.type === "mcq") {
    body = `<div class="q-options">
      ${q.options.map(o => `<button class="q-option" data-choice="${o}">${o}</button>`).join("")}
    </div>`;
  } else { // tap
    const spots = l.parts.map(p =>
      `<button class="hotspot hotspot--quiz" data-choice="${p.id}"
               style="left:${p.x}%;top:${p.y}%" aria-label="${p.name}"></button>`).join("");
    body = `<p class="q-taphint">Tap the answer on the cow</p>
      <div class="stage stage--quiz"><div class="stage__cow">${animalSVG(l)}
        <div class="hotspots">${spots}</div></div></div>`;
  }

  document.getElementById("quiz-root").innerHTML = `
    <div class="quiz">
      <div class="quiz__head">
        <span class="quiz__count">Question ${i + 1} <span class="muted">of ${l.quiz.length}</span></span>
        <span class="quiz__dots">${dots}</span>
      </div>
      <div class="quiz__card">
        <span class="q-meta">${q.bloom} &middot; +${q.points} pts</span>
        <h2 class="q-prompt">${q.prompt}</h2>
        ${body}
        <div class="q-feedback" id="quiz-feedback" hidden></div>
        <div class="quiz__foot">
          <button class="btn btn-primary" id="quiz-next" disabled>
            ${last ? "See results" : "Next question"}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <path d="M1 6h15M11 1l5 5-5 5" stroke="#EBB84A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}

function answerQuestion(l, choice) {
  quizAnswered = true;
  const q = l.quiz[state.quizIndex];
  const correct = q.type === "mcq" ? (choice === q.answer) : (choice === q.target);

  state.answers[state.quizIndex] = { id: q.id, correct, category: q.category, bloom: q.bloom };
  if (correct) {
    state.quizScore += 1;                       // per-attempt score (for the summary)
    const rkey = state.lessonId + ":quiz:" + q.id;
    if (!state.rewarded.includes(rkey)) {       // points only the first time, ever
      state.points += q.points;
      state.rewarded.push(rkey);
    }
  }
  renderStats(); save();

  // reflect the answer on screen (icon + colour, never colour alone)
  if (q.type === "mcq") {
    document.querySelectorAll(".q-option").forEach(b => {
      b.disabled = true;
      if (b.dataset.choice === q.answer) b.classList.add("is-correct");
      else if (b.dataset.choice === choice) b.classList.add("is-chosen-wrong");
    });
  } else {
    document.querySelectorAll(".hotspot--quiz").forEach(b => b.disabled = true);
    const tapped = document.querySelector(`.hotspot--quiz[data-choice="${choice}"]`);
    const target = document.querySelector(`.hotspot--quiz[data-choice="${q.target}"]`);
    if (correct) { if (tapped) tapped.classList.add("is-correct"); }
    else { if (tapped) tapped.classList.add("is-chosen-wrong"); if (target) target.classList.add("is-correct"); }
  }

  const fb = document.getElementById("quiz-feedback");
  fb.className = "q-feedback " + (correct ? "is-right" : "is-wrong");
  fb.hidden = false;
  fb.innerHTML = `<span class="q-feedback__icon" aria-hidden="true">${correct ? "&#10003;" : "!"}</span>
    <span>${correct ? "Correct!" : "Not quite."} ${q.explain}</span>`;

  document.getElementById("quiz-next").disabled = false;   // wrong answers still proceed
}

function nextQuestion(l) {
  if (state.quizIndex < l.quiz.length - 1) {
    state.quizIndex += 1;
    save();
    renderQuestion(l);
  } else {
    if (!state.earnedBadges.includes(lesson.badge.id)) state.earnedBadges.push(lesson.badge.id);
    save();
    buildReward();
    buildWelcome(lesson);   // welcome chip now shows the earned medal
    showScreen("reward");
  }
}

/* =====================================================================
   SCREEN 4: LEARNING SUMMARY  (analytics, not "game over")
   Reads the tracked data (foundParts + answers) to show score, points,
   and per-category mastery (mastered vs needs revision). No XP/levels.
   ===================================================================== */
function quizMasteryByCategory() {
  const m = {};
  state.answers.forEach(a => {
    if (!a) return;
    m[a.category] = m[a.category] || { correct: 0, total: 0 };
    m[a.category].total++;
    if (a.correct) m[a.category].correct++;
  });
  return m;
}

function badgeMedalSVG() {
  return `<svg viewBox="0 0 96 96" aria-hidden="true">
    <circle cx="48" cy="48" r="46" fill="#F3D488"/>
    <circle cx="48" cy="48" r="38" fill="#FBF6E7"/>
    <g transform="translate(48,46) scale(0.82)" stroke="#2A3A2E" stroke-width="3" stroke-linejoin="round">
      <ellipse cx="0" cy="2" rx="18" ry="22" fill="#fff"/>
      <ellipse cx="-8" cy="15" rx="12" ry="9" fill="#F2C9C0"/>
      <ellipse cx="-16" cy="-14" rx="6" ry="4" fill="#fff"/>
      <ellipse cx="14" cy="-12" rx="6" ry="4" fill="#fff"/>
      <circle cx="-4" cy="-6" r="2.4" fill="#2A3A2E" stroke="none"/>
    </g>
  </svg>`;
}

function buildReward() {
  const total = lesson.quiz.length;
  const ratio = total ? state.quizScore / total : 0;
  const reflection = ratio >= 0.8
    ? "Excellent, a strong grasp of external anatomy. You're ready to progress."
    : ratio >= 0.5
      ? "Good work. Review the areas flagged below, then move on."
      : "A solid start. Revisit the areas below before progressing.";

  const mastery = quizMasteryByCategory();
  const mastered = [], review = [];
  Object.keys(mastery).forEach(cat => {
    const c = mastery[cat];
    const item = `<li><span class="mk"></span>${cat}<span class="score">${c.correct}/${c.total}</span></li>`;
    (c.correct / c.total >= 0.7 ? mastered : review).push(item);
  });

  const mins = Math.max(1, Math.round((Date.now() - sessionStart) / 60000));

  const nextId = state.lessonId === "cow" ? "buffalo" : "cow";
  const next = window.LESSONS[nextId];
  const nextCard = next ? `
    <div class="nextcard">
      <div>
        <p class="nextcard__label">Recommended next</p>
        <p class="nextcard__title">${next.title}</p>
      </div>
      <button class="btn btn-primary" id="next-lesson-btn">Start &rarr;</button>
    </div>` : "";

  document.getElementById("screen-reward").innerHTML = `
    <div class="summary">
      <header class="summary__head">
        <div class="badge-medal">${badgeMedalSVG()}</div>
        <div>
          <p class="eyebrow">Lesson complete · badge earned</p>
          <h1 class="summary__title">${lesson.badge.name}</h1>
          <p class="summary__reflect">${reflection}</p>
        </div>
      </header>

      <div class="summary__tiles">
        <div class="tile"><span class="tile__num">${state.quizScore}/${total}</span><span class="tile__lbl">Quiz score</span></div>
        <div class="tile"><span class="tile__num">${state.foundParts.length}/${lesson.parts.length}</span><span class="tile__lbl">Parts explored</span></div>
        <div class="tile"><span class="tile__num">${state.points}</span><span class="tile__lbl">Total points</span></div>
        <div class="tile"><span class="tile__num">${mins}</span><span class="tile__lbl">Minutes</span></div>
      </div>

      <div class="summary__mastery">
        <div class="mastery mastery--good">
          <h2>Areas mastered</h2>
          <ul>${mastered.join("") || '<li class="mastery__empty">Keep practising to master a category.</li>'}</ul>
        </div>
        <div class="mastery mastery--review">
          <h2>Needs revision</h2>
          <ul>${review.join("") || '<li class="mastery__empty">Nothing flagged, great work!</li>'}</ul>
        </div>
      </div>

      <div class="summary__foot">
        ${nextCard}
        <button class="btn summary__review" data-goto="lesson">Review lesson</button>
      </div>
    </div>`;
}
