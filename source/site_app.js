/* ---------- site app ---------- */
var reduce = REDUCE();
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

/* icons */
function iconSVG(name, scale) {
  var bm = ICON_BITMAPS[name]; if (!bm) return '';
  var rows = bm.split('|'), d = '', y, x, x0, w = rows[0].length, hh = rows.length;
  for (y = 0; y < hh; y++) { x = 0; while (x < w) { if (rows[y].charAt(x) === 'X') { x0 = x; while (x < w && rows[y].charAt(x) === 'X') x++; d += 'M' + x0 + ' ' + y + 'h' + (x - x0) + 'v1h-' + (x - x0) + 'z'; } else x++; } }
  return '<svg class="ns-icon" width="' + w * scale + '" height="' + hh * scale + '" viewBox="0 0 ' + w + ' ' + hh + '" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
}
function paintIcons(root) { $$('[data-icon]', root).forEach(function (el) { el.innerHTML = iconSVG(el.getAttribute('data-icon'), +el.getAttribute('data-scale') || 2); }); }

/* skills content (examples) */
var SKILLS = [
  { group: 'Design', items: [
    { name: 'Sketching and Drawing', level: 9, px: 'skills/sketch_px.png', full: 'skills/sketch.jpg', cap: 'Concept sketch for a HILTI tool accessory', tags: ['Concept sketches', 'Perspective', 'Explaining ideas'],
      text: 'A pencil is still my fastest prototyping tool. I sketch to think, to explain an idea in seconds and to get a whole room looking at the same thing, from first concepts for HILTI to interfaces for firefighters.' },
    { name: 'Design Thinking', level: 8, px: 'celidon/interface_px.png', full: 'celidon/interface.jpg', cap: 'CelidonPRO mask display, shaped with firefighters', tags: ['User needs', 'Ideation', 'Iteration'],
      text: 'Understand the people, frame the real problem, then ideate, build and test, and do it again. It is how the CelidonPRO mask display became simple enough to work under stress, and how every project of mine starts.' }] },
  { group: 'Process', items: [
    { name: 'Research', level: 9, px: 'lock/board_px.png', full: 'lock/board.jpg', cap: 'Use cases from construction site visits for ABUS', tags: ['Interviews', 'Site visits', 'Observation'],
      text: 'I go where the product lives: onto construction sites, into workshops and fire stations. Interviews and observation show what people really need, and sometimes, as with SMART LOCK, that the need is not there yet.' },
    { name: 'Rapid Prototyping', level: 8, px: 'hilti/magazine_px.png', full: 'hilti/magazine.jpg', cap: '3D-printed wire magazine for the HILTI DX 350', tags: ['3D printing', 'Mock-ups', 'User tests'],
      text: 'Prototype early, fail fast. From a 3D-printed wire magazine at HILTI to more than ten models for ecom, I put rough prototypes into real hands as soon as possible, because they teach more than months of planning.' },
    { name: 'Technical Know-how & Understanding', level: 8, px: 'skills/technical_px.png', full: 'skills/technical.jpg', cap: 'Gears in mesh: understanding how things work together', tags: ['Mechanical engineering', 'Testing', 'Materials'],
      text: 'My mechanical engineering degree from RWTH Aachen is the foundation of everything I build. It let me analyse a failing HILTI piston frame by frame, develop the release system of the Sprenger AERO stirrup and wire up the first BACE HUB myself.' }] },
  { group: 'People', items: [
    { name: 'Facilitation & Moderation', level: 8, px: 'skills/stage_px.png', full: 'skills/stage.jpg', cap: 'Moderating a panel discussion at CONF3RENCE in Dortmund', tags: ['Main stages', 'C-level events', 'Workshops'],
      text: 'At the Economic Development Agency of the City of Dortmund I regularly host large events with C-level guests, moderating on main stages in front of big audiences. Before that I designed and led workshops that brought different teams to the same table, from ideation with NOTO DESIGN to cross-department sessions at HILTI and user tests with firefighters.' },
    { name: 'Curiosity', level: 10, px: 'skills/universe_px.png', full: 'skills/universe.jpg', cap: 'A spiral galaxy: there is always more to discover', tags: ['Learning', 'New fields', 'Adventures'],
      text: 'Gas measurement, machine learning, fire service technology: I teach myself whatever a project needs. Curiosity took me from mechanical engineering to design, from Aachen to Denmark, and it is what I bring to every new challenge.' }] }
];
function buildSkills() {
  var host = $('#skill-list'), html = '', n = 0;
  SKILLS.forEach(function (g, gi) {
    html += '<div class="block"><div class="ns-section"><span class="ns-section-no mono-12">' + String(gi + 2).padStart(2, '0') + '</span><span class="ns-section-label mono-12"><i class="ns-section-mark"></i>' + g.group + '</span></div>';
    g.items.forEach(function (s) {
      n++;
      var no = String(n).padStart(2, '0'), segs = '';
      for (var i = 0; i < 10; i++) segs += '<i class="ns-seg' + (i < s.level ? ' is-on' : '') + '"></i>';
      html += '<article class="g12 skill' + (n % 2 ? '' : ' skill--flip') + '">' +
        '<figure class="ns-project sk-img"><div class="ns-project-frame" data-cursor-reveal data-surface="dark" style="aspect-ratio:4/3" tabindex="0">' +
        '<canvas class="ns-project-cv" data-static data-src="images/' + s.px + '" data-resolved="images/' + s.full + '" role="img" aria-label="' + s.cap + '"></canvas>' +
        '<canvas class="reveal-cv" data-reveal="images/' + s.full + '" aria-hidden="true"></canvas></div>' +
        '<figcaption class="ns-project-cap mono-12"><span class="ns-project-no">' + no + '</span><span class="ns-project-name">' + s.cap + '</span></figcaption></figure>' +
        '<div class="sk-body"><p class="mono-12 muted">' + no + ' / ' + g.group + '</p>' +
        '<h2 class="display-32" data-form>' + s.name + '</h2>' +
        '<div class="ns-skill" role="img" aria-label="' + s.name + ': ' + s.level + ' of 10"><span class="ns-skill-name mono-12">Level</span><span class="ns-skill-bar" aria-hidden="true">' + segs + '</span><span class="ns-skill-val mono-12" aria-hidden="true">' + String(s.level).padStart(2, '0') + '/10</span></div>' +
        '<p class="body-16" data-form="p">' + s.text + '</p>' +
        '<ul class="tags mono-12">' + s.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div></article>';
    });
    html += '</div>';
  });
  host.innerHTML = html;
}

