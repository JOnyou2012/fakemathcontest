"use strict";

const icons = {
  menu: '<path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h12v2H2z"/>',
  course: '<path d="M0 5 8 2l8 3-8 3-6-2.25V10l-1 2H0l1-2V5.4zm3 2.2L8 9l5-1.8V11c-2.4 2-7.6 2-10 0z"/>',
  globe: '<path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM4.2 3.7l2.4.5.7 1.5-1.3 1.1.7 1.3-1.2 1.5-1.3-.7L3 6.7A5 5 0 0 1 4.2 3.7Zm3.6 9.4.4-2.2 1.6-.8 1.4.7.1 1.2a5 5 0 0 1-3.5 1.1ZM12 4.5a5 5 0 0 1 1 4.1l-2.1-.9-1.6-2.3.6-1.4z"/>',
  bell: '<path d="M8 1a1 1 0 0 1 1 1v.35C11.4 2.8 12 4.6 12 7v2.1l2 2.4v.7H2v-.7l2-2.4V7c0-2.4.6-4.2 3-4.65V2a1 1 0 0 1 1-1Zm-2 12h4a2 2 0 0 1-4 0Z"/>',
  avatar: '<circle cx="8" cy="8" r="8" fill="#e5e5e5"/><circle cx="8" cy="6" r="3.25" fill="white"/><path d="M2 13.3c1.3-3 3.1-4.2 6-4.2s4.7 1.2 6 4.2a8 8 0 0 1-12 0Z" fill="white"/>',
  users: '<circle cx="8" cy="5" r="2.5"/><circle cx="2.8" cy="4.4" r="2"/><circle cx="13.2" cy="4.4" r="2"/><path d="M3.4 13v-2.6c0-3.3 9.2-3.3 9.2 0V13c0 1.1-9.2 1.1-9.2 0ZM0 10V8c0-1.7 3.3-2.2 4.4-.9-1.8.9-2 2-2 4C1 11.1 0 10.8 0 10Zm16 0V8c0-1.7-3.3-2.2-4.4-.9 1.8.9 2 2 2 4 1.4 0 2.4-.3 2.4-1.1Z"/>',
  pencil: '<path d="m1 11.5 8.9-8.9 3.5 3.5-8.9 8.9H1zm9.8-9.8L12.1.4a1 1 0 0 1 1.4 0l2.1 2.1a1 1 0 0 1 0 1.4l-1.3 1.3z"/>',
  table: '<path fill-rule="evenodd" d="M1 2h14v12H1Zm1.4 3v2h3V5zm4.1 0v2h3V5zm4.1 0v2h3V5zm-8.2 3.2v1.7h3V8.2zm4.1 0v1.7h3V8.2zm4.1 0v1.7h3V8.2zm-8.2 2.9v1.6h3v-1.6zm4.1 0v1.6h3v-1.6zm4.1 0v1.6h3v-1.6z"/>',
  dashboard: '<path fill-rule="evenodd" d="M1 12a7 7 0 1 1 14 0v2H1Zm3-1.7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1.1-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm2.9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3.2 1.4-.8-.4-2 3.3a1.3 1.3 0 1 0 1 1.2z"/>',
  home: '<path d="M0 7.7 8 1l8 6.7-1 1.2-1.4-1.1V14H9.5v-4h-3v4H2.4V7.8L1 8.9z"/>',
  calendar: '<path fill-rule="evenodd" d="M4 0h1v2h6V0h1v2h2.5v13h-13V2H4Zm-1 6v7.6h10V6Zm1 1.4h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm-6 3h2v2H4zm3 0h2v2H7zm3 0h2v2h-2z"/>',
  flag: '<path d="M2 1v14h1V9c3-2 6 2 10 0V2c-4 2-7-2-11-1Zm1 1.2c3-1 5.7 1.8 9 1.1v4.9C8.7 8.8 6 6 3 7.9Z"/>',
};

const storageKey = "amc10a-2025-practice-v1";
const duration = 75 * 60 * 1000;
const letters = ["A", "B", "C", "D", "E"];
const languageLabels = {all: "English (en)", en: "English (en)", hk: "繁體中文", cn: "简体中文"};
const deadlineFormat = new Intl.DateTimeFormat("en-HK", {
  timeZone: "Asia/Hong_Kong", weekday: "long", day: "numeric", month: "long", year: "numeric",
  hour: "numeric", minute: "2-digit", hour12: true,
});

