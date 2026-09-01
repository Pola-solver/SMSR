// ─── GOOGLE APPS SCRIPT CONFIG ─────────────────────────────────────────────
// Paste your deployed Google Apps Script Web App URL below:
const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
// ───────────────────────────────────────────────────────────────────────────

// ─── FLOATING PARTICLES CANVAS ─────────────────────────────────────────────
function initSparkleCanvas() {
  const canvas = document.getElementById("sparkle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(35, Math.floor(width / 30));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      isHeart: Math.random() > 0.7,
      scaleSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    });
  }

  function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 10, size / 10);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
    ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.angle += 0.02;

      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      const currentOpacity = (Math.sin(p.angle) * 0.3 + 0.7) * p.opacity;

      if (p.isHeart) {
        drawHeart(p.x, p.y, p.size * 2, `rgba(247, 178, 183, ${currentOpacity})`);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 215, 148, ${currentOpacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(247, 215, 148, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

// ─── INTRO ANIMATION & TAP-TO-SKIP ─────────────────────────────────────────
function dismissIntro() {
  const intro = document.getElementById("intro");
  const mainPage = document.getElementById("main-page");

  if (intro && intro.style.display !== "none") {
    intro.style.opacity = "0";
    intro.style.transition = "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      intro.style.display = "none";
      intro.setAttribute("aria-hidden", "true");
    }, 500);
  }

  if (mainPage) {
    requestAnimationFrame(() => {
      mainPage.style.opacity = "1";
      mainPage.style.transform = "translateY(0)";
    });
  }
}

// Auto dismiss intro after 3.2 seconds
setTimeout(dismissIntro, 3200);

// Tap anywhere on intro to skip immediately
document.addEventListener("DOMContentLoaded", () => {
  initSparkleCanvas();

  const intro = document.getElementById("intro");
  if (intro) {
    intro.addEventListener("click", dismissIntro);
    intro.addEventListener("touchstart", dismissIntro, { passive: true });
  }
});

// ─── FORM & TAG SELECTION ──────────────────────────────────────────────────
const form = document.getElementById("party-form");
const guestTagInput = document.getElementById("guest-tag");
const tagError = document.getElementById("tag-error");
const tagBtns = document.querySelectorAll(".tag-btn");
const submitBtn = document.getElementById("submit-btn");

// Role / Tag button selection
tagBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    tagBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    guestTagInput.value = btn.dataset.tag;
    tagError.hidden = true;
  });
});

// ─── DRAG & DROP & FILE MANAGEMENT ─────────────────────────────────────────
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const browseBtn = document.getElementById("browse-btn");
const previewSection = document.getElementById("preview-section");
const previewGrid = document.getElementById("preview-grid");
const previewCount = document.getElementById("preview-count");
const clearAllBtn = document.getElementById("clear-all-btn");

let selectedFiles = []; // Array of { id, file, previewUrl, base64 }

// Trigger file picker
if (browseBtn) {
  browseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
  });
}

if (dropZone) {
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  // Drag & drop event listeners
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("drag-active");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("drag-active");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  });
}

// File input change handler
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // reset input value so re-selecting same files triggers event
    fileInput.value = "";
  });
}

// Process added files
function handleFiles(files) {
  const newFiles = Array.from(files).filter((file) => {
    return file.type.startsWith("image/") || file.type.startsWith("video/");
  });

  if (newFiles.length === 0) return;

  newFiles.forEach((file) => {
    const fileId = "photo_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    const previewUrl = URL.createObjectURL(file);

    selectedFiles.push({
      id: fileId,
      file: file,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: previewUrl,
    });
  });

  updatePreviewUI();
}

// Format file size nicely
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Update the preview grid UI
function updatePreviewUI() {
  if (selectedFiles.length === 0) {
    previewSection.hidden = true;
    previewGrid.innerHTML = "";
    previewCount.textContent = "تم اختيار 0 صور";
    return;
  }

  previewSection.hidden = false;
  previewCount.textContent = `تم اختيار ${selectedFiles.length} ${selectedFiles.length === 1 ? "صورة" : "صور"}`;
  previewGrid.innerHTML = "";

  selectedFiles.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "preview-item";

    const img = document.createElement("img");
    img.src = item.previewUrl;
    img.alt = item.name;
    img.loading = "lazy";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "preview-remove-btn";
    removeBtn.innerHTML = "✕";
    removeBtn.title = "حذف الصورة";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFile(item.id);
    });

    const sizeTag = document.createElement("div");
    sizeTag.className = "preview-size-tag";
    sizeTag.textContent = formatFileSize(item.size);

    card.appendChild(img);
    card.appendChild(removeBtn);
    card.appendChild(sizeTag);
    previewGrid.appendChild(card);
  });
}