/* text formation */
var formIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { formIO.unobserve(e.target); if (e.target._ctl) e.target._ctl.start(); } });
}, { threshold: 0.1 }) : null;
function prepForm(el) {
  if (el._vis) return;
  el._text = el.textContent.replace(/\s+/g, ' ').trim();
  el.textContent = '';
  var sr = document.createElement('span'); sr.className = 'ns-sr'; sr.textContent = el._text;
  var vis = document.createElement('span'); vis.className = 'ns-vis'; vis.setAttribute('aria-hidden', 'true');
  el.appendChild(sr); el.appendChild(vis); el._vis = vis; el.classList.add('ns-text');
}
function playForms(root) {
  $$('[data-form]', root).forEach(function (el) {
    prepForm(el);
    if (el._ctl) el._ctl.cancel();
    var isP = el.getAttribute('data-form') === 'p';
    el._ctl = formText(el._vis, el._text, { duration: isP ? 1200 : 800, delay: +el.getAttribute('data-delay') || 0, autostart: false });
    if (formIO) formIO.observe(el); else el._ctl.start();
  });
}

/* project images */
var touch = false; try { touch = window.matchMedia('(hover: none)').matches; } catch (e) { }

/* mouse trail: small red pixels mark where the mouse went; they stay on the page (scroll with it) until the page changes */
var trail = (function () {
  var cv = document.createElement('canvas'), ctx = cv.getContext('2d'), CELL = 18, MAX = 40000, on = false, COLOR = '#FF002C';
  var cells = [], seen = Object.create(null), last = null, dpr = 1, W = 0, H = 0, queued = false, boxes = [], boxTimer = 0;
  /* text line boxes (page coordinates) of the visible page: the trail passes behind them, so no pixel is laid there */
  function measure() {
    boxes = []; var root = document.querySelector('.view:not([hidden])'); if (!root) return;
    var sx = scrollX, sy = scrollY, r = document.createRange(), pad = 3;
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return /\S/.test(n.nodeValue) ? 1 : 2; } }), n, rs, i;
    while ((n = tw.nextNode())) { r.selectNodeContents(n); rs = r.getClientRects();
      for (i = 0; i < rs.length; i++) if (rs[i].width && rs[i].height) boxes.push(rs[i].left + sx - pad, rs[i].top + sy - pad, rs[i].right + sx + pad, rs[i].bottom + sy + pad); }
  }
  function remeasure() { clearTimeout(boxTimer); [0, 700, 1600, 3200].forEach(function (t) { setTimeout(measure, t); }); }
  function onText(gx, gy) {
    var x0 = gx * CELL, y0 = gy * CELL, x1 = x0 + CELL, y1 = y0 + CELL;
    for (var i = 0; i < boxes.length; i += 4) if (x1 > boxes[i] && x0 < boxes[i + 2] && y1 > boxes[i + 1] && y0 < boxes[i + 3]) return true;
    return false;
  }
  cv.className = 'trail-canvas'; cv.setAttribute('aria-hidden', 'true');
  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); redraw();
  }
  function dot(gx, gy, sx, sy) {   /* device-pixel snapped, crisp square */
    var x0 = Math.round((gx * CELL - sx) * dpr), y0 = Math.round((gy * CELL - sy) * dpr);
    var x1 = Math.round(((gx + 1) * CELL - sx) * dpr), y1 = Math.round(((gy + 1) * CELL - sy) * dpr);
    if (x1 < 0 || y1 < 0 || x0 > cv.width || y0 > cv.height) return;
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  function redraw() {
    queued = false; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = COLOR;
    var sx = scrollX, sy = scrollY; for (var i = 0; i < cells.length; i += 2) dot(cells[i], cells[i + 1], sx, sy);
  }
  function add(gx, gy) {
    var k = gx + ',' + gy; if (seen[k]) return; seen[k] = 1;
    if (onText(gx, gy)) return;
    if (cells.length >= MAX * 2) return;
    cells.push(gx, gy); ctx.fillStyle = COLOR; dot(gx, gy, scrollX, scrollY);
  }
  function move(e) {
    if (!on) return;
    var de = document.documentElement;
    if (de.classList.contains('landing-on') || de.classList.contains('pp-open') || de.classList.contains('menu-open')) { last = null; return; }
    var gx = Math.floor((e.clientX + scrollX) / CELL), gy = Math.floor((e.clientY + scrollY) / CELL);
    if (!last) { add(gx, gy); last = [gx, gy]; return; }
    /* connect the jump between two mouse events so the line stays continuous */
    var x = last[0], y = last[1], dx = Math.abs(gx - x), dy = -Math.abs(gy - y), stx = x < gx ? 1 : -1, sty = y < gy ? 1 : -1, err = dx + dy, n = 0;
    if (dx > 400 || -dy > 400) { add(gx, gy); last = [gx, gy]; return; }
    while (n++ < 900) { add(x, y); if (x === gx && y === gy) break; var e2 = 2 * err; if (e2 >= dy) { err += dy; x += stx; } if (e2 <= dx) { err += dx; y += sty; } }
    last = [gx, gy];
  }
  function clear() { cells = []; seen = Object.create(null); last = null; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); remeasure(); }
  function init() {
    var tg = document.getElementById('trail-toggle');
    if (touch) { if (tg) tg.hidden = true; return; }
    document.body.appendChild(cv); size();
    if (tg) tg.addEventListener('click', function () {
      on = !on; last = null; tg.setAttribute('aria-checked', on ? 'true' : 'false');
      if (!on) clear();
    });
    addEventListener('resize', function () { size(); remeasure(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(redraw); } }, { passive: true });
    addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') move(e); }, { passive: true });
    document.addEventListener('mouseleave', function () { last = null; });
  }
  return { init: init, clear: clear };
})();
var imgIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
  es.forEach(function (e) { var c = e.target._pix; if (!c) return; if (e.isIntersecting) c.resolve(); else c.reset(); });
}, { threshold: 0.6 }) : null;
function initImages(root) {
  $$('canvas[data-src]', root).forEach(function (cv) {
    if (cv._pix) { cv._pix.render(); return; }
    var frame = cv.closest('.ns-project-frame'), fig = cv.closest('.ns-project') || frame;
    var c = pixelImage(cv, { src: cv.getAttribute('data-src'), resolvedSrc: cv.getAttribute('data-resolved') || undefined, onLevel: function (l, r) { fig.classList.toggle('is-resolved', r); } });
    cv._pix = c; frame._pix = c;
    if (cv.hasAttribute('data-static')) return;
    if (touch && imgIO) imgIO.observe(frame);
    else {
      frame.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') c.resolve(); });
      frame.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') c.reset(); });
      frame.addEventListener('focus', function () { c.resolve(); });
      frame.addEventListener('blur', function () { c.reset(); });
    }
  });
}
/* colour reveal under the cursor square */
buildSkills();
$$('canvas[data-reveal]').forEach(function (rc) { pixelReveal(rc.closest('.ns-project-frame'), rc, rc.getAttribute('data-reveal')); });

