
/* ---------- language switch: ENG (default) / DEU ---------- */
var REV = {}; Object.keys(DE).forEach(function (k) { REV[DE[k]] = k; });
var lang = 'en';
function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
function toLang(t) { var en = REV[t] || t; return lang === 'de' ? (DE[en] || en) : en; }
function formTextOf(el) { return norm(el._vis ? (el._text || '') : el.textContent); }
function applyLang(animate) {
  document.documentElement.lang = lang === 'de' ? 'de' : 'en';
  /* texts that form themselves from symbols */
  $$('[data-form]').forEach(function (el) {
    if (el.closest('#landing')) return;   /* the landing screen always stays in English */
    var cur = formTextOf(el); if (!cur) return;
    var next = toLang(cur); if (next === cur) return;
    var was = !!el._vis;
    resetForm(el, next);
    if (was) {
      prepForm(el);
      var isP = el.getAttribute('data-form') === 'p';
      el._ctl = formText(el._vis, el._text, { duration: isP ? 700 : 500, delay: 0, autostart: false });
      var r = el.getBoundingClientRect(), inView = el.offsetParent && r.bottom > 0 && r.top < innerHeight;
      if (animate && inView) el._ctl.start(); else if (formIO && !inView) formIO.observe(el); else el._ctl.finish();
    }
  });
  /* every other text */
  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
    var p = n.parentElement; if (!p || p.closest('script,style,.ns-sr,.ns-vis,[data-form],#landing')) return 2;
    return /[A-Za-zÀ-ÿ]/.test(n.nodeValue) ? 1 : 2; } }), n, list = [];
  while ((n = w.nextNode())) list.push(n);
  list.forEach(function (node) {
    var raw = node.nodeValue, t = norm(raw), next = toLang(t); if (next === t) return;
    var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    node.nodeValue = lead + next + trail;
  });
  /* labels for screen readers */
  $$('[aria-label]').forEach(function (el) {
    if (el.closest('#landing')) return;
    var t = el.getAttribute('aria-label'), next = toLang(t);
    if (next !== t) el.setAttribute('aria-label', next);
  });
  var lt = $('#lang-toggle');
  if (lt) { lt.setAttribute('aria-checked', lang === 'de' ? 'true' : 'false'); lt.setAttribute('aria-label', lang === 'de' ? 'Sprache: Deutsch' : 'Language: English'); }
}
(function () {
  var lt = $('#lang-toggle'); if (!lt) return;
  try { if (localStorage.getItem('ns-lang') === 'de') { lang = 'de'; applyLang(false); } } catch (e) { }
  lt.addEventListener('click', function () {
    lang = lang === 'de' ? 'en' : 'de';
    try { localStorage.setItem('ns-lang', lang); } catch (e) { }
    applyLang(true);
  });
})();
/* labels set later by the page (menu open/close, current page) follow the chosen language */
if (window.MutationObserver) new MutationObserver(function (ms) {
  if (lang !== 'de') return;
  ms.forEach(function (m) { var el = m.target, t = el.getAttribute('aria-label'); if (!t) return; var nx = toLang(t); if (nx !== t) el.setAttribute('aria-label', nx); });
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-label'] });
