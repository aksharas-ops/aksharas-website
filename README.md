# Aksharas Veg Restaurant – Responsive Website

This package contains the responsive Aksharas website, branch contact details, manually maintained testimonial copy, and the optional Supabase backend source for franchisee and corporate catering enquiries.

## Customer testimonials
- Testimonials are maintained directly in `index.html`.
- No Google Business Profile API, Google OAuth, Google review sync, or review database is used for this section.
- The current names and quotes are illustrative sample content. Replace them with feedback from actual customers before presenting them as genuine endorsements.
- To edit a testimonial, update the text and attribution in the `#testimonials` section of `index.html`.

## Website design and branch contacts
- Original Aksharas logo, approved food/branch photographs, orange/green/ivory theme and responsive layout are retained.
- Desktop navigation typography has been increased; logo dimensions are unchanged.
- Porur: +91-9677186207
- Perumbakkam: +91-8870716392
- Madipakkam: +91-8925534939

## Supabase setup (do this later, when ready)
The public website should use a separate Supabase project. Do not connect it to the existing Aksharas Ops database.

1. Run `supabase/migrations/202611220002_business_enquiries.sql` in the website project's SQL Editor.
2. Update `config.js` with the website Supabase URL and publishable/anon key.
3. Set `RATE_LIMIT_HASH_SECRET` as an Edge Function secret.
4. Deploy `submit-business-enquiry` with Supabase CLI.
5. Configure `[functions.submit-business-enquiry] verify_jwt = false` as shown in `supabase/config.toml`.

The Franchisee Enquiry and Corporate Catering forms use this function. Until Supabase is configured, the forms will display a service-not-configured message and direct visitors to call a branch.

## Party Orders behaviour
- The hero `Contact Us for Party Orders` link and Party Orders banner `Contact Us` button navigate to `#contact`.
- There is no Party Orders enquiry form.
- The Contact Us section contains separate Franchisee Enquiry and Corporate Catering forms.

## Deploy to GitHub and Cloudflare
1. Extract this ZIP.
2. Upload the *contents* of `aksharas-website-v2` to the root of `aksharas-ops/aksharas-website` on the `main` branch (do not upload the outer folder as a nested directory).
3. Replace existing files and upload the complete `assets` folder.
4. Commit the changes and wait for the Cloudflare `aksharas-website-staging` deployment to show **Ready**.
5. Test desktop, tablet and mobile layouts, branch call links, menu links, Party Orders navigation and both Contact Us forms.

## Notes
- Google Maps links used by branch Directions buttons are unchanged. They are not used to fetch or display testimonials.
- Google Fonts are used for typography only. They are not used for reviews.
- Keep the production domain and Aksharas Ops database unchanged until the staging site is approved.

## Our Story
- The header and footer “Our Story” links navigate to the `#story` section on the homepage.
- Update the editorial copy in the `<section id="story">` block in `index.html`.


V11 visual update: Our Story section uses the site-wide warm cream background with subtle soft green and gold background accents, and a softly elevated ivory content panel.

## V13 – Full-site Aksharas background theme
- Extended the warm cream background and subtle green wave/leaf treatment across the full website, rather than limiting the illustrated theme to Our Story.
- Added a low-opacity temple watermark behind the hero content.
- Placed the temple tower, palm tree and banana-leaf idli illustration at the bottom-right of the overall website footer (not as a large element beside the hero text).
- Kept the hero food photograph, headline, buttons and all existing content and links intact.