/* parallax: images move slower than text */
if (!reduce) {
  Ticker.add(function () {
    if (window.innerWidth < 768) return;
    var vh = window.innerHeight;
    $$('.view:not([hidden]) [data-parallax]').forEach(function (f) {
      var r = f.parentNode.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var mid = r.top + r.height / 2 - vh / 2;
      f.style.transform = 'translate3d(0,' + (-mid * +f.getAttribute('data-parallax')).toFixed(1) + 'px,0)';
    });
  }, 60);
}

/* routing between the four pages */
/* jump to the very top instantly (the page uses smooth scrolling, which can be interrupted while views switch) */
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { }
function toTop() {
  var de = document.documentElement, prev = de.style.scrollBehavior;
  de.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); de.scrollTop = 0; document.body.scrollTop = 0;
  requestAnimationFrame(function () { window.scrollTo(0, 0); de.style.scrollBehavior = prev; });
}
/* clicking the link of the page you are already on (menu, footer) also starts it at the top */
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('.ns-nav, .foot-nav a') : null;
  if (a && current && a.getAttribute('href') === '#' + current) setTimeout(toTop, 0);
});
var VIEWS = ['portfolio', 'personal-information', 'skills', 'contact', 'disclaimer'], current = null;
function show(v, anchor) {
  if (VIEWS.indexOf(v) < 0) v = 'portfolio';
  if (v !== current) {
    VIEWS.forEach(function (id) { $('#v-' + id).hidden = id !== v; });
    current = v;
    trail.clear();
    $$('.ns-nav, .foot-nav a').forEach(function (a) { if (a.getAttribute('href') === '#' + v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var pi = $('#page-icon'), names = { 'portfolio': ['book', 'Portfolio'], 'personal-information': ['person', 'Personal Information'], 'skills': ['bars', 'Skills'], 'contact': ['mail', 'Contact'], 'disclaimer': ['eye', 'Disclaimer'] };
    if (pi && names[v]) {
      pi.setAttribute('aria-label', 'Current page: ' + names[v][1]);
      pi.classList.add('is-swap');
      setTimeout(function () { pi.innerHTML = iconSVG(names[v][0], 2); pi.classList.remove('is-swap'); }, reduce ? 0 : 160);
    }
    var view = $('#v-' + v);
    initImages(view);
    playForms(view);
    toTop();
  }
  if (anchor) { var t = document.getElementById(anchor); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
}

/* menu */
var menuOpen = false, burger = $('#burger');
function setMenu(open) {
  menuOpen = open;
  $('#menu').hidden = !open; $('#scrim').hidden = !open;
  $('#bar').classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  var bi = $('#burger-icon'); bi.setAttribute('data-icon', open ? 'close' : 'burger'); bi.innerHTML = iconSVG(open ? 'close' : 'burger', 2);
  document.documentElement.classList.toggle('menu-open', open);
  if (open) { playForms($('#menu')); var first = $('#menu .ns-nav'); if (first) first.focus({ preventScroll: true }); }
  else burger.focus({ preventScroll: true });
}
burger.addEventListener('click', function () { setMenu(!menuOpen); });
$('#scrim').addEventListener('click', function () { setMenu(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) setMenu(false); });

/* links: page tokens switch views, other anchors scroll */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
  var tok = a.getAttribute('href').slice(1);
  e.preventDefault();
  if (a.hasAttribute('data-open')) { openProject(a.getAttribute('data-open')); return; }
  if (menuOpen) setMenu(false);
  if (tok === 'top' || tok === 'main') { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
  if (VIEWS.indexOf(tok) >= 0) { show(tok); try { history.replaceState(null, '', '#' + tok); } catch (err) { } return; }
  show(current, tok);
});

/* contact: copy + placeholder form */
$$('[data-copy]').forEach(function (b) {
  b.addEventListener('click', function () {
    var el = document.getElementById(b.getAttribute('data-copy')), txt = el.textContent;
    var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
    try { navigator.clipboard.writeText(txt).then(done, function () { selectText(el); }); } catch (err) { selectText(el); }
  });
});
function selectText(el) { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
if ($('#cform')) $('#cform').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target, note = $('#form-note');
  if (!f.checkValidity()) { note.textContent = 'Please fill in name, a valid email and a message.'; note.classList.add('warn'); return; }
  note.classList.remove('warn');
  note.textContent = 'Placeholder form: nothing was sent. Connect a mail service to make it live.';
});

/* boot */

paintIcons(document);
pixelOverlay({});
cursor({ imageSelector: '.ns-project-frame:not(#pp-frame), [data-cursor="image"]' });   /* no square on the project page: its images resolve fully on hover */
var start = (location.hash || '').slice(1);
var landingOn = !start || start === 'portfolio';
if (landingOn) { $('#landing').hidden = false; document.documentElement.classList.add('landing-on'); }
trail.init();
/* after 10 s on the portfolio page, a quiet red hint points at the mouse-trail toggle (once per visit) */
(function () {
  var hint = $('#trail-hint'), tg = $('#trail-toggle'); if (!hint || !tg || touch) return;
  var t = 0, shown = false, done = false, de = document.documentElement;
  function hide(final) { hint.classList.remove('is-on'); if (final) { done = true; setTimeout(function () { hint.hidden = true; }, 600); } }
  tg.addEventListener('click', function () { hide(true); });
  var iv = setInterval(function () {
    if (done) { clearInterval(iv); return; }
    var ok = current === 'portfolio' && !de.classList.contains('landing-on') && !de.classList.contains('pp-open') && tg.getAttribute('aria-checked') !== 'true';
    if (!ok) { if (shown) hide(false); return; }
    if (shown) { if (!hint.classList.contains('is-on')) { hint.hidden = false; requestAnimationFrame(function () { hint.classList.add('is-on'); }); } return; }
    t += 500;
    if (t >= 10000) { shown = true; hint.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { hint.classList.add('is-on'); }); }); }
  }, 500);
})();
show(VIEWS.indexOf(start) >= 0 ? start : 'portfolio');
if (landingOn) playForms($('#landing'));
window.addEventListener('hashchange', function () { var t = (location.hash || '').slice(1); if (VIEWS.indexOf(t) >= 0) show(t); });