const find = (selector) => document.querySelector(selector);
const sections = Array.from(document.querySelectorAll(".quiz-panel > section"));
const dialog = find("#confirmation");
const toggle = find(".drawer-toggle");
const compactDrawer = matchMedia("(max-width: 960px)");

function newAttempt() {
  return {deadline: Date.now() + duration, answers: {}, flags: {}, finished: null};
}

function readAttempt() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Number.isFinite(saved.deadline) && saved.answers && saved.flags) return saved;
  } catch {
    // A local file or restricted browser may provide only in-memory storage.
  }
  return null;
}

let attempt = readAttempt() ?? newAttempt();
let language = "all";
let view = "";
let pendingAction = "";
let returnScroll = 0;

function persistAttempt() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(attempt));
  } catch {
    // The current attempt can still run in memory.
  }
}

function icon(name) {
  return `<svg class="icon ${name}-icon" viewBox="0 0 16 16" aria-hidden="true">${icons[name]}</svg>`;
}

function card(question, index) {
  const number = index + 1;
  return `<article class="question" id="question-${number}" tabindex="-1" aria-labelledby="label-${number}">
    <aside class="question-info">
      <h2 id="label-${number}">Question <strong>${number}</strong></h2>
      <p class="question-status"></p>
      <p>Marked out of 6.00</p>
      <button type="button" class="flag-button" data-action="flag" data-question="${number}" aria-pressed="false"
        aria-label="Flag question ${number}">${icon("flag")} <span>Flag question</span></button>
    </aside>
    <div class="question-body">
      <div class="prompt" lang="en" data-prompt="en">${question.en}</div>
      <div class="prompt" lang="zh-Hant-HK" data-prompt="hk">${question.hk}</div>
      <div class="prompt" lang="zh-Hans" data-prompt="cn">${question.cn}</div>
      ${question.equation ?? ""}
      ${diagrams[number] ? `<figure class="diagram">${diagrams[number]}</figure>` : ""}
      <fieldset class="responses" aria-describedby="label-${number}">
        <legend>Select one: [<button type="button" class="link-button" data-action="deselect" data-question="${number}"
          aria-label="Deselect answer for question ${number}">Deselect</button>]</legend>
        ${question.choices.map((choice, position) => {
          const letter = letters[position];
          const id = `answer-${number}-${letter}`;
          return `<div class="response"><input type="radio" id="${id}" name="q${number}" data-question="${number}" value="${letter}">
            <label for="${id}">${letter}. <span class="choice">${typeof choice === "string" ? choice : choice.en}</span></label></div>`;
        }).join("")}
      </fieldset>
    </div>
  </article>`;
}

document.querySelectorAll("[data-icon]").forEach((element) => {
  element.innerHTML = icon(element.dataset.icon);
});
find("#questions").innerHTML = QUESTIONS.map(card).join("");
find("#question-grid").innerHTML = QUESTIONS.map((_, index) =>
  `<a class="question-cell" href="#question-${index + 1}">${index + 1}</a>`).join("");
find("#summary-rows").innerHTML = QUESTIONS.map((_, index) =>
  `<tr><td><a href="#question-${index + 1}">${index + 1}</a></td><td></td></tr>`).join("");
find("#jump-to").insertAdjacentHTML("beforeend", QUESTIONS.map((_, index) =>
  `<option value="#question-${index + 1}">Question ${index + 1}</option>`).join(""));

const cards = Array.from(document.querySelectorAll(".question"), (element) => ({
  status: element.querySelector(".question-status"),
  flag: element.querySelector(".flag-button"),
  responses: element.querySelector(".responses"),
  inputs: Array.from(element.querySelectorAll("input")),
  choices: Array.from(element.querySelectorAll(".choice")),
}));
const cells = Array.from(find("#question-grid").children);
const statuses = Array.from(document.querySelectorAll("#summary-rows td:nth-child(2)"));
const clocks = document.querySelectorAll("[data-time]");

