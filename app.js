/* =====================================================================
   GAASH — APP LOGIC
   Data-driven: the lesson comes from lessons/<id>.js (registered into
   window.LESSONS). Every screen is built from that data, so swapping
   cow -> buffalo -> goat is just a different file.

   One `state` object is the single source of truth. Every action
   updates state; state updates the screen; state is saved to
   localStorage so progress survives a refresh (the "tracking" layer).
   ===================================================================== */

const STORAGE_KEY = "gaash-progress";
let lesson = null;

/* ---- Single source of truth ---- */
const state = {
  lessonId: "cow",
  screen: "welcome",
  foundParts: [],
  points: 0,
  streak: 0,
  quizIndex: 0,
  quizScore: 0,
  answers: []            // Stores each quiz response. Used to calculate the learning summary, category mastery, 
                         // and future analytics.
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

/* ---- Reflect points + streak in the top bar ---- */
function renderStats() {
  document.getElementById("points-value").textContent = state.points;
  document.getElementById("streak-value").textContent = state.streak;
}

/* ---- Category mastery: tiny helper the summary screen uses ---- */
function categoryMastery() {
  const totals = {};
  lesson.parts.forEach(p => {
    totals[p.category] = totals[p.category] || { found: 0, total: 0 };
    totals[p.category].total++;
    if (state.foundParts.includes(p.id)) totals[p.category].found++;
  });
  return totals;
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
      <circle cx="60" cy="106" r="4.5" fill="#2A3A2E" stroke="none"/>
    </g>
  </svg>`;
}

/* =====================================================================
   SCREEN 1 — WELCOME  (built as an educational module from lesson data)
   ===================================================================== */
function buildWelcome(l) {
  const outcomes = l.outcomes.map(o => `<li>${o}</li>`).join("");
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

        <div class="badge-chip badge-chip--locked">
          <svg width="14" height="14" viewBox="-8 -8 16 16" aria-hidden="true">
            <rect x="-6" y="-1" width="12" height="10" rx="2" fill="#C9992F"/>
            <path d="M-3 -1 v-3 a3 3 0 0 1 6 0 v3" fill="none" stroke="#C9992F" stroke-width="2"/>
          </svg>
          ${l.badge.name} — Locked
        </div>
      </div>

      <div class="welcome__hero">
        ${cowSVG()}
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

  renderStats();
  buildWelcome(lesson);
  buildLesson(lesson);
  buildQuiz(lesson);
  buildReward();
  showScreen(state.screen);
}

/* Navigation via data-goto attributes, e.g. <button data-goto="lesson"> */
document.addEventListener("click", (e) => {
  if (e.target.closest("#restart-btn")) return restartLesson();
  const trigger = e.target.closest("[data-goto]");
  if (trigger) showScreen(trigger.dataset.goto);
});

/* Reset the current lesson to a clean state (handy for repeat demos) */
function restartLesson() {
  if (!confirm("Restart this lesson? Your points and progress will be cleared.")) return;
  state.foundParts = []; state.points = 0; state.streak = 0;
  state.quizIndex = 0; state.quizScore = 0; state.answers = [];
  state.screen = "welcome";
  quizStreak = 0;
  save();
  buildWelcome(lesson); buildLesson(lesson); buildQuiz(lesson); buildReward();
  renderStats();
  showScreen("welcome");
}

document.addEventListener("DOMContentLoaded", init);

/* =====================================================================
   SCREEN 2 — LESSON  (tap-to-discover + progressive-disclosure cards)
   Hotspots are real <button>s positioned by % over the cow, so they're
   keyboard-accessible. Each part's clinical detail is hidden until the
   learner asks for it (progressive disclosure).
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
            ${cowSVG()}
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
            <li class="feed__empty">Nothing yet — start tapping!</li>
          </ul>
        </div>
        <button class="btn continue" id="continue-btn" data-goto="quiz" disabled>
          Discover all parts to unlock the quiz
        </button>
      </aside>
    </div>`;

  // hotspot clicks
  document.getElementById("hotspots").addEventListener("click", (e) => {
    const btn = e.target.closest(".hotspot");
    if (btn) onHotspot(l, btn.dataset.part);
  });

  // progressive-disclosure toggle (delegated, survives re-renders)
  document.getElementById("partcard").addEventListener("click", (e) => {
    const d = e.target.closest(".disclose");
    if (!d) return;
    const detail = d.nextElementSibling;
    const opening = detail.hasAttribute("hidden");
    detail.toggleAttribute("hidden", !opening);
    d.setAttribute("aria-expanded", String(opening));
    d.textContent = opening ? "Hide clinical detail" : "Clinical detail";
  });

  refreshLessonUI(l); // restore any previously-found parts
}

function onHotspot(l, id) {
  const part = l.parts.find(p => p.id === id);
  const already = state.foundParts.includes(id);
  if (!already) {
    state.foundParts.push(id);
    state.points += part.points;
    state.streak += 1;
    addToFeed(part);
    renderStats();
    save();
  }
  markFound(id, part.name);
  renderPartCard(part, !already);
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
   SCREEN 3 — QUIZ  (Bloom's-tagged, MCQ + tap-on-cow, instant feedback)
   Scoring is weighted by difficulty. We record every answer (with its
   category + Bloom level) into state.answers, which powers the
   Learning Summary on Screen 4. No lives — wrong answers just teach.
   Colour is never the only signal (icon + text too) — a WCAG habit.
   ===================================================================== */
let quizAnswered = false;
let quizStreak = 0;

function buildQuiz(l) {
  document.getElementById("screen-quiz").innerHTML = `<div id="quiz-root"></div>`;

  const root = document.getElementById("screen-quiz");
  root.addEventListener("click", (e) => {
    const opt = e.target.closest(".q-option");
    if (opt && !quizAnswered) return answerQuestion(l, opt.dataset.choice);
    const hs = e.target.closest(".hotspot--quiz");
    if (hs && !quizAnswered) return answerQuestion(l, hs.dataset.choice);
    if (e.target.closest("#quiz-next")) return nextQuestion(l);
  });

  renderQuestion(l);
}

function renderQuestion(l) {
  quizAnswered = false;
  const i = state.quizIndex;
  const q = l.quiz[i];
  const last = i === l.quiz.length - 1;

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
      <div class="stage stage--quiz"><div class="stage__cow">${cowSVG()}
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
          <span class="q-streak" id="quiz-streak">${quizStreak} in a row</span>
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
  if (correct) { state.points += q.points; state.quizScore += 1; quizStreak += 1; }
  else { quizStreak = 0; }
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

  document.getElementById("quiz-streak").textContent = quizStreak + " in a row";
  document.getElementById("quiz-next").disabled = false;
}

function nextQuestion(l) {
  if (state.quizIndex < l.quiz.length - 1) {
    state.quizIndex += 1; save();
    renderQuestion(l);
  } else {
    if (typeof buildReward === "function") buildReward();
    showScreen("reward");
  }
}

/* =====================================================================
   SCREEN 4 — LEARNING SUMMARY  (analytics, not "game over")
   Reads the data we tracked (foundParts + answers) to show score,
   per-category mastery (mastered vs needs revision), level/XP, and a
   recommended next lesson. This is the screen that speaks the
   interviewer's language: learning analytics.
   ===================================================================== */
const sessionStart = Date.now();
const XP_PER_LEVEL = 300;
const LEVEL_NAMES = ["Newcomer", "Curious Calf", "Keen Heifer", "Field Scholar", "Herd Expert"];

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
    ? "Excellent — a strong grasp of external anatomy. You're ready to progress."
    : ratio >= 0.5
      ? "Good work. Review the areas flagged below, then move on."
      : "A solid start — revisit the areas below before progressing.";

  const mastery = quizMasteryByCategory();
  const mastered = [], review = [];
  Object.keys(mastery).forEach(cat => {
    const c = mastery[cat];
    const item = `<li><span class="mk"></span>${cat}<span class="score">${c.correct}/${c.total}</span></li>`;
    (c.correct / c.total >= 0.7 ? mastered : review).push(item);
  });

  const level = Math.floor(state.points / XP_PER_LEVEL) + 1;
  const xpIn = state.points % XP_PER_LEVEL;
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
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
          <ul>${review.join("") || '<li class="mastery__empty">Nothing flagged — great work!</li>'}</ul>
        </div>
      </div>

      <div class="summary__level">
        <div class="summary__level-head">
          <span>Level ${level} · ${levelName}</span>
          <span>${xpIn} / ${XP_PER_LEVEL} XP</span>
        </div>
        <div class="bar"><div class="bar__fill" style="width:${xpIn / XP_PER_LEVEL * 100}%"></div></div>
      </div>

      <div class="summary__foot">
        ${nextCard}
        <button class="btn summary__review" data-goto="lesson">Review lesson</button>
      </div>
    </div>`;

  const nb = document.getElementById("next-lesson-btn");
  if (nb) nb.addEventListener("click", () => switchLesson(nextId));
}

/* Switch to another lesson: same code, different data file (scalability) */
function switchLesson(id) {
  state.lessonId = id;
  state.foundParts = []; state.quizIndex = 0; state.quizScore = 0;
  state.answers = []; state.screen = "welcome";
  quizStreak = 0;
  lesson = window.LESSONS[id];
  save();
  buildWelcome(lesson); buildLesson(lesson); buildQuiz(lesson); buildReward();
  renderStats();
  showScreen("welcome");
}