/* name hover: full-width solid blue band behind NICO SOBALLA, text turns white */
(function () {
  var el = $('.hero-name'); if (!el) return;
  el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; el.classList.add('is-hot'); el.setAttribute('data-surface', 'dark'); });
  el.addEventListener('pointerleave', function () { el.classList.remove('is-hot'); el.removeAttribute('data-surface'); });
})();

/* project names: shown as (Project one) etc.; hovering an image reveals the real name on a red bar sliding in from the nearest side */
$$('#v-portfolio .ns-project-frame').forEach(function (frame) {
  var box = frame.closest('article, section.feature'); if (!box) return;
  var names = $$('.pname', box);
  function sideOf(e) { var r = frame.getBoundingClientRect(); return (e && e.clientX != null && e.clientX - r.left > r.width / 2) ? 'right' : 'left'; }
  function on(e) { var s = sideOf(e); names.forEach(function (n) { n.setAttribute('data-side', s); n.classList.add('is-real'); var t = n.closest('.pname-host'); if (t) t.classList.add('name-on'); }); }
  function off(e) { var s = sideOf(e); names.forEach(function (n) { n.setAttribute('data-side', s); n.classList.remove('is-real'); var t = n.closest('.pname-host'); if (t) t.classList.remove('name-on'); }); }
  frame.addEventListener('pointerenter', on); frame.addEventListener('pointerleave', off);
  frame.addEventListener('focus', function () { on(null); }); frame.addEventListener('blur', function () { off(null); });
});