function updateAttemptUI() {
  cards.forEach(({status, flag, responses, inputs}, index) => {
    const number = index + 1;
    const answer = attempt.answers[number];
    const flagged = Boolean(attempt.flags[number]);
    const label = answer ? "Answer saved" : "Not yet answered";
    status.textContent = label;
    flag.setAttribute("aria-pressed", String(flagged));
    flag.setAttribute("aria-label", `${flagged ? "Unflag" : "Flag"} question ${number}`);
    flag.querySelector("span").textContent = flagged ? "Remove flag" : "Flag question";
    flag.disabled = Boolean(attempt.finished);
    responses.disabled = Boolean(attempt.finished);
    inputs.forEach((input) => { input.checked = input.value === answer; });
    cells[index].classList.toggle("answered", Boolean(answer));
    cells[index].classList.toggle("flagged", flagged);
    cells[index].setAttribute("aria-label", `Question ${number}, ${label.toLowerCase()}${flagged ? ", flagged" : ""}`);
    statuses[index].textContent = flagged ? `${label} · Flagged` : label;
  });
  find("#submission-deadline").textContent = `This attempt must be submitted by ${deadlineFormat.format(attempt.deadline)}.`;
  find(".save-attempt").hidden = Boolean(attempt.finished);
  find(".nav-save").hidden = Boolean(attempt.finished);
  find(".nav-time").hidden = Boolean(attempt.finished);
  if (view === "results") showResults();
}

function showResults() {
  let total = 0;
  const rows = QUESTIONS.map(({answer}, index) => {
    const number = index + 1;
    const selected = attempt.answers[number];
    const points = selected === answer ? 6 : selected ? 0 : 1.5;
    total += points;
    return `<tr><td><a href="#question-${number}">${number}</a></td><td>${letters.includes(selected) ? selected : "—"}</td>
      <td>${answer}</td><td>${points}</td></tr>`;
  });
  find("#results-table").hidden = !attempt.finished;
  find("#results-message").textContent = attempt.finished
    ? `${attempt.finished === "expired" ? "Time expired. " : ""}Score ${total} out of 150.`
    : "Your score will appear here after you submit the attempt.";
  find("#results-rows").innerHTML = attempt.finished ? rows.join("") : "";
}

function renderRoute(scroll = true) {
  const hash = location.hash.slice(1);
  if (hash === "quiz-content") return;
  const question = /^question-(\d+)$/.exec(hash);
  const questionTarget = question && document.getElementById(hash);
  const next = ["summary", "notice", "results"].includes(hash) ? hash : "attempt";
  if (next === "summary" && attempt.finished) {
    location.replace("#results");
    return;
  }
  if (next === "attempt" && attempt.finished && !questionTarget) {
    location.replace("#results");
    return;
  }
  sections.forEach((section) => { section.hidden = section.id !== next; });
  document.body.classList.toggle("summary-view", next === "summary");
  document.body.classList.toggle("results-view", next === "results");
  const crumb = find("#crumb-current");
  crumb.hidden = next === "attempt";
  crumb.textContent = {summary: "Summary of attempt", notice: "Notice", results: "Practice results"}[next] ?? "";
  document.title = `2025 AMC10A ENG&CHN${crumb.hidden ? "" : `: ${crumb.textContent}`} | Unofficial mock`;
  cells.forEach((cell, index) => {
    if (question && index + 1 === Number(question[1])) cell.setAttribute("aria-current", "location");
    else cell.removeAttribute("aria-current");
  });
  const previousView = view;
  view = next;
  if (next === "results") showResults();
  if (questionTarget) {
    questionTarget.scrollIntoView();
    if (scroll) questionTarget.focus({preventScroll: true});
  } else if (scroll) {
    window.scrollTo(0, next === "attempt" && previousView === "summary" ? returnScroll : 0);
    find("#quiz-content").focus({preventScroll: true});
  }
}

