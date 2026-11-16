# Big Jamaica website (redesign)

New website for the 125' Big Jamaica party fishing boat, Brielle NJ.

- `index.html` is the public site. Open it in a browser, no build step.
- `admin.html` is the staff admin for schedule, fishing reports, photos and prices. On the hosted site it has real logins and publishes into this repo. Opened locally it runs in preview mode and saves to the browser.
- `draft.js` puts the DRAFT watermark on every page. Set `SITE_DRAFT = false` in it at launch to remove it everywhere.
- `content.json` is the published content the site reads. The admin page writes it.
- `netlify/functions/admin.mjs` and `netlify.toml` are the hosting pieces. See `DEPLOY.md` for setup.
- `content.js` holds the default content (trips, prices, sailings, reports, charters, photos).
- `HANDOFF.md` covers feature parity with the current site, what the current booking developer must provide, and open holes.

Booking stays on the current system: "Reserve" buttons deep-link to `bigjamaica.com/booknow/<trip>`.

![Home](docs/preview-home.png)