/* index rows: hovering a row reveals that project's real name on the red bar */
$$('.index a').forEach(function (row) {
  var names = $$('.pname', row);
  function sideOf(e) { var r = row.getBoundingClientRect(); return (e && e.clientX != null && e.clientX - r.left > r.width / 2) ? 'right' : 'left'; }
  function set(on, e) { var s = sideOf(e); names.forEach(function (n) { n.setAttribute('data-side', s); n.classList.toggle('is-real', on); }); }
  row.addEventListener('pointerenter', function (e) { set(true, e); });
  row.addEventListener('pointerleave', function (e) { set(false, e); });
  row.addEventListener('focus', function () { set(true, null); });
  row.addEventListener('blur', function () { set(false, null); });
});

/* ---------- project page with pixel transition ---------- */
var pt = (function () {
  var cv = $('#pt-canvas'), ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, cells = [], cell = 20, raf = 0;
  function build(rect, src) {
    W = window.innerWidth; H = window.innerHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.max(16, Math.round(Math.min(W, H) / 36));
    var cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
    var iw = Math.max(1, Math.round(rect.width / cell)), ih = Math.max(1, Math.round(rect.height / cell));
    var tmp = document.createElement('canvas'); tmp.width = iw; tmp.height = ih;
    var tc = tmp.getContext('2d'), data = null;
    try { tc.imageSmoothingEnabled = true; tc.drawImage(src, 0, 0, src.width, src.height, 0, 0, iw, ih); data = tc.getImageData(0, 0, iw, ih).data; } catch (err) { data = null; }
    cells = []; var maxD = 1, i, j;
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
      var cx = (i + 0.5) * cell, cy = (j + 0.5) * cell;
      var px = clamp(cx, rect.left, rect.right), py = clamp(cy, rect.top, rect.bottom);
      var d = Math.hypot(cx - px, cy - py);
      var si = clamp(Math.floor((px - rect.left) / rect.width * iw), 0, iw - 1), sj = clamp(Math.floor((py - rect.top) / rect.height * ih), 0, ih - 1);
      var k = (sj * iw + si) * 4, r = 128, g = 128, b = 128;
      if (data) { r = data[k]; g = data[k + 1]; b = data[k + 2]; }
      cells.push({ x: i * cell, y: j * cell, d: d, r: r, g: g, b: b, j: Math.random() });
      if (d > maxD) maxD = d;
    }
    cells.forEach(function (c) {
      var inside = c.d === 0;
      c.a = inside ? 0.05 + c.j * 0.12 : 0.08 + 0.55 * Math.pow(c.d / maxD, 0.85) + c.j * 0.07;
      c.b2 = Math.min(0.98, c.a + 0.16 + c.j * 0.12);
    });
  }
  function draw(p) {
    ctx.clearRect(0, 0, W, H);
    for (var n = 0; n < cells.length; n++) {
      var c = cells[n];
      if (p <= c.a) continue;
      if (p >= c.b2) { ctx.fillStyle = '#000'; ctx.fillRect(c.x, c.y, cell + 0.5, cell + 0.5); continue; }
      var t = (p - c.a) / (c.b2 - c.a), e = t * t * (3 - 2 * t), grow = Math.min(1, t * 2.2), s = cell * grow, off = (cell - s) / 2;
      ctx.fillStyle = 'rgb(' + Math.round(c.r * (1 - e)) + ',' + Math.round(c.g * (1 - e)) + ',' + Math.round(c.b * (1 - e)) + ')';
      ctx.fillRect(c.x + off, c.y + off, s + 0.5, s + 0.5);
    }
  }
  function run(from, to, ms, done) {
    cancelAnimationFrame(raf); cv.hidden = false;
    var t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      draw(from + (to - from) * e);
      if (k < 1) raf = requestAnimationFrame(step); else done && done();
    })(t0);
  }
  return { build: build, run: run, clear: function () { ctx.clearRect(0, 0, W, H); cv.hidden = true; } };
})();

