# Aksharas Veg Restaurant – Prototype-matched staging website

This revision recreates the supplied 1024 × 1536 approved homepage mockup: header, split hero, green benefits strip, five menu cards, party banner, four speciality cards, testimonials, three branch cards and dark-green footer.

## Deploy
- Static site; no build command required.
- Upload the contents of this folder to the root of the `aksharas-website` GitHub repository.
- Cloudflare Pages: framework preset `None`; build command blank; output directory `/` (or `.` depending on the Pages UI).
- Do not change or overwrite the existing `aksharas-ops` Worker.

## Assets
The food and restaurant images in `assets/` are crops taken from the approved prototype screenshot so the staging page preserves the same pictured visuals. The primary logo is the supplied Aksharas logo file.

## Reviews
`config.js` accepts verified review records. `script.js` strictly renders only entries with `rating === 5` and a non-empty comment. No sample or invented testimonials are included. Connect the Google Business Profile review source before populating this list.

## Party enquiry
The prototype form opens a WhatsApp message to the restaurant number currently shown on the existing website. Confirm this is the correct party enquiry number before launch. A database-backed enquiry workflow can replace this after Supabase is configured.

## Before public launch
Verify branch phone numbers, map pins, official ordering links, Google review integration, and mobile display. The `Gallery` navigation anchor is retained for visual parity; a dedicated gallery page/section can be added in the next iteration.
