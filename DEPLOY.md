# Put the site on free hosting (Netlify)

The site is plain files, so there is no build step. One small function (`netlify/functions/admin.mjs`) lets the admin page save for real: when staff press **Publish**, it commits `content.json` and any new photos into this GitHub repo, and Netlify redeploys the site about a minute later. There's no database. Every change is in the git history, so any mistake can be undone.

```
Staff phone/PC ── admin.html ── Publish ──> Netlify function ──commit──> GitHub repo
                                                                            │
Visitors <── site (index.html + content.json) <── Netlify auto-deploy <─────┘
```

## One-time setup (about 15 minutes)

1. **Merge the pull request** so `main` has this code.
2. **Create the site.** Sign up at netlify.com with your GitHub login. Choose "Add new site", then "Import an existing project", then GitHub, and pick `BigJamiaca`. Leave the build command empty and the publish directory as `.` (Netlify reads `netlify.toml`). Deploy. You get a link like `something.netlify.app`.
3. **Create a GitHub token for the admin page.** In GitHub go to Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token.
   - Repository access: "Only select repositories", then `BigJamiaca`.
   - Permissions: Repository permissions, **Contents: Read and write**. Nothing else.
   - Set an expiry you'll remember (a year is fine) and copy the token.
4. **Add the settings in Netlify.** Site configuration, Environment variables, add:

   | Key | Value |
   |---|---|
   | `ADMIN_USERS` | `name:password` pairs separated by commas, one per staff member. Example: `captain:long-pass-phrase-1,office:long-pass-phrase-2` |
   | `GITHUB_TOKEN` | the token from step 3 |
   | `GITHUB_REPO` | `mmelnikov2/BigJamiaca` (only needed if the repo is renamed) |

   Use long passwords. Names can't contain `:` or `,` and passwords can't contain `,`.
5. **Redeploy** (Deploys, Trigger deploy) so the function picks up the settings.
6. **Test.** Open `https://<your-site>.netlify.app/admin.html`, log in, change a seat count, press Publish, wait a minute, and reload the site.

## Day to day
- Staff open `/admin.html` on a phone or PC, make changes, and press **Publish changes**. Nothing goes live until they publish.
- To add or remove a staff login, edit `ADMIN_USERS` in Netlify and redeploy. Changing it logs everyone out.
- To undo a bad change, revert that commit on GitHub ("Site content update by ...").

## Going live on bigjamaica.com later
In Netlify, Domain management, add the domain and follow the DNS steps. HTTPS is automatic. Do this only after the booking pages have a stable address (see `HANDOFF.md`), because the "Reserve" buttons point at `www.bigjamaica.com/booknow/...` today.

## Limits to know
- Every Publish is a deploy. Netlify's free plan has monthly usage limits, so check your plan's current numbers. A few publishes a day is tiny.
- Two people publishing at the same moment: the last one wins. Git history keeps both versions.
- Logins are shared-secret passwords stored in Netlify settings. That's fine for a few staff. It is not a full user-account system with password reset.
- Contact, charter and gift card forms are still demos. They need Netlify Forms or the current developer's backend.
- This function was tested against a simulated GitHub, not the live service. Step 6 is the real test.

## Password on the whole site (private preview)
`netlify/edge-functions/gate.js` puts one password box in front of everything: pages, photos, `content.json` and the admin page. The check runs on Netlify before any file is served, so a direct file address is blocked too.

- **Turn on:** in Netlify, Environment variables, add `SITE_PASSWORD` with the shared password as the value. Then Deploys, Trigger deploy.
- **Change the password:** edit `SITE_PASSWORD` and redeploy. Everyone has to enter the new one.
- **Turn off (at launch):** delete `SITE_PASSWORD` and redeploy. The site is public again.

Visitors enter it once per device and are remembered for 30 days. The admin page keeps its own staff login behind the gate, so staff enter two passwords: the site one, then their own.

Limits: it is one shared password, so anyone it's forwarded to gets in. Wrong guesses are slowed down but not locked out, so use a long one (four random words). It does not apply to the local preview on your PC.
