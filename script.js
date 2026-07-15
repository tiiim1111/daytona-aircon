const inquiryForm = document.querySelector("#inquiry-form");
const formStatus = document.querySelector("#form-status");
const formFrame = document.querySelector("iframe[name='inquiry-submit-frame']");
const formStartedAt = document.querySelector("#form-started-at");

if (inquiryForm && formStatus && formFrame) {
  const placeholderUrl = "REPLACE_WITH_DEPLOYED_WEB_APP_URL";
  const cooldownMs = 10 * 60 * 1000;
  const cooldownKey = "daytonaInquiryCooldownUntil";
  let submitted = false;
  let submitTimer = null;
  let cooldownTimer = null;

  if (formStartedAt) {
    formStartedAt.value = String(Date.now());
  }

  applyCooldown();

  inquiryForm.addEventListener("submit", (event) => {
    const cooldownUntil = Number(window.localStorage.getItem(cooldownKey) || 0);

    if (cooldownUntil > Date.now()) {
      event.preventDefault();
      lockForm(cooldownUntil);
      return;
    }

    if (inquiryForm.action.includes(placeholderUrl)) {
      event.preventDefault();
      formStatus.textContent =
        "Inquiry form is ready, but the Google Apps Script web app URL still needs to be added.";
      formStatus.dataset.state = "error";
      return;
    }

    if (formStartedAt && Date.now() - Number(formStartedAt.value || 0) < 2500) {
      event.preventDefault();
      formStatus.textContent = "Please wait a moment before sending your inquiry.";
      formStatus.dataset.state = "error";
      return;
    }

    submitted = true;
    formStatus.textContent = "Sending inquiry...";
    formStatus.dataset.state = "sending";

    window.clearTimeout(submitTimer);
    submitTimer = window.setTimeout(() => {
      if (!submitted) {
        return;
      }

      completeSubmittedInquiry();
    }, 12000);
  });

  formFrame.addEventListener("load", () => {
    if (!submitted) {
      return;
    }

    window.clearTimeout(submitTimer);
    window.setTimeout(() => {
      if (!submitted) {
        return;
      }

      completeSubmittedInquiry();
    }, 500);
  });

  window.addEventListener("message", (event) => {
    if (!submitted) {
      return;
    }

    if (event.data?.type !== "daytona-inquiry-response") {
      return;
    }

    window.clearTimeout(submitTimer);
    submitted = false;
    const payload = event.data.payload || {};

    if (payload.ok) {
      completeSubmittedInquiry();
    } else {
      formStatus.textContent =
        "We could not save the inquiry. Please try again or call 386-451-2575.";
      formStatus.dataset.state = "error";
    }
  });

  function completeSubmittedInquiry() {
    submitted = false;
    inquiryForm.reset();

    if (formStartedAt) {
      formStartedAt.value = String(Date.now());
    }

    const cooldownUntil = Date.now() + cooldownMs;
    window.localStorage.setItem(cooldownKey, String(cooldownUntil));
    lockForm(cooldownUntil);
  }

  function applyCooldown() {
    const cooldownUntil = Number(window.localStorage.getItem(cooldownKey) || 0);

    if (cooldownUntil > Date.now()) {
      lockForm(cooldownUntil);
    }
  }

  function lockForm(cooldownUntil) {
    inquiryForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
      field.disabled = true;
    });
    inquiryForm.dataset.locked = "true";
    updateCooldownStatus(cooldownUntil);

    window.clearInterval(cooldownTimer);
    cooldownTimer = window.setInterval(() => {
      updateCooldownStatus(cooldownUntil);
    }, 1000);
  }

  function unlockForm() {
    inquiryForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
      field.disabled = false;
    });
    inquiryForm.dataset.locked = "false";
    window.localStorage.removeItem(cooldownKey);
    window.clearInterval(cooldownTimer);

    if (formStartedAt) {
      formStartedAt.value = String(Date.now());
    }

    formStatus.textContent = "You can send another inquiry now.";
    formStatus.dataset.state = "success";
  }

  function updateCooldownStatus(cooldownUntil) {
    const remainingMs = cooldownUntil - Date.now();

    if (remainingMs <= 0) {
      unlockForm();
      return;
    }

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.ceil((remainingMs % 60000) / 1000);
    const displaySeconds = String(seconds).padStart(2, "0");

    formStatus.textContent =
      `Thanks. Your inquiry was sent. Please wait ${minutes}:${displaySeconds} before sending another one.`;
    formStatus.dataset.state = "success";
  }
}
