const SHEET_ID = "1d6OTFnZUGOtGobJI7qrwtpngeyM9WcngP9Zu_j1UkVw";
const SHEET_NAME = "Inquiries";
const MAX_MESSAGE_LENGTH = 1200;
const MIN_FORM_SECONDS = 2;

function doPost(event) {
  try {
    const sheet = getInquirySheet();
    const params = event.parameter || {};
    const timestamp = new Date();
    const validation = validateInquiry(params, timestamp);

    if (!validation.ok) {
      return respond(validation);
    }

    sheet.appendRow([
      timestamp,
      clean(params.name),
      clean(params.phone),
      clean(params.email),
      clean(params.projectType),
      clean(params.preferredContact),
      clean(params.message),
      clean(params.source),
      clean(params.page)
    ]);

    return respond({ ok: true });
  } catch (error) {
    return respond({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doGet() {
  return respond({ ok: true, message: "Daytona inquiry endpoint is live." });
}

function getInquirySheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Phone",
      "Email",
      "Project Type",
      "Preferred Contact",
      "Message",
      "Source",
      "Page"
    ]);
  }

  return sheet;
}

function clean(value) {
  return String(value || "").trim();
}

function validateInquiry(params, timestamp) {
  const name = clean(params.name);
  const phone = clean(params.phone);
  const email = clean(params.email);
  const message = clean(params.message);
  const website = clean(params.website);
  const startedAt = Number(clean(params.formStartedAt));

  if (website) {
    return { ok: false, reason: "spam_detected" };
  }

  if (!name || !phone || !message) {
    return { ok: false, reason: "missing_required_fields" };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, reason: "message_too_long" };
  }

  if (!startedAt || timestamp.getTime() - startedAt < MIN_FORM_SECONDS * 1000) {
    return { ok: false, reason: "submitted_too_quickly" };
  }

  return { ok: true };
}

function respond(payload) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  const html = `
    <!doctype html>
    <html>
      <body>
        <script>
          window.parent.postMessage({
            type: "daytona-inquiry-response",
            payload: ${json}
          }, "*");
        </script>
        <pre>${json}</pre>
      </body>
    </html>
  `;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
