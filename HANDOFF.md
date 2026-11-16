# Big Jamaica redesign: status and handoff

## Files
- `index.html` is the public site (one page app: home, trips, trip detail, schedule, reports, gallery, charters, plan your trip/FAQ, gift cards, contact).
- `admin.html` is the staff admin (schedule, fishing reports, photos, trips & prices, backup).
- `content.js` holds the default content (trips, prices, sailings, reports, charters, photos). Copied from the current site in Nov 2026.

To preview, open `index.html` in a browser. Open `admin.html`, log in with any password, make a change, and reload `index.html` in the same browser to see it.

## Feature parity with current bigjamaica.com

| Current site | New site | Status |
|---|---|---|
| Home, upcoming sailings | Home + "Next sailings" strip | Done |
| Trip descriptions | Trips page with filters + per-trip page with real cost calculator | Done |
| Book Now (per-trip booking pages) | Schedule page, "Reserve" deep-links to existing booking pages | Done, uses current backend |
| Fishing reports | Reports with species filter, photo, high hook/pool stats | Done |
| Photo gallery | Gallery with lightbox | Done |
| FAQ | Plan Your Trip page | Done |
| Private charters | Price table + estimator + request form | Form needs a backend |
| Gift certificate | New design, links to current order page | See security note |
| Contact form + email blast signup | Contact page | Form needs a backend |
| Directions / hotels | Plan Your Trip page | Hotel list not copied yet (page was rate-limited) |
| America 250 / July 4th page | "July 4th Fireworks" special trip | Done as a trip; one-off pages can be report posts |
| Policies (terms, cancellation, privacy, trip reservation) | Plain-English summary + links | Full texts still need copying |
| Link to 100' Paramount | Footer link | Done |
| (none) | Admin page for schedule, posts, photos, prices | Prototype (browser storage only) |

## What the current developer must provide (booking stays on their system)
1. **Booking pages stay live** at a stable URL, ideally `book.bigjamaica.com/...` once the new site takes over `www`. The trip to URL map is the `bookUrl` field in `content.js`.
2. **A schedule + seats feed** (JSON, iCal, or API) so the "Next sailings" and seats-left badges are automatic. Without it, staff enter the schedule twice: once in the booking system and once in our admin.
3. **Prices**: the booking system is the source of truth for what's charged. Our admin price edits only change what the website shows. Either they share prices in the feed, or staff must update both.
4. **Gift certificates and the contact/email-blast list**: confirm whether these stay on their system, and export the email list if not.
5. **Their styling hooks** (optional): let us restyle the booking pages so the hand-off doesn't look like a different site.

## Holes to close before launch
- **Admin saving** is built for Netlify (see `DEPLOY.md`): staff logins, and Publish commits content into the repo. It still needs the one-time Netlify setup and a live test.
- **Card security on gift certificates.** The current order form appears to collect card details directly on the page. Confirm it's PCI compliant, or move to a hosted checkout (Stripe, Square).
- **Content rights.** Owner is on board, but get written OK to reuse their text and photos, and get the original photo files.
- **Domain and hosting.** Someone with access to the domain registrar must point `www` at the new host.
- **Placeholder data.** The Bonito special price ($120) is a guess. The sample sailings are demo data. The trip and gallery "photos" are color placeholders.

## Round 2 features (status bar, forecast, photo feed, SMS and waiting list mock-ups)
- **Sailing status bar**: real. Staff tap Sailing / Watching weather / Cancelled in the admin. It shows on every page. If nobody posts a status that day, the bar says "not posted yet" and gives the phone number, so a stale "Sailing" can never show.
- **Marine forecast**: real. Read live in the visitor's browser from NOAA's free API (`api.weather.gov`, zone ANZ450, Sandy Hook to Manasquan Inlet out 20 nm). No key, no cost. It is the coastal forecast, not the canyons. If NOAA is down the section just hides.
- **Fishing reports photo feed**: real. Share uses the phone's share sheet; on desktop it copies a link. Facebook previews show the site, not the single report, until each report has its own page.
- **Text alerts page, phone + SMS consent before Reserve, waiting list**: MOCK-UPS. Each is labeled "Demo". Nothing is stored or sent.

### To make SMS and the waiting list real
1. **An SMS provider** (Twilio or similar) with a registered number. US carriers require business registration (A2P 10DLC) before texts deliver. Allow a few weeks and a small monthly cost.
2. **Somewhere to store numbers and consent** with a timestamp and the exact wording shown. That means a small database, not the git repo: phone numbers must not sit in a code repository.
3. **Consent wording reviewed** for TCPA. The text on the site is a reasonable sample, not legal advice. STOP and HELP replies must work.
4. **Which phone booked which trip.** Booking stays on the old system, so either its developer sends us bookings (or adds the consent box on their form), or cancellation texts only reach people who typed their number on our side.
5. **Seat counts from the booking system** for the waiting list. Today "sold out" is whatever staff set in the admin.

## Demo booking page (draft only)
While `SITE_DRAFT` is true in `draft.js`, every Reserve button opens a demo booking page inside the site (`#reserve/<trip>/<date>`): tickets by type, rod and bunk add-ons, a running total, name/email/phone with the text-alert consent box, a pretend payment step with no card fields, and a demo confirmation. Nothing is saved, sent or charged and no seat is held.

At launch, setting `SITE_DRAFT = false` brings back the real hand-off: the consent step, then the current booking system at `bookUrl`. If the owner later wants this page to be the real checkout, it needs the booking system's API (seat holds, prices, payment) or a hosted checkout such as Stripe or Square; card details should never be typed into our own page.
