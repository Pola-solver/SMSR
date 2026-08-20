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
    // small delay so transition is visible
    requestAnimationFrame(() => {
      mainPage.style.opacity = "1";
      mainPage.style.transform = "translateY(0)";
    });
  }
}

// Auto dismiss intro after 2.6 seconds
setTimeout(dismissIntro, 2600);

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
}

function closeModal() {
  if (successModal) {
    successModal.hidden = true;
  }
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

if (successModal) {
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && successModal && !successModal.hidden) {
    closeModal();
  }
});

// ─── FORM SUBMIT HANDLER ────────────────────────────────────────────────────
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const nameInput = document.getElementById("name");
  const msgInput  = document.getElementById("message");

  const name    = nameInput ? nameInput.value.trim() : "";
  const team    = teamInput ? teamInput.value.trim() : "";
  const message = msgInput  ? msgInput.value.trim()  : "";

  // Validate team selection
  if (!team) {
    teamError.hidden = false;
    teamError.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  if (!name || !message) {
    return false;
  }

  // Show loading state
  const btnSpan = submitBtn.querySelector("span");
  const originalText = btnSpan ? btnSpan.textContent : "إرسال";
  submitBtn.disabled = true;
  if (btnSpan) btnSpan.textContent = "جاري الإرسال...";

  const payload = {
    name,
    team,
    message,
    submittedAt: new Date().toISOString()
  };

  try {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
      console.log("📋 [Dev Mode] Payload:", payload);
    } else {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    }

    // Reset Form
    form.reset();
    teamBtns.forEach((b) => b.classList.remove("selected"));
    teamInput.value = "";
    teamError.hidden = true;

    // Show Success Modal
    openModal();
  } catch (err) {
    console.error("Submission error:", err);
    alert("حصل خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى!");
  } finally {
    submitBtn.disabled = false;
    if (btnSpan) btnSpan.textContent = originalText;
  }

  return false;
});