// Remove single file
function removeFile(fileId) {
  const fileToRemove = selectedFiles.find((f) => f.id === fileId);
  if (fileToRemove && fileToRemove.previewUrl) {
    URL.revokeObjectURL(fileToRemove.previewUrl);
  }
  selectedFiles = selectedFiles.filter((f) => f.id !== fileId);
  updatePreviewUI();
}

// Clear all files
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    selectedFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    selectedFiles = [];
    updatePreviewUI();
  });
}

// ─── CLIENT-SIDE IMAGE COMPRESSION ─────────────────────────────────────────
// Compresses high-res mobile photos to max 1920px JPEG for ultra-fast Drive upload
async function compressAndEncodeImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      // Non-image (e.g. video), read as raw base64
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with 0.82 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── PROGRESS & MODAL CONTROLS ─────────────────────────────────────────────
const progressContainer = document.getElementById("upload-progress-container");
const progressBar = document.getElementById("upload-progress-bar");
const statusText = document.getElementById("upload-status-text");
const successModal = document.getElementById("success-modal");
const modalResetBtn = document.getElementById("modal-reset-btn");

function updateProgress(percent, text) {
  if (progressContainer) progressContainer.hidden = false;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (statusText && text) statusText.textContent = text;
}

function hideProgress() {
  if (progressContainer) progressContainer.hidden = true;
  if (progressBar) progressBar.style.width = "0%";
}

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

if (modalResetBtn) {
  modalResetBtn.addEventListener("click", closeModal);
}

if (successModal) {
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) closeModal();
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

  const nameInput = document.getElementById("guest-name");
  const msgInput = document.getElementById("guest-message");

  const guestName = nameInput ? nameInput.value.trim() : "";
  const guestTag = guestTagInput ? guestTagInput.value.trim() : "";
  const guestMessage = msgInput ? msgInput.value.trim() : "";

  // Validate relationship tag
  if (!guestTag) {
    tagError.hidden = false;
    tagError.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  if (!guestName || !guestMessage) {
    return false;
  }

  // Lock UI
  submitBtn.disabled = true;
  const btnText = submitBtn.querySelector(".btn-text");
  const originalBtnText = btnText ? btnText.textContent : "إرسال";
  if (btnText) btnText.textContent = "جاري الحفظ والرفع...";

  try {
    const photosPayload = [];

    // Compress and prepare photos if any selected
    if (selectedFiles.length > 0) {
      updateProgress(10, `جاري تجهيز ${selectedFiles.length} صورة للرفع...`);

      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        const progressPercent = 10 + Math.round(((i + 1) / selectedFiles.length) * 40);
        updateProgress(progressPercent, `جاري ضغط وتجهيز صورة (${i + 1} من ${selectedFiles.length})...`);

        try {
          const base64Data = await compressAndEncodeImage(item.file);
          photosPayload.push({
            filename: item.name.replace(/\.[^/.]+$/, "") + ".jpg",
            mimeType: "image/jpeg",
            base64: base64Data,
          });
        } catch (err) {
          console.warn("Could not compress image:", item.name, err);
        }
      }
    }

    updateProgress(65, "جاري رفع الرسالة والصور إلى Google Drive...");

    const payload = {
      name: guestName,
      tag: guestTag,
      message: guestMessage,
      submittedAt: new Date().toISOString(),
      photos: photosPayload,
    };

    // If in development or unconfigured URL
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
      console.log("💍 [Dev Mode] Submitting Bachelorette Payload:", {
        ...payload,
        photos: payload.photos.map((p) => ({ filename: p.filename, size: p.base64.length })),
      });
      // Simulate network request delay for realistic preview
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } else {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    }

    updateProgress(100, "تم الرفع بنجاح! ✨");
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Reset Form & Files
    form.reset();
    tagBtns.forEach((b) => b.classList.remove("selected"));
    guestTagInput.value = "";
    tagError.hidden = true;

    selectedFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    selectedFiles = [];
    updatePreviewUI();
    hideProgress();

    // Show Success Modal
    openModal();
  } catch (error) {
    console.error("Upload error:", error);
    alert("حصل خطأ أثناء الرفع، يرجى التأكد من الاتصال بالإنترنت والمحاولة مرة أخرى!");
    hideProgress();
  } finally {
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = originalBtnText;
  }

  return false;
});
