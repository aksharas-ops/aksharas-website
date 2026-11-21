# Aksharas Veg Restaurant – Responsive Website Staging

A responsive static website prototype based on the approved Aksharas homepage design.

## Files
- `index.html` – homepage structure
- `styles.css` – responsive layouts for desktop, tablet and mobile
- `script.js` – mobile navigation, party enquiry dialog and five-star review filtering
- `config.js` – ordering URL and review configuration
- `assets/` – Aksharas logo and approved food/restaurant photographs

## Responsive behaviour
The layout is designed and tuned for viewport widths of 320px, 375px, 430px, 680px, 768px, 900px, 1120px, 1440px, 1840px and wider. The header changes to a collapsible menu at tablet widths; menu and speciality cards reflow; party orders stacks on mobile; branch cards become a single column on narrow phones. Images use responsive aspect ratios and `object-fit` to avoid distortion.

## Preview locally
Open `index.html` in a browser, or run a local server from this folder:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy
Commit the extracted contents of this folder to the root of the existing `aksharas-ops/aksharas-website` GitHub repository on the `main` branch. The connected Cloudflare `aksharas-website-staging` project should build the latest commit automatically. Wait for the newest deployment to show **Ready** before testing the staging URL.

## Reviews
The frontend intentionally renders only reviews with a numeric rating exactly equal to 5 and a non-empty comment. `config.js` currently contains an empty review list. Connect a verified review source and populate the configuration before showing real customer comments. Do not insert fabricated reviews.

## Party enquiry
The enquiry dialog prepares a WhatsApp message using the configured number in `script.js`. Verify the contact number before production launch. The current form is not database-backed.

## Production safety
Keep the existing Aksharas Ops Worker and production domain unchanged while testing this staging website.


## Branch contact numbers (updated)

- Porur: +91-9677186207
- Perumbakkam: +91-8870716392
- Madipakkam: +91-8925534939

The branch Call buttons use these numbers. Party-order enquiries are directed to the WhatsApp number for the branch selected in the enquiry form.
