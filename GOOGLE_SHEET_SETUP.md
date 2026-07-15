# Google Sheet Inquiry Setup

The inquiry card is already on the website. To send submissions into the client Google Sheet, deploy the included Apps Script and paste its web app URL into `index.html`.

## Target Sheet

Spreadsheet ID:

```text
1d6OTFnZUGOtGobJI7qrwtpngeyM9WcngP9Zu_j1UkVw
```

The script writes to a tab named `Inquiries`. If that tab does not exist, it creates it and adds headers.

## Setup Steps

1. Open the Google Sheet from `local-resources/README.md`.
2. Go to `Extensions` > `Apps Script`.
3. Paste the contents of `google-apps-script-inquiries.js` into the Apps Script editor.
4. Click `Deploy` > `New deployment`.
5. Choose type `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Deploy and copy the web app URL ending in `/exec`.
9. In `index.html`, replace:

```text
https://script.google.com/macros/s/REPLACE_WITH_DEPLOYED_WEB_APP_URL/exec
```

with the deployed Apps Script web app URL.

After changing `google-apps-script-inquiries.js`, deploy a new version from `Deploy` > `Manage deployments` > pencil icon > `Version` > `New version` > `Deploy`. Apps Script keeps serving the old version until this is done.

Current deployed URL configured in `index.html`:

```text
https://script.google.com/macros/s/AKfycbx1kAms4CgETO_lvM7UH8SOGKaOryW22n7i6Gmr7cuE6EhvB6i3cbJEkjwykPZworMF/exec
```

## Fields Saved

- Timestamp
- Name
- Phone
- Email
- Project Type
- Preferred Contact
- Message
- Source
- Page

## Anti-Spam Rules

The current form includes:

- A hidden honeypot field named `website`
- A minimum 2-second time-on-form check
- A 1,200-character message limit
- A 10-minute rate limit per email or phone number

If these rules change in `google-apps-script-inquiries.js`, deploy a new Apps Script version again.
