# DESIGN-QUALITY-REPORT — ديزاين سكِل (Jazan)

تقرير الجودة لموقع استوديو **Design Skill** للتصميم الداخلي في جازان. يوثّق المهارات المُستدعاة، مخرجاتها، وكيف طُبّقت قواعد `DESIGN-SKILLS-RULES.md`.

---

## 1) المهارات المُستدعاة وكيف طُبّقت

| المهارة | الاستدعاء | الأثر على هذا الموقع |
|---|---|---|
| **ui-ux-pro-max** | `search.py "interior design studio modern architectural" --design-system` + Skill tool | تبنّيت النمط **Exaggerated Minimalism** (typography ضخمة، تباين عالٍ، negative space)، ولوحة الـ warm-stone، وقائمة الفحص قبل التسليم. |
| **design-taste-frontend** | Skill tool | Design read معلن؛ أقفلت accent واحد، نظام radius واحد، استبعدت AI-tells (لا purple، لا 3 كروت متطابقة، لا fake screenshots، لا em-dash، لا scroll cues، لا locale strips). |
| **emil-design-eng** | Skill tool | منحنيات easing مخصّصة، `scale(.97)` عند الضغط، دخول من `translateY` لا من `scale(0)`، احترام `prefers-reduced-motion`، عنصر/عنصران متحركان لكل مشهد. |
| **high-end-visual-design (قاعدة داخلية)** | قواعد §10 من RULES | نظام ظلال موحّد (sm/md/lg مائل لِلون الخلفية)، مسافات 4/8، كروت تُستخدم حيث ترفع الهرمية فقط. |

> ملاحظة جندرية: كل الأفعال محايدة (اطلب، تواصل، شاهد، احكِ لنا) — لا احجزي/لكِ.

---

## 2) مخرجات ui-ux-pro-max (design-system)

- **Pattern:** Hero-Centric — هيرو مهيمن + CTA واحد بارز + CTA ثانوي.
- **Style:** Exaggerated Minimalism (Best for: architecture, luxury, editorial).
- **Palette (مُكيَّفة):** primary stone `#78716C` → طبّقته كـ `--sand/--ink-soft`، background warm `#FAF5F2` → `#F4EFE8`, foreground `#0F172A` → `#23211E` (فحمي أدفأ)، accent الافتراضي كان كهرماني `#D97706` لكن البريف طلب **terracotta**، فاخترت `#B85C38` (طيني مكتوم) وقفلته على كامل الصفحة.
- **Typography:** التوصية كانت Cinzel/Josefin (لاتيني)؛ بما أن الموقع عربي RTL استبدلتها بزوج عربي مكافئ بنفس المزاج: **Tajawal 800–900** للعرض + **IBM Plex Sans Arabic** للجسم (كلاهما مذكور في البريف).
- **Key effect:** عناوين `clamp()` ضخمة، `letter-spacing` سالب، مساحات واسعة.

---

## 3) قرارات UI/UX الأساسية

- **هيرو:** Asymmetric Split (نص + صورة 4:5) بدل التوسيط — يلتزم بـ ANTI-CENTER عند VARIANCE>4. العنوان سطران، subhead < 20 كلمة، CTA ظاهر بلا تمرير.
- **معرض الأعمال:** بُني بـ **CSS architectural tiles** (خطوط، قوس، شبكة، نقطة لون) بدل صور المنافسين — يطبّق "إذا الصور قليلة، استند لأقسام CSS أنيقة".
- **النموذج:** label فوق الحقل، خطأ تحت الحقل مباشرة، `aria-live` على الأخطاء، حالات focus واضحة، نوع input دلالي (tel)، disclaimer واضح أنه تجريبي.
- **تنوّع التخطيط:** 8 أقسام بأكثر من 4 عائلات layout مختلفة (split هيرو / trust bar / services grid / CSS gallery / why split sticky / form split / location split / center CTA) — لا تكرار لعائلة.
- **Eyebrow restraint:** eyebrow واحد فقط في كامل الصفحة (الهيرو) — تحت السقف المسموح.

## 4) سبب الألوان والخطوط