function updateClock() {
  const seconds = Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000));
  const pad = (value) => String(value).padStart(2, "0");
  const time = `${Math.floor(seconds / 3600)}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
  clocks.forEach((clock) => { if (clock.textContent !== time) clock.textContent = time; });
  if (seconds === 0 && !attempt.finished) finishAttempt("expired");
}

function finishAttempt(reason) {
  attempt = readAttempt() ?? attempt;
  if (!attempt.finished && (reason !== "expired" || Date.now() >= attempt.deadline)) {
    attempt.finished = Date.now() >= attempt.deadline ? "expired" : reason;
    persistAttempt();
  }
  if (!attempt.finished) return;
  if (dialog.open) dialog.close("cancel");
  updateAttemptUI();
  if (location.hash === "#results") renderRoute();
  else location.hash = "results";
}

function editAttempt(field, number, value) {
  attempt = readAttempt() ?? attempt;
  if (attempt.finished || Date.now() >= attempt.deadline) {
    finishAttempt("expired");
    return;
  }
  if (value) attempt[field][number] = value;
  else delete attempt[field][number];
  persistAttempt();
  updateAttemptUI();
}

function setLanguage(selection) {
  language = selection;
  find("#language-label").textContent = languageLabels[language];
  document.querySelectorAll("[data-prompt]").forEach((element) => {
    element.hidden = language !== "all" && language !== element.dataset.prompt;
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  cards.forEach(({choices}, index) => choices.forEach((element, position) => {
    const choice = QUESTIONS[index].choices[position];
    if (typeof choice !== "string") element.textContent = choice[language === "all" ? "en" : language];
  }));
}

function setDrawer(open) {
  document.body.classList.toggle("drawer-closed", !open);
  toggle.setAttribute("aria-expanded", String(open));
}

function confirmAction(action) {
  pendingAction = action;
  const reset = action === "reset";
  find("#dialog-title").textContent = reset ? "Start a new attempt" : "Confirmation";
  find("#dialog-message").textContent = reset
    ? "This will clear the current attempt and start a new 75-minute timer."
    : "Once you submit, your answers will be locked and your practice score will be shown.";
  find("#dialog-confirm").textContent = reset ? "Start a new attempt" : "Submit all and finish";
  dialog.returnValue = "cancel";
  dialog.showModal();
}

toggle.addEventListener("click", () => setDrawer(toggle.getAttribute("aria-expanded") !== "true"));
compactDrawer.addEventListener("change", () => setDrawer(!compactDrawer.matches));
find("#jump-to").addEventListener("change", (event) => {
  if (event.target.value) location.hash = event.target.value;
  event.target.value = "";
});
find("#questions").addEventListener("submit", (event) => event.preventDefault());
find("#questions").addEventListener("change", (event) => {
  const {question} = event.target.dataset;
  if (!question) return;
  editAttempt("answers", question, event.target.value);
  find("#announcement").textContent = `Answer saved for question ${question}.`;
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button, summary");
  document.querySelectorAll(".top-menu[open]").forEach((menu) => {
    if (!menu.contains(event.target) || target?.matches(".dropdown a, .dropdown button")) menu.open = false;
  });
  if (!target) return;
  if (target.getAttribute("href") === "#summary" && view === "attempt") returnScroll = window.scrollY;
  if (compactDrawer.matches && target.closest("#drawer a")) setDrawer(false);
  if (target.dataset.language) setLanguage(target.dataset.language);
  const {action, question} = target.dataset;
  if (action === "flag") editAttempt("flags", question, !(readAttempt() ?? attempt).flags[question]);
  if (action === "deselect") {
    editAttempt("answers", question, null);
    find("#announcement").textContent = `Answer cleared for question ${question}.`;
  }
  if (action === "submit" || action === "reset") confirmAction(action);
});

dialog.addEventListener("close", () => {
  if (dialog.returnValue !== "confirm") return;
  if (pendingAction === "submit") {
    finishAttempt("submitted");
  } else {
    attempt = newAttempt();
    persistAttempt();
    returnScroll = 0;
    updateAttemptUI();
    updateClock();
    if (location.hash === "#attempt") renderRoute();
    else location.hash = "attempt";
  }
});

window.addEventListener("hashchange", () => renderRoute());
window.addEventListener("storage", (event) => {
  if (event.key !== storageKey) return;
  const saved = readAttempt();
  if (!saved) return;
  const newlyFinished = saved.finished && !attempt.finished;
  attempt = saved;
  updateAttemptUI();
  if (newlyFinished) finishAttempt(saved.finished);
  updateClock();
});

persistAttempt();
setDrawer(!compactDrawer.matches);
setLanguage(language);
updateAttemptUI();
renderRoute(false);
updateClock();
setInterval(updateClock, 250);
