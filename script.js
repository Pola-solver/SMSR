  }, INTRO_DURATION);
});
// ─── FORM → GOOGLE SHEETS ──────────────────────────────────────────────────
const form = document.getElementById("response-form");
const successMessage = document.getElementById("success-message");
const submitBtn = form.querySelector("button[type='submit']");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name    = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!name || !message) return;
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "جاري الإرسال...";
  const payload = { name, message, submittedAt: new Date().toISOString() };
  try {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
      // Dev-mode: just log locally
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
    form.hidden = true;
    successMessage.hidden = false;
  } catch (err) {
    console.error("Submission error:", err);
    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "إرسال";
    alert("حصل خطأ، حاول تاني!");
  }
});