- **الفحمي + الرملي + الأوف-وايت** يعكس الحجر والإسمنت والخشب الطبيعي — مفردات معمارية تناسب التصميم الداخلي وتوحي بالفخامة الهادئة دون صخب.
- **لمسة الطيني (terracotta)** الواحدة هي accent القصة: تظهر في الأزرار والأيقونات والأرقام فقط، مقفولة على كامل الصفحة (Color Consistency Lock).
- **Tajawal الثقيل** يعطي حضورًا معماريًا للعناوين؛ **IBM Plex Sans Arabic** نظيف ومريح للقراءة في الجسم.

## 5) تطبيق الحركة (Emil/Hooked)

- easing مخصّص: `--ease-out: cubic-bezier(.23,1,.32,1)` للدخول، و`--ease-io` للحركة المستمرة.
- كل الأزرار/الـ FABs: `transform: scale(.97)` عند `:active` خلال 160ms (ردّ فعل فوري).
- scroll-reveal عبر `IntersectionObserver` + **fallback مزدوج** (else branch + مؤقّت 2.5s) يضمن ألا يبقى أي محتوى مخفيًا.
- القائمة والتوست يدخلان من `translateY` + opacity، لا من `scale(0)`.
- `transform/opacity` فقط في كل الانتقالات (أداء GPU، لا CLS).

## 6) إمكانية الوصول (Accessibility)

- **تباين مُتحقَّق منه عدديًا (WCAG):** ink/bg 14.0 · ink-soft/bg **7.1 (AAA)** · sand/ink 8.5 · accent-deep/bg (eyebrow) 5.4 · white/accent (زر) **4.54 (AA)** · ink-soft/white (نموذج) 8.1. كل الأزواج ≥ 4.5:1.
- HTML سيمانتيك: `header/nav/main/section/footer`، تدرّج h1→h2→h3 بلا قفز، skip-link.
- كل `<img>` لها alt عربي وصفي + `width/height` (لا CLS) + `loading="lazy"` لغير الهيرو + `decoding="async"`؛ الهيرو `fetchpriority="high"`.
- كل زر أيقونة (burger, close, FABs) له `aria-label`؛ القائمة `role="dialog" aria-modal`؛ التوست `role="status" aria-live="polite"`.
- `:focus-visible` بـ outline 3px على كل عنصر تفاعلي. أهداف اللمس ≥ 48px.
- `prefers-reduced-motion: reduce` يوقف كل الحركة والـ reveal يظهر فورًا.

## 7) Layout & Responsive

- Mobile-first؛ breakpoints 560/900/1100؛ `min-h: 100dvh` للقائمة (لا 100vh).
- **قائمة الجوال = overlay ملء الشاشة** `100vw/100dvh` خلفية صلبة `--ink` + زر X واضح — متحقَّق بصريًا وباختبار boundingBox.
- **لا تمرير أفقي عند 390px** (اختبار آلي يؤكّد scrollWidth==clientWidth).
- نص الجسم 16px على الجوال؛ الحاوية `max-w:1180px`.

## 8) Taste / Impeccable (اختبار القبول)

- هل يبدو فاخرًا؟ نعم — لوحة معمارية هادئة، ظلال ناعمة، مساحات تتنفّس.
- سعوديًا مناسبًا؟ نعم — مجالس وصالات، ضيافة، جازان، تقييم قوقل حقيقي.
- يقنع خلال 3 ثوانٍ؟ نعم — العنوان + الصورة + الـ CTA + شارة 4.5 فوق الطية.
- لا يشبه قالبًا مجانيًا؟ نعم — معرض CSS مخصّص، شبكة خدمات بترقيم، هيرو غير متماثل.

## 9) النصوص

- بشرية، سعودية، **محايدة جندريًا**، بلا lorem.
- **لا أسعار مخترعة** — "الأسعار حسب الطلب وحجم المشروع".
- التقييم الوحيد المذكور هو 4.5 (149) من قوقل، بلا شهادات مفبركة.
- **صفر em-dash** في كامل الصفحة.

## 10) نتائج الاختبار
Playwright: **22/22 ناجحة** (mobile 390px + desktop 1440px). انظر `tests/site.spec.ts`.