var ppState = { open: false, frame: null, busy: false, pix: null, opener: null };
function projectFrame(id) { var box = document.getElementById(id); return box ? $('.ns-project-frame', box) : null; }
function openProject(id) {
  if (ppState.open || ppState.busy) return;
  var frame = projectFrame(id); if (!frame) return;
  var ae = document.activeElement; ppState.opener = (ae && ae.tagName === 'A') ? ae : null;
  var box = document.getElementById(id), src = $('canvas', frame);
  var real = $('.pname-real', box), meta = $$('.pmeta dd', box), no = id.slice(-2);
  $('#pp .ns-project-no').textContent = no;
  /* alternate alignment per block; even projects get the mirrored layout */
  var flip = parseInt(no, 10) % 2 === 0, ppEl = $('#pp');
  ppEl.classList.toggle('pp-flip', flip);
  $$('.pp-block .pp-story', ppEl).forEach(function (t, k) { var right = (k % 2 === 1) !== flip; t.classList.toggle('is-right', right); t.classList.toggle('is-left', !right); });
  var cvp = $('#pp-cv'); cvp.setAttribute('aria-label', (real ? real.textContent : 'Project') + ', main project image');
  if (ppState.pix) ppState.pix.destroy();
  var ppHero = $('#pp .pp-hero'); if (ppHero) ppHero.classList.remove('is-resolved');
  ppState.pix = pixelImage(cvp, { src: src.getAttribute('data-pp-src') || src.getAttribute('data-src'), resolvedSrc: src.getAttribute('data-pp-resolved') || src.getAttribute('data-resolved') || undefined, onLevel: function (l, r) { if (ppHero) ppHero.classList.toggle('is-resolved', r); } });
  var fp = $('#pp-frame');
  fp.onpointerenter = function () { ppState.pix.resolve(); }; fp.onpointerleave = function () { ppState.pix.reset(); };
  ppState.frame = frame; ppState.busy = true;
  var r = frame.getBoundingClientRect();
  resetForm($('#pp-title'), real ? real.textContent : 'Project ' + no);
  /* context comes from the project index row (every project has one), falling back to the line above the title */
  var ctxEl = $('a[href="#' + id + '"] .i-ctx') || $('p.mono-12.muted', box), ctx = ctxEl ? ctxEl.textContent.replace(/^\s*\d+\s*\/\s*/, '') : '[Client or context]';
  resetForm($('#pp-label'), no + ' / ' + ctx);
  resetForm($('#pp-ctx'), ctx);
  /* per-project texts from .pp-stories; anything missing falls back to the original placeholder */
  var story = $('.pp-stories [data-story="' + id + '"]'), ppx = $('#pp');
  var slots = [['lead', $('.pp-lead', ppx)], ['team', $('#pp-team')]].concat($$('.pp-block .pp-story', ppx).map(function (t, k) { return ['b' + (k + 1), t]; }));
  slots.forEach(function (s) {
    var el = s[1]; if (!el) return;
    if (el._orig == null) el._orig = el.textContent;
    var src = story ? $('[data-k="' + s[0] + '"]', story) : null;
    resetForm(el, src ? src.textContent : el._orig);
  });
  /* real project images in the four story figures (pixelated, resolve on hover); otherwise the placeholder box */
  (ppState.figs || []).forEach(function (p) { p.destroy(); }); ppState.figs = [];
  ppx.classList.toggle('pp-nofigs', !!(story && $('[data-k="nofigs"]', story)));   /* projects without extra images: text only */
  $$('.pp-block .pp-ph-box', ppx).forEach(function (box, k) {
    if (box._orig == null) box._orig = box.innerHTML;
    var d = story ? $('[data-k="img' + (k + 2) + '"]', story) : null;
    box.classList.toggle('has-img', !!d);
    var fig = box.parentNode, fc = $('.pp-fig-cap', fig), credit = d && d.getAttribute('data-credit');
    if (credit) { if (!fc) { fc = document.createElement('figcaption'); fc.className = 'pp-fig-cap mono-12'; fig.appendChild(fc); } fc.textContent = (typeof toLang === 'function') ? toLang(credit) : credit; }
    else if (fc) fc.remove();
    if (!d) { box.innerHTML = box._orig; box.onpointerenter = box.onpointerleave = null; return; }
    box.innerHTML = '<canvas class="pp-fig-cv" role="img"></canvas>';
    var cv = box.firstChild; cv.setAttribute('aria-label', d.textContent);
    var px = pixelImage(cv, { src: d.getAttribute('data-src'), resolvedSrc: d.getAttribute('data-resolved') || undefined });
    ppState.figs.push(px);
    box.onpointerenter = function () { px.resolve(); }; box.onpointerleave = function () { px.reset(); };
    setTimeout(function () { px.render(); }, 60);
  });
  var cap = $('#pp .pp-hero .ns-project-name');
  if (cap) { if (cap._orig == null) cap._orig = cap.textContent; var cd = story ? $('[data-k="cap1"]', story) : null; resetForm(cap, cd ? cd.textContent : cap._orig); }
  var roleEl = $('a[href="#' + id + '"] .i-role') || meta[0];
  resetForm($('#pp-role'), roleEl ? roleEl.textContent : '[Your role]');
  var yearEl = $('a[href="#' + id + '"] .i-year') || meta[1];
  resetForm($('#pp-year'), yearEl ? yearEl.textContent : '[Year]');
  var show = function () {
    var pp = $('#pp'); pp.hidden = false; pp.scrollTop = 0; pp.classList.remove('lines-out', 'lines-in');
    setTimeout(function () { pp.classList.add('lines-in'); playForms(pp); }, 120);
    document.documentElement.classList.add('pp-open');
    requestAnimationFrame(function () { pp.classList.add('is-in'); ppState.pix.render(); });
    setTimeout(function () { pt.clear(); ppState.busy = false; ppState.open = true; $('#pp-close').focus({ preventScroll: true }); }, 200);
  };
  if (reduce) { show(); return; }
  pt.build(r, src);
  pt.run(0, 1, 900, show);
}
function closeProject() {
  if (!ppState.open || ppState.busy) return;
  ppState.busy = true;
  var pp = $('#pp'), frame = ppState.frame;
  var finish = function () { pp.hidden = true; document.documentElement.classList.remove('pp-open'); ppState.open = false; ppState.busy = false; if (ppState.opener) ppState.opener.focus({ preventScroll: true }); };
  if (reduce) { pp.classList.remove('is-in'); finish(); return; }
  $$('[data-form]', pp).forEach(function (el) { unform(el, 420); });
  pp.classList.add('lines-out'); pp.classList.remove('lines-in');
  setTimeout(function () {
  var r = frame.getBoundingClientRect();
  pt.build(r, $('canvas', frame));
  pt.run(1, 1, 1, function () {
    pp.classList.remove('is-in');
    setTimeout(function () {
      pp.hidden = true; document.documentElement.classList.remove('pp-open');
      pt.run(1, 0, 800, function () { pt.clear(); ppState.open = false; ppState.busy = false; if (ppState.opener) ppState.opener.focus({ preventScroll: true }); });
    }, 180);
  });
  }, 440);
}
$('#pp-close').addEventListener('click', closeProject);
$('#pp-back').addEventListener('click', closeProject);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ppState.open) closeProject(); });
$$('#v-portfolio .ns-project-frame').forEach(function (frame) {
  var box = frame.closest('article, section.feature'); if (!box || !box.id) return;
  frame.addEventListener('click', function () { openProject(box.id); });
  frame.addEventListener('keydown', function (e) { if (e.key === 'Enter') openProject(box.id); });
});
paintIcons($('#pp'));

