/* Design Skill - Jazan. Vanilla JS. Guarded; never hides content on error. */
(function () {
  "use strict";

  /* ---------- Full-screen mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");
  var closeBtn = document.getElementById("menu-close");

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(function () { menu.classList.add("open"); });
    if (burger) burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    if (burger) { burger.setAttribute("aria-expanded", "false"); }
    document.body.style.overflow = "";
    window.setTimeout(function () { if (!menu.classList.contains("open")) menu.hidden = true; }, 300);
    if (burger) burger.focus();
  }

  if (burger) burger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("open")) closeMenu();
  });

  /* ---------- Scroll reveal (IntersectionObserver + fallback) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  // Safety fallback: nothing stays hidden after 2.5s
  window.setTimeout(function () {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }, 2500);

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(html) {
    if (!toast) return;
    toast.innerHTML = html;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("show"); });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
      window.setTimeout(function () { toast.hidden = true; }, 320);
    }, 4200);
  }

  /* ---------- Quote form -> WhatsApp + localStorage ---------- */
  var form = document.getElementById("quote-form");
  if (form) {
    var WA = "966553368805";

    function setErr(name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      var box = field ? field.closest(".field") : null;
      var slot = form.querySelector('[data-err="' + name + '"]');
      if (box) box.classList.toggle("invalid", !!msg);
      if (slot) slot.textContent = msg || "";
    }

    function validPhone(v) {
      var digits = (v || "").replace(/\D/g, "");
      return digits.length >= 9 && digits.length <= 13;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var notes = form.notes.value.trim();
      var ok = true;

      if (!name) { setErr("name", "فضلًا اكتب اسمك"); ok = false; } else setErr("name", "");
      if (!validPhone(phone)) { setErr("phone", "رقم جوال غير صحيح"); ok = false; } else setErr("phone", "");
      if (!service) { setErr("service", "اختر الخدمة المطلوبة"); ok = false; } else setErr("service", "");

      if (!ok) {
        var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Save a local demo copy
      try {
        var store = JSON.parse(localStorage.getItem("designskill_quotes") || "[]");
        store.push({ name: name, phone: phone, service: service, notes: notes, at: new Date().toISOString() });
        localStorage.setItem("designskill_quotes", JSON.stringify(store));
      } catch (err) { /* localStorage may be blocked; ignore */ }

      var msg =
        "السلام عليكم، طلب تصميم داخلي من موقع ديزاين سكل:%0A" +
        "• الاسم: " + encodeURIComponent(name) + "%0A" +
        "• الجوال: " + encodeURIComponent(phone) + "%0A" +
        "• الخدمة: " + encodeURIComponent(service) + "%0A" +
        (notes ? "• ملاحظات: " + encodeURIComponent(notes) + "%0A" : "");

      var url = "https://wa.me/" + WA + "?text=" + msg;
      showToast("<strong>تم تجهيز طلبك.</strong> سنفتح واتساب الآن لإرسال الرسالة.");
      window.setTimeout(function () { window.open(url, "_blank", "noopener"); }, 600);
      form.reset();
    });
  }

  /* ---------- Year (footer is static 2026; keep dynamic guard if needed) ---------- */
})();
