# Aksharas Veg Restaurant – Responsive Website + Backend Integrations

This package preserves the responsive V4 website and branch phone numbers, and adds the implementation for the two pending features: party enquiries saved to a separate Supabase website database, and Google Business Profile review ingestion with five-star-only publication.

## Important architecture
- Use a **new Supabase project dedicated to the public website**. Do not connect this public site to the existing Aksharas Ops database.
- Browser code contains only the Supabase project URL and publishable/anon key. Never place service-role keys, Google client secrets or refresh tokens in the browser or GitHub.
- Google OAuth refresh tokens are encrypted with AES-GCM in the database.
- Google reviews flow: Google sync -> Draft -> Senior Manager approval -> Admin publish. Public site displays only published reviews with exactly 5 stars and a non-empty comment.
- Party enquiry flow: validate -> rate limit -> insert into database -> then open WhatsApp to the selected branch number.

## A. Create the separate website Supabase project
1. Create a new Supabase project for the public website. Do not reuse the Aksharas Ops project/database.
2. Open SQL Editor and run `supabase/migrations/202611220001_website_enquiries_and_reviews.sql`.
3. Copy the Project URL and publishable key (or legacy anon key). Put them in `config.js` as `supabaseUrl` and `supabasePublishableKey`. The publishable/anon key is intended for browser use only when RLS is enabled.
4. Deploy the Edge Functions in `supabase/functions/`. With Supabase CLI, from this folder run `supabase link --project-ref YOUR_PROJECT_REF`, then deploy each function with `supabase functions deploy FUNCTION_NAME --no-verify-jwt`.
5. Add the secrets listed in `supabase/SECRETS.example.txt` through Supabase Dashboard -> Edge Functions -> Secrets. Supabase service role key is server-side only and must never be added to config.js.

## B. Party enquiry database
- `submit-party-enquiry` is a public Edge Function that validates all fields, ignores honeypot submissions, applies a per-IP hashed rate limit (5 submissions per 10 minutes), and inserts into `party_order_enquiries`.
- RLS is enabled and no public table policies are created; writes happen through the server-side Edge Function.
- After a successful database save, the browser opens WhatsApp to the branch selected in the form. If the database save fails, the form shows an error and does not falsely claim success.
- The current form fields are name, phone, event type, branch, date, guest count and details.

## C. Google Business Profile setup
Google project already created by the owner: project name `Aksharas Google Reviews`, project ID `graceful-design-515413-e9`, project number `184631814369`. Confirm the project has the required Business Profile API access enabled/approved in Google Cloud. Google API access and OAuth consent must be completed before syncing.

1. In Google Cloud, configure the OAuth consent screen and create an OAuth Client ID of type Web application. Add the exact redirect URI: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/google-oauth-callback`.
2. Enable/request access to the Google Business Profile APIs required to list accounts, locations and reviews. The review list endpoint is `GET https://mybusiness.googleapis.com/v4/{account}/locations/{location}/reviews` and requires the `https://www.googleapis.com/auth/business.manage` OAuth scope. The locations lookup uses the Business Information API.
3. Put the OAuth client ID/secret, redirect URI, scope and generated encryption/setup secrets into Supabase Edge Function secrets. Generate a base64-encoded 32-byte key for `GOOGLE_TOKEN_ENCRYPTION_KEY`; do not use a human-readable password.
4. For each branch, call `google-oauth-start` with POST JSON `{ "branch": "Porur" }` and header `x-google-setup-secret: YOUR_GOOGLE_SETUP_SECRET`. It returns an `authorization_url`. Open that URL while signed in to the Google account that manages that branch's verified Business Profile. Repeat separately for Perumbakkam and Madipakkam, using the appropriate Google account for each.
5. On the callback page, select the matching verified Aksharas location and enter the setup secret to save the connection. Each branch has its own encrypted refresh token.
6. Run `sync-google-reviews` with POST and the same setup-secret header to import reviews. Repeat after connecting all three branches.
7. Review records arrive as `draft`. Add the Supabase Auth user IDs of approved website reviewers to `website_admin_roles` (role `senior_manager` or `admin`) using SQL. A Senior Manager can approve; only an admin can publish. Only published exact-five-star reviews with a comment are returned to the public website.
8. For recurring sync, schedule `sync-google-reviews` every six hours using Supabase Cron/your scheduler and send the setup secret securely as the `x-google-setup-secret` header. A manual sync endpoint is also available.

### OAuth start example
```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/google-oauth-start' \
  -H 'Content-Type: application/json' \
  -H 'x-google-setup-secret: YOUR_GOOGLE_SETUP_SECRET' \
  -d '{"branch":"Porur"}'
```

### Manual review sync example
```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-google-reviews' \
  -H 'x-google-setup-secret: YOUR_GOOGLE_SETUP_SECRET'
```

## D. Review workflow admin roles
Open `https://YOUR_STAGING_HOST/reviews-admin.html` to sign in to the review approval screen. Create website-only users under Supabase Authentication → Users; this does not reuse Aksharas Ops users unless separately invited/created.
After creating the Supabase Auth users for the people who manage website reviews, add their UUIDs in SQL Editor:
```sql
insert into public.website_admin_roles (user_id, role) values
  ('SUPABASE_AUTH_USER_UUID', 'senior_manager');
-- For the publishing administrator, use role 'admin'.
```
The `reviews-admin.html` page provides a simple sign-in and review approval screen at `/reviews-admin.html`. The `review-admin` function requires a valid Supabase Auth JWT. GET lists draft/approved reviews. PATCH with `{ "id": "REVIEW_UUID", "review_status": "approved" }` is permitted for Senior Manager/admin. Publishing requires admin role and a previously approved five-star review with a non-empty comment.

## E. Frontend config
Update `config.js` with the new website Supabase URL and public publishable/anon key. Never add service-role or Google OAuth secrets. Branch numbers are already configured:
- Porur: +91-9677186207
- Perumbakkam: +91-8870716392
- Madipakkam: +91-8925534939

## F. Deployment
1. Upload the extracted `aksharas-website-v2` folder contents to the root of the existing GitHub repository `aksharas-ops/aksharas-website` on `main`, including the new `supabase/` folder.
2. Replace the existing root files and assets; do not upload the outer folder as a nested directory.
3. Commit and allow the existing Cloudflare `aksharas-website-staging` Worker deployment to build.
4. Confirm the latest deployment is Ready, then test the staging website.
5. Keep the production domain and Aksharas Ops project/database unchanged until approval.

## G. Verification checklist
- Submit a test party enquiry and confirm a row appears in `party_order_enquiries`; then confirm the selected branch WhatsApp opens.
- Confirm an invalid enquiry is rejected and rate limiting works.
- Connect all three Google branch accounts and verify each location mapping.
- Run a review sync and confirm imported reviews start in Draft.
- Approve a five-star review as Senior Manager; publish it as admin; confirm it appears on the site.
- Confirm four-star reviews, rating-only reviews and unpublished reviews never appear publicly.
- Confirm no service-role key, Google client secret or refresh token is present in frontend files or GitHub.

## Branch contacts
- Porur: +91-9677186207
- Perumbakkam: +91-8870716392
- Madipakkam: +91-8925534939
