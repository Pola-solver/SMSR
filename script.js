// ─── CONFIG ────────────────────────────────────────────────────────────────
// Paste your Google Apps Script Web App URL here after deploying it:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcoHHQNbEWd_i1CiLnCJmHqkeiEHBGrW-gIzSJZnCOVO_9uOMFn4lXgmTzmow4EOHe/exec";
// ───────────────────────────────────────────────────────────────────────────

const INTRO_DURATION = 5000;

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("intro").setAttribute("aria-hidden", "true");
  }, INTRO_DURATION);
});

// ─── FORM → GOOGLE SHEETS ──────────────────────────────────────────────────
const form       = document.getElementById("response-form");
const successMessage = document.getElementById("success-message");
const submitBtn  = form.querySelector("button[type='submit']");
const teamInput  = document.getElementById("team");
const teamError  = document.getElementById("team-error");
const teamBtns   = document.querySelectorAll(".team-btn");

// Team button toggle
teamBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    teamBtns.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    teamInput.value = btn.dataset.team;
    teamError.hidden = true;
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const team    = teamInput.value.trim();
  const message = document.getElementById("message").value.trim();

  // Validate team selected
  if (!team) {
    teamError.hidden = false;
    teamError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (!name || !message) return;

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "جاري الإرسال...";

  const payload = { name, team, message, submittedAt: new Date().toISOString() };

  try {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
      console.log("📋 [Dev Mode] Form data:", payload);
    } else {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    form.reset();
    teamBtns.forEach(b => b.classList.remove("selected"));
    teamInput.value = "";
    form.hidden = true;
    successMessage.hidden = false;
  } catch (err) {
    console.error("Submission error:", err);
    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "إرسال";
    alert("حصل خطأ، حاول تاني!");
  }
});
