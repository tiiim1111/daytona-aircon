# Daytona Mini Split Warehouse Website

Single-page static website for Daytona Mini Split Warehouse, a Daytona Beach mini split air conditioning and HVAC accessory retailer.

## What Is Included

- Premium responsive landing page
- SEO-friendly local business copy
- Inquiry form connected to Google Sheets through Google Apps Script
- Basic anti-spam checks and 10-minute inquiry cooldown
- LocalBusiness/HVACBusiness schema markup

## Local Preview

Run a simple static server:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Main Files

- `index.html` - website markup and SEO metadata
- `styles.css` - responsive visual styling
- `script.js` - inquiry form status, cooldown, and UX behavior
- `google-apps-script-inquiries.js` - Google Apps Script endpoint for saving inquiries
- `GOOGLE_SHEET_SETUP.md` - Google Sheet and Apps Script deployment instructions
- `assets/` - website images
- `local-resources/` - original client-provided reference assets/details

## Inquiry Form

The form posts to a deployed Google Apps Script web app. Inquiries are saved to the `Inquiries` tab in the configured Google Sheet.

Current protections:

- Hidden honeypot field
- Minimum 2-second time-on-form check
- 1,200-character message limit
- 10-minute browser-side lock after successful submission

When `google-apps-script-inquiries.js` changes, copy it into Apps Script and deploy a new version.

## Static Hosting

This site can be hosted on Cloudflare Pages, Netlify, Vercel, GitHub Pages, or traditional cPanel/static hosting.

For static platforms:

- Build command: none
- Output directory: project root

## Client Contact Details

Daytona Mini Split Warehouse  
Daytona Flea and Farmers Market  
1425 Tomoka Farms Rd, Daytona Beach, FL 32124  
Booths 1, 3, 5, and 7  
Phone: 386-451-2575  
Email: daytonamsw@gmail.com
