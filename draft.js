// DRAFT watermark for every page (site and admin).
// THE ONE SWITCH: set this to false at launch and the watermark disappears everywhere.
window.SITE_DRAFT = true;

// While drafting, Reserve buttons open a demo booking page inside the site instead of the live booking system.
// Follows SITE_DRAFT, so the launch switch above also restores the real booking hand-off.
window.BOOKING_DEMO = window.SITE_DRAFT;

(function () {
  if (!window.SITE_DRAFT) return;
  var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='340' height='240'>" +
    "<text x='170' y='130' text-anchor='middle' transform='rotate(-28 170 120)' " +
    "font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='54' letter-spacing='8' " +
    "fill='rgb(200,30,30)' fill-opacity='0.13' stroke='white' stroke-opacity='0.10' stroke-width='1'>DRAFT</text></svg>";
  function add() {
    var d = document.createElement("div");
    d.id = "draftMark";
    d.setAttribute("aria-hidden", "true");
    // pointer-events:none so it never blocks a tap or click
    d.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;" +
      "background-image:url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\");background-repeat:repeat";
    document.body.appendChild(d);
    var t = document.createElement("div");
    t.setAttribute("aria-hidden", "true");
    t.textContent = "DRAFT";
    t.style.cssText = "position:fixed;top:6px;right:6px;z-index:2147483001;pointer-events:none;" +
      "font:900 12px Arial,sans-serif;letter-spacing:2px;color:#fff;background:#c81e1e;padding:3px 8px;border-radius:4px;opacity:.9";
    document.body.appendChild(t);
  }
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