/* project page text + lines: in on open, reversed on close */
function resetForm(el, txt) { if (el._ctl) el._ctl.cancel(); el._ctl = null; el._vis = null; el.classList.remove('ns-text'); el.textContent = txt; }
function unform(el, ms) {
  if (!el._vis) return;
  if (el._ctl) el._ctl.finish();
  var chs = $$('.ns-ch', el._vis), n = chs.length, t0 = performance.now();
  if (!n) return;
  var off = Ticker.add(function (now) {
    var k = Math.min(1, (now - t0) / ms), cut = Math.floor(n * (1 - k));
    for (var i = cut; i < n; i++) { var c = chs[i]; c.classList.remove('is-done'); var fx = c.lastChild; fx.textContent = randChar(); fx.style.opacity = (0.35 * (1 - k)).toFixed(2); }
    if (k >= 1) { off(); el._vis.style.visibility = 'hidden'; }
  }, 25);
}

/* all images (except the Personal Information hero and the project page) grow in from their centre as a pixel wave when they scroll into view */
var appearFrames = $$('.ns-project-frame:not(.photo-frame):not(#pp-frame)');
var appearIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (!e.isIntersecting || !e.target._appear) return;
    if (document.documentElement.classList.contains('landing-on')) return; /* wait until the landing is gone */
    appearIO.unobserve(e.target); e.target._appear.play();
  });
}, { threshold: 0.25 }) : null;
appearFrames.forEach(function (f) { f._appear = pixelAppear(f, { duration: 1100 }); if (appearIO) appearIO.observe(f); else f._appear.play(); });
function rearmAppear() { if (!appearIO) return; appearFrames.forEach(function (f) { appearIO.unobserve(f); appearIO.observe(f); }); }

