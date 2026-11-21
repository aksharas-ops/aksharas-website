# Aksharas Veg Restaurant — staging website

A responsive static website prototype using the approved Aksharas design direction and the supplied company logo.

## Preview locally

You can open `index.html` directly in a browser. For a local web server, run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy as a staging site on Cloudflare Pages

1. Create a new Git repository (for example `aksharas-website-staging`) and upload the contents of this folder.
2. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Framework preset: **None**. Build command: leave blank. Build output directory: `/` (repository root).
5. Deploy. Cloudflare will provide a staging `*.pages.dev` URL.
6. Test desktop/mobile layouts, links, images, and enquiry flow before changing the production domain.

Do not change the DNS for `aksharasveg.com` until the staging site is approved.

## Configuration still required before launch

Edit `config.js`:

- `orderUrl`: currently set to the existing ordering link found on the current website (`https://crossroads.dotpe.in`). Confirm whether this is the correct ordering destination for all three branches.
- `reviewsEndpoint`: secure server endpoint returning Google reviews. The frontend filters again and renders **only rating === 5**. No sample/fabricated reviews are included.
- `partyEnquiryEndpoint`: secure server endpoint to validate and store party enquiries. The form is designed but does not store submissions until this is configured.

Never put Google private keys, service-account JSON, or other secrets in browser JavaScript. Use a server-side function/proxy for Google reviews and form submission.

## Content verification before launch

- Confirm branch addresses, phone numbers, opening hours, map pins and ordering destinations for Porur, Perumbakkam and Madipakkam.
- The current live website lists +91 89255 34938, the Perumbakkam address (Ground floor, Srishti Arcade, Nookampalayam, Perumbakkam, Chennai), and the existing DotPe ordering URL. Verify these are still current.
- Food and restaurant photography in this prototype is loaded from Unsplash. Replace with approved Aksharas-owned photographs before production.
- Add the final approved legal/footer details and social profile URLs.

## Notes

This is a staging-ready front-end prototype, not a deployed live website. Google reviews and party enquiry storage require server-side endpoints and credentials/configuration. No changes have been made to the live website or its DNS.
