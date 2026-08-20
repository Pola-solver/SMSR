// ─── CONFIG ────────────────────────────────────────────────────────────────
// Google Apps Script Web App URL:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgrzzgc99BnBvq2zjot1f2-ZDWIrY_F2rXX3oZ9nMFuA68-cTujagRWYqfxupHVBmy/exec";
// ───────────────────────────────────────────────────────────────────────────
// ─── INTRO ANIMATION & TAP-TO-SKIP ─────────────────────────────────────────
function dismissIntro() {
  const intro = document.getElementById("intro");
  const mainPage = document.getElementById("main-page");
  if (intro && intro.style.display !== "none") {
    intro.style.opacity = "0";
    intro.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      intro.style.display = "none";
      intro.setAttribute("aria-hidden", "true");
    }, 400);
  }
  if (mainPage) {
    mainPage.style.opacity = "1";
    mainPage.style.transform = "translateY(0)";
  }
}
// Auto dismiss intro after 3.2 seconds
setTimeout(dismissIntro, 3200);
// Allow user to tap/click anywhere to skip intro immediately
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  if (intro) {
    intro.addEventListener("click", dismissIntro);
    intro.addEventListener("touchstart", dismissIntro, { passive: true });
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