/* landing: black screen, MEET NICO SOBALLA; click -> big white pixels close in from the edges, then open onto the portfolio */
(function () {
  var landing = $('#landing'), btn = $('#landing-btn'), cv = $('#lt-canvas'), entering = false;
  if (!landing || landing.hidden) return;
  pixelOverlay({ container: landing });
  function done() {
    toTop();
    document.documentElement.classList.remove('landing-on');
    landing.hidden = true;
    playForms($('#v-portfolio')); rearmAppear();
  }
  function enter() {
    if (entering) return; entering = true;
    if (reduce) { done(); return; }
    var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1), ctx = cv.getContext('2d');
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    /* mixed pixel sizes: big cells, some split into 2x2 or 4x4 */
    var big = Math.ceil(Math.min(W, H) / 8), cols = Math.ceil(W / big), rows = Math.ceil(H / big), cells = [], cx = W / 2, cy = H / 2, maxR = Math.hypot(cx, cy), i, j, a, b;
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
      var r = Math.random(), div = r < 0.3 ? 1 : (r < 0.7 ? 2 : 4), sub = big / div;
      for (b = 0; b < div; b++) for (a = 0; a < div; a++) {
        var x = i * big + a * sub, y = j * big + b * sub, dx = x + sub / 2 - cx, dy = y + sub / 2 - cy;
        var ang = Math.atan2(dy, dx), rr = Math.hypot(dx, dy) / maxR;
        cells.push({ x: x, y: y, s: sub, t: rr * 0.88 + Math.random() * 0.08 });
      }
    }
    cv.hidden = false;
    function backOut(k) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); }
    /* crisp pixels: sizes snap to quarter steps of the cell, edges snap to whole device pixels, always fully opaque */
    function px(c, size) {
      var step = c.s / 4, q = Math.min(c.s, Math.round(size / step) * step); if (q < 1) return;
      var o = (c.s - q) / 2, x0 = Math.round((c.x + o) * dpr), y0 = Math.round((c.y + o) * dpr), x1 = Math.round((c.x + o + q) * dpr), y1 = Math.round((c.y + o + q) * dpr);
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
    function drawIn(p) {
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = '#F4F4F4';
      for (var n = 0; n < cells.length; n++) {
        var c = cells[n], k = (p - c.t) / 0.22;
        if (p >= c.t) px(c, c.s);   /* pixels simply switch on from the centre outward */
      }
      ctx.globalAlpha = 1;
    }
    function drawOut(p) {
      ctx.clearRect(0, 0, cv.width, cv.height); ctx.fillStyle = '#F4F4F4';
      for (var n = 0; n < cells.length; n++) {
        var c = cells[n], k = (p - c.t) / 0.22;
        if (p < c.t) px(c, c.s);   /* and switch off from the centre outward */
      }
      ctx.globalAlpha = 1;
    }
    function run(ms, draw, next) { var t0 = performance.now(); (function step(now) { var k = Math.min(1, (now - t0) / ms); draw(k); if (k < 1) requestAnimationFrame(step); else next(); })(t0); }
    run(950, drawIn, function () {
      done();
      setTimeout(function () { run(750, drawOut, function () { ctx.clearRect(0, 0, cv.width, cv.height); cv.hidden = true; }); }, 60);
    });
  }
  btn.addEventListener('click', enter);
})();
