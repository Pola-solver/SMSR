
// ─── CONFIG ────────────────────────────────────────────────────────────────
// Google Apps Script Web App URL:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgrzzgc99BnBvq2zjot1f2-ZDWIrY_F2rXX3oZ9nMFuA68-cTujagRWYqfxupHVBmy/exec";
// ───────────────────────────────────────────────────────────────────────────
const INTRO_DURATION = 5000;
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  if (intro) {
    setTimeout(() => {
      intro.setAttribute("aria-hidden", "true");
      intro.style.display = "none";
    }, INTRO_DURATION);
  }
});
// ─── FORM & MODAL CONTROLS ──────────────────────────────────────────────────
const form           = document.getElementById("response-form");
const submitBtn      = document.getElementById("submit-btn") || form.querySelector("button[type='submit']");
const teamInput      = document.getElementById("team");
const teamError      = document.getElementById("team-error");
const teamBtns       = document.querySelectorAll(".team-btn");
const successModal   = document.getElementById("success-modal");
const closeModalBtn  = document.getElementById("close-modal-btn");
// Team button toggle
teamBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    teamBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    teamInput.value = btn.dataset.team;
    teamError.hidden = true;
  });
});
// Modal Open / Close helpers
function openModal() {
  if (successModal) {
    successModal.hidden = false;
  }
