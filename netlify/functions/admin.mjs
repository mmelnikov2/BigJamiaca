// Staff admin API for the Big Jamaica site (Netlify Function, no dependencies).
// Saves content by committing content.json (and uploaded photos) to the GitHub repo;
// Netlify then redeploys the site automatically (about a minute).
//
// Environment variables (Netlify > Site configuration > Environment variables):
//   ADMIN_USERS    "name:password,name2:password2"  (one login per staff member)
//   GITHUB_TOKEN   fine-grained token with Contents read/write on this one repo
//   GITHUB_REPO    "owner/repo"      (optional, default below)
//   GITHUB_BRANCH  branch to commit to (optional, default "main")
import crypto from "node:crypto";

const REPO = () => process.env.GITHUB_REPO || "mmelnikov2/BigJamiaca";
const BRANCH = () => process.env.GITHUB_BRANCH || "main";
const SESSION_HOURS = 12;
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

function users() {
  const out = new Map();
  for (const pair of (process.env.ADMIN_USERS || "").split(",")) {
    const i = pair.indexOf(":");
    if (i > 0) out.set(pair.slice(0, i).trim().toLowerCase(), pair.slice(i + 1));
  }
  return out;
}
const secret = () => crypto.createHash("sha256").update("bj|" + (process.env.ADMIN_USERS || "") + "|" + (process.env.GITHUB_TOKEN || "")).digest();
const sign = (data) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");
const safeEqual = (a, b) => {
  const x = crypto.createHash("sha256").update(String(a)).digest(), y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};
function makeToken(user) {
  const body = Buffer.from(JSON.stringify({ u: user, e: Date.now() + SESSION_HOURS * 3600e3 })).toString("base64url");
  return body + "." + sign(body);
}
function readToken(req) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  const [body, sig] = t.split(".");
  if (!body || !sig || !safeEqual(sig, sign(body))) return null;
  try { const p = JSON.parse(Buffer.from(body, "base64url").toString()); return p.e > Date.now() ? p.u : null; } catch { return null; }
}

async function gh(path, init = {}) {
  const r = await fetch(`https://api.github.com/repos/${REPO()}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: "application/vnd.github+json", "user-agent": "site-admin", "content-type": "application/json" },
  });
  if (!r.ok) throw new Error(`GitHub ${r.status} on ${path.split("?")[0]}`);
  return r.json();
}

// Pull embedded photos (data URLs) out of the content and turn them into repo files.
function extractImages(content) {
  const files = [];
  const take = (obj, key) => {
    const v = obj && obj[key];
    const m = typeof v === "string" && /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(v);
    if (!m) return;
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > MAX_IMAGE_BYTES) throw new Error("A photo is too large");
    const path = `images/uploads/${crypto.createHash("sha1").update(buf).digest("hex").slice(0, 16)}.${m[1] === "jpeg" ? "jpg" : m[1]}`;
    files.push({ path, base64: m[2] });
    obj[key] = path;
  };
  for (const p of content.photos || []) take(p, "src");
  for (const r of content.reports || []) take(r, "img");
  return files;
}

function validate(c) {
  if (!c || typeof c !== "object") return "Missing content";
  for (const k of ["trips", "sailings", "reports", "photos", "charters"]) if (!Array.isArray(c[k])) return `content.${k} must be a list`;
  if (c.trips.length === 0) return "Refusing to save an empty trip list";
  if (c.sailings.some((s) => !/^\d{4}-\d{2}-\d{2}$/.test(s.d || ""))) return "A sailing has a bad date";
  return null;
}

async function commit(content, files, user) {
  const ref = await gh(`/git/ref/heads/${BRANCH()}`);
  const base = await gh(`/git/commits/${ref.object.sha}`);
  const tree = [{ path: "content.json", mode: "100644", type: "blob", content: JSON.stringify(content, null, 1) + "\n" }];
  for (const f of files) {
    const blob = await gh(`/git/blobs`, { method: "POST", body: JSON.stringify({ content: f.base64, encoding: "base64" }) });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  const t = await gh(`/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
  if (t.sha === base.tree.sha) return { sha: ref.object.sha, unchanged: true };
  const c = await gh(`/git/commits`, { method: "POST", body: JSON.stringify({ message: `Site content update by ${user} (admin page)`, tree: t.sha, parents: [ref.object.sha] }) });
  await gh(`/git/refs/heads/${BRANCH()}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha }) });
  return { sha: c.sha, unchanged: false };
}

export default async function handler(req) {
  if (req.method === "GET") return json(200, { ok: true, configured: users().size > 0 && !!process.env.GITHUB_TOKEN });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!users().size || !process.env.GITHUB_TOKEN) return json(503, { error: "Admin is not set up yet (missing ADMIN_USERS or GITHUB_TOKEN)." });
  let body;
  try { body = await req.json(); } catch { return json(400, { error: "Bad request" }); }

  if (body.action === "login") {
    const name = String(body.user || "").trim().toLowerCase();
    const pw = users().get(name);
    const ok = safeEqual(body.password || "", pw ?? crypto.randomUUID()) && pw !== undefined;
    if (!ok) { await new Promise((r) => setTimeout(r, 800)); return json(401, { error: "Wrong name or password" }); }
    return json(200, { token: makeToken(name), user: name, hours: SESSION_HOURS });
  }

  const user = readToken(req);
  if (!user) return json(401, { error: "Please log in again" });

  if (body.action === "save") {
    const content = body.content;
    const bad = validate(content);
    if (bad) return json(400, { error: bad });
    try {
      const files = extractImages(content);
      const res = await commit(content, files, user);
      return json(200, { ok: true, content, commit: res.sha, unchanged: res.unchanged, photosSaved: files.length });
    } catch (e) {
      return json(502, { error: String(e.message || e) });
    }
  }
  return json(400, { error: "Unknown action" });
}
