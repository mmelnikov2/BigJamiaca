// Password gate for the whole site (pages, photos, data files, admin).
// Runs on Netlify's edge BEFORE any file is served, so nothing can be read without the password.
//
//   THE ONE SWITCH: the SITE_PASSWORD setting in Netlify.
//     set    -> every visitor must enter that password once (remembered 30 days)
//     absent -> gate is off, the site is public (do this at launch)
//
// One shared password for everybody. The admin page keeps its own staff login behind this gate.

const COOKIE = "bj_gate";
const DAYS = 30;
const enc = new TextEncoder();

function getEnv(name) {
  try { return (globalThis.Netlify && Netlify.env.get(name)) || ""; } catch (e) { return ""; }
}

async function hmac(keyText, msg) {
  const key = await crypto.subtle.importKey("raw", enc.encode("bj-gate|" + keyText), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
  return Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Compare without leaking where the strings differ.
async function same(a, b, pw) {
  const [x, y] = await Promise.all([hmac(pw, "cmp|" + a), hmac(pw, "cmp|" + b)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return d === 0;
}

async function validCookie(request, pw) {
  const m = (request.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + COOKIE + "=(\\d+)\\.([0-9a-f]{64})"));
  if (!m) return false;
  if (Number(m[1]) < Date.now()) return false;
  return same(m[2], await hmac(pw, "ok|" + m[1]), pw);
}

function safeNext(n) {
  return typeof n === "string" && /^\/(?!\/)[^\\\r\n]*$/.test(n) && !n.startsWith("/__gate") ? n : "/";
}

function page(wrong) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Private preview</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1b2e;font:16px/1.5 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#0b1b2e;padding:16px}
form{background:#fff;border-radius:16px;padding:28px;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
h1{margin:0 0 4px;font-size:22px}p{margin:0 0 18px;color:#52627a;font-size:14px}
label{display:block;font-weight:700;font-size:14px;margin-bottom:6px}
input{width:100%;font:inherit;padding:12px 14px;border:2px solid #cfd8e3;border-radius:10px}
input:focus{outline:none;border-color:#0b1b2e}
button{margin-top:14px;width:100%;font:inherit;font-weight:800;color:#fff;background:#ff6a1a;border:0;border-radius:10px;padding:13px;cursor:pointer}
.err{color:#b91c1c;font-weight:700;font-size:14px;margin:10px 0 0}
.tag{display:inline-block;background:#c81e1e;color:#fff;font-weight:900;font-size:11px;letter-spacing:2px;padding:2px 8px;border-radius:4px;margin-bottom:12px}
</style></head><body>
<form method="post" action="/__gate" autocomplete="off">
<span class="tag">DRAFT</span>
<h1>Private preview</h1>
<p>This site is not public yet. Enter the password you were given.</p>
<label for="p">Password</label>
<input id="p" name="password" type="password" required autofocus autocomplete="current-password">
<input type="hidden" name="next" id="n" value="/">
${wrong ? '<div class="err" role="alert">Wrong password. Try again.</div>' : ""}
<button type="submit">Open the site</button>
</form>
<script>try{var q=new URLSearchParams(location.search).get("next");document.getElementById("n").value=location.pathname==="/__gate"?(q||"/"):location.pathname+location.search+location.hash}catch(e){}</script>
</body></html>`;
  return new Response(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" },
  });
}

export default async function gate(request) {
  const pw = getEnv("SITE_PASSWORD");
  if (!pw) return; // gate off: serve the site as usual

  if (await validCookie(request, pw)) return; // already let in

  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname === "/__gate") {
    let given = "", next = "/";
    try {
      const form = await request.formData();
      given = String(form.get("password") || "");
      next = safeNext(String(form.get("next") || "/"));
    } catch (e) {}
    if (given && (await same(given, pw, pw))) {
      const exp = Date.now() + DAYS * 864e5;
      const value = exp + "." + (await hmac(pw, "ok|" + exp));
      return new Response(null, {
        status: 303,
        headers: {
          location: next,
          "cache-control": "no-store",
          "set-cookie": `${COOKIE}=${value}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return page(true);
  }
  return page(false);
}

export const config = { path: "/*" };
