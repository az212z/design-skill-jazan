/* Design Skill — Premium Motion Layer (vanilla, guarded, additive).
   Never hides content; every feature is wrapped so a failure is silent. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll progress bar ---------- */
  try {
    var prog = document.createElement("div");
    prog.id = "ds-prog";
    document.body.appendChild(prog);
    var ticking = false;
    function updateProg() {
      var d = document.documentElement;
      var sc = d.scrollTop || document.body.scrollTop || 0;
      var hh = d.scrollHeight - d.clientHeight;
      var p = hh > 0 ? Math.min(sc / hh, 1) : 0;
      prog.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProg); }
    }, { passive: true });
    updateProg();
  } catch (e) {}

  /* ---------- count-up (hero rating badge) ---------- */
  try {
    var badge = document.querySelector(".hero-badge-num");
    if (badge && !reduce) {
      var raw = (badge.textContent || "").trim();
      var to = parseFloat(raw.replace(/[^\d.]/g, ""));
      var dec = (raw.split(".")[1] || "").length;
      if (!isNaN(to)) {
        badge.classList.add("ds-counting");
        var started = false;
        var run = function () {
          if (started) return; started = true;
          var dur = 1300, t0 = null;
          var step = function (t) {
            if (t0 === null) t0 = t;
            var p = Math.min((t - t0) / dur, 1);
            var e = 1 - Math.pow(1 - p, 3);
            badge.textContent = (to * e).toFixed(dec);
            if (p < 1) requestAnimationFrame(step); else badge.textContent = to.toFixed(dec);
          };
          requestAnimationFrame(step);
        };
        if ("IntersectionObserver" in window) {
          var bio = new IntersectionObserver(function (en) {
            en.forEach(function (x) { if (x.isIntersecting) { run(); bio.disconnect(); } });
          }, { threshold: 0.6 });
          bio.observe(badge);
        } else { run(); }
        window.setTimeout(run, 2600); // safety
      }
    }
  } catch (e) {}

  if (reduce) return; /* skip continuous pointer/scroll effects */

  /* ---------- subtle hero image parallax ---------- */
  try {
    var frame = document.querySelector(".hero-visual .hero-frame");
    if (frame) {
      var pTick = false;
      var onP = function () {
        var r = frame.getBoundingClientRect();
        var vh = window.innerHeight || 1;
        if (r.bottom < -40 || r.top > vh + 40) { pTick = false; return; }
        var prog2 = (r.top + r.height / 2 - vh / 2) / vh; /* -0.5..0.5 */
        frame.style.transform = "translateY(" + (prog2 * -18).toFixed(1) + "px)";
        pTick = false;
      };
      window.addEventListener("scroll", function () {
        if (!pTick) { pTick = true; requestAnimationFrame(onP); }
      }, { passive: true });
      onP();
    }
  } catch (e) {}

  /* ---------- magnetic primary buttons (fine pointers only) ---------- */
  try {
    var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      document.querySelectorAll(".btn-primary").forEach(function (btn) {
        btn.addEventListener("mousemove", function (ev) {
          var r = btn.getBoundingClientRect();
          var mx = ev.clientX - (r.left + r.width / 2);
          var my = ev.clientY - (r.top + r.height / 2);
          btn.style.transform = "translate(" + (mx * 0.18).toFixed(1) + "px," + (my * 0.28 - 3).toFixed(1) + "px)";
        });
        btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
      });
    }
  } catch (e) {}
})();
