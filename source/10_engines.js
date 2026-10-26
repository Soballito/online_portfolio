/* ---------- helpers ---------- */
var REDUCE = function () { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
var cssVar = function (name, fb) { try { var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fb; } catch (e) { return fb; } };
var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

/* ---------- ONE shared requestAnimationFrame loop ---------- */
var Ticker = (function () {
  var subs = [], running = false, last = 0;
  function loop(t) {
    if (!subs.length) { running = false; return; }
    var dt = t - last; last = t;
    var list = subs.slice();
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      s.acc += dt;
      if (s.acc >= s.every) { s.acc = 0; s.fn(t); }
    }
    requestAnimationFrame(loop);
  }
  return {
    /* fn(now) · fps optional cap (e.g. 30). Returns an unsubscribe function. */
    add: function (fn, fps) {
      var s = { fn: fn, every: fps ? (1000 / fps) * 0.8 : 0, acc: 1e9 };
      subs.push(s);
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
      return function () { var i = subs.indexOf(s); if (i >= 0) subs.splice(i, 1); };
    }
  };
})();

/* ---------- text formation: text assembles itself out of other symbols ---------- */
var POOL = '░▒▓█▪■+/\\_-=#ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
function randChar() { return POOL.charAt((Math.random() * POOL.length) | 0); }

function formText(host, text, o) {
  o = o || {};
  var duration = o.duration || 900, delay = o.delay || 0,
    stagger = o.stagger == null ? 120 : o.stagger,
    tick = o.tick || 40,
    startOpacity = o.startOpacity == null ? 0.35 : o.startOpacity;
  host.textContent = '';
  var chars = [], f = document.createDocumentFragment(), i, c, ch, real, fx;
  for (i = 0; i < text.length; i++) {
    c = text.charAt(i);
    if (c === '\n') { f.appendChild(document.createElement('br')); continue; }
    if (c === ' ') { f.appendChild(document.createTextNode(' ')); continue; }
    ch = el('span', 'ns-ch');
    real = el('span', 'ns-real'); real.textContent = c;
    fx = el('span', 'ns-fx'); fx.textContent = randChar(); fx.style.opacity = startOpacity;
    ch.appendChild(real); ch.appendChild(fx); f.appendChild(ch);
    chars.push({ ch: ch, fx: fx, done: false, at: 0, line: 0 });
  }
  host.appendChild(f);
  var st = { started: false, finished: false, off: null };

  function finish() {
    if (st.finished) return;
    st.finished = true;
    if (st.off) { st.off(); st.off = null; }
    for (var j = 0; j < chars.length; j++) { chars[j].done = true; chars[j].ch.className = 'ns-ch is-done'; }
    host.style.visibility = '';
  }
  function start() {
    if (st.started || st.finished) return;
    st.started = true;
    var uniq = [], counts = {}, seen = {}, j, k, li;
    for (j = 0; j < chars.length; j++) {
      k = chars[j]; k.top = k.ch.offsetTop; li = -1;
      for (var u = 0; u < uniq.length; u++) { if (Math.abs(uniq[u] - k.top) < 4) { li = u; break; } }
      if (li < 0) { uniq.push(k.top); li = uniq.length - 1; }
      k.line = li; counts[li] = (counts[li] || 0) + 1;
    }
    for (j = 0; j < chars.length; j++) {
      k = chars[j]; seen[k.line] = seen[k.line] || 0;
      k.at = k.line * stagger + (seen[k.line]++ / counts[k.line]) * duration + Math.random() * duration * 0.12;
    }
    var t0 = performance.now() + delay;
    host.style.visibility = 'hidden';
    st.off = Ticker.add(function (now) {
      if (now < t0) return;
      if (host.style.visibility) host.style.visibility = '';
      var elapsed = now - t0, left = 0, q;
      for (var m = 0; m < chars.length; m++) {
        q = chars[m];
        if (q.done) continue;
        if (elapsed >= q.at) { q.done = true; q.ch.className = 'ns-ch is-done'; }
        else { left++; q.fx.textContent = randChar(); }
      }
      if (!left) finish();
    }, 1000 / tick);
  }
  var api = { start: start, finish: finish, cancel: finish };
  if (o.instant || REDUCE() || !chars.length) { finish(); return api; }
  host.style.visibility = 'hidden';
  if (o.autostart !== false) start();
  return api;
}

/* ---------- pixel overlay: static dot grid (nothing.tech) ---------- */
/* Pure CSS: a fixed layer, a square dot on every grid point of a 12-column grid,
   white with mix-blend-mode: difference at 30% opacity. Dark on light grey, light on black. No animation. */
function pixelOverlay(o) {
  o = o || {};
  var container = o.container || null;
  var layer = el('div', 'ns-pixels' + (container ? ' ns-pixels--contained' : ''));
  layer.setAttribute('aria-hidden', 'true');
  layer.appendChild(el('div', 'ns-pixels-grid'));
  if (o.columns) layer.style.setProperty('--pixel-columns', o.columns);
  if (o.dot) layer.style.setProperty('--pixel-dot', o.dot + 'px');
  if (o.opacity != null) layer.style.setProperty('--pixel-opacity', o.opacity);
  (container || document.body).appendChild(layer);
  return { el: layer, destroy: function () { if (layer.parentNode) layer.parentNode.removeChild(layer); } };
}

/* ---------- cursor: pixel arrow; over images one see-through square that pulses on click ---------- */
var CURSOR_ARROW = [
  'o........',
  'oo.......',
  'oXo......',
  'oXXo.....',
  'oXXXo....',
  'oXXXXo...',
  'oXXXXXo..',
  'oXXXXXXo.',
  'oXXXXXXXo',
  'oXXXXoooo',
  'oXXoXo...',
  'oXo.oXo..',
  'oo..oXo..',
  '.....oXo.',
  '.....ooo.'];
function bitmapPath(rows, ch) {
  var d = '', y, x, x0;
  for (y = 0; y < rows.length; y++) { x = 0; while (x < rows[y].length) { if (rows[y].charAt(x) === ch) { x0 = x; while (x < rows[y].length && rows[y].charAt(x) === ch) x++; d += 'M' + x0 + ' ' + y + 'h' + (x - x0) + 'v1h-' + (x - x0) + 'z'; } else x++; } }
  return d;
}
function cursor(o) {
  o = o || {};
  var reduce = REDUCE(), fine = true, container = o.container || null,
    imgSel = o.imageSelector || '.ns-project-frame, [data-cursor="image"]', revealSel = o.revealSelector || '[data-cursor-reveal]', scale = o.arrowScale || 2;
  try { fine = window.matchMedia('(pointer: fine)').matches; } catch (e) { }
  var root = el('div', 'ns-cursor' + (container ? ' ns-cursor--contained' : ''));
  root.setAttribute('aria-hidden', 'true'); root.setAttribute('data-over', 'light');
  /* single square: its side scales with the image under it (sqrt of the image area x sizeRatio), capped at `size` */
  var maxSize = o.size || 605, ratio = o.sizeRatio == null ? 0.573 : o.sizeRatio, minSize = o.minSize || 72;
  var defs = o.squares || [{ s: maxSize, ox: 0, oy: 0, k: 0.22, fit: true }];
  var sq = defs.map(function (d) { var e = el('div', 'ns-cur-sq'); e.style.width = e.style.height = d.s + 'px'; root.appendChild(e); return { el: e, d: d, x: 0, y: 0, wave: null, op: 0, s: d.s, ts: d.s, drawn: d.s }; });
  var imgEl = null;
  function fitSize() {
    if (!imgEl) return;
    var r = imgEl.getBoundingClientRect(), t = clamp(Math.sqrt(r.width * r.height) * ratio, minSize, maxSize);
    sq.forEach(function (q) { if (q.d.fit) { q.ts = t; if (q.op < 0.05) q.s = t; } });
  }
  var cross = el('div', 'ns-cur-cross'); root.appendChild(cross);
  var arrow = el('div', 'ns-cur-arrow');
  arrow.innerHTML = '<svg width="' + 9 * scale + '" height="' + 15 * scale + '" viewBox="0 0 9 15" shape-rendering="crispEdges"><path class="ns-cur-o" d="' + bitmapPath(CURSOR_ARROW, 'o') + '"/><path class="ns-cur-f" d="' + bitmapPath(CURSOR_ARROW, 'X') + '"/></svg>';
  root.appendChild(arrow);
  (container || document.body).appendChild(root);
  if (!container && fine) document.documentElement.classList.add('ns-has-cursor');

  var mx = 0, my = 0, pmx = 0, pmy = 0, has = false, img = false, lastProbe = 0;
  function origin() { var r = root.getBoundingClientRect(); return { x: r.left, y: r.top }; }
  function setOver(target) {
    var hitImg = target && target.closest ? target.closest(imgSel) : null, onImg = !!hitImg;
    if (hitImg && hitImg !== imgEl) { imgEl = hitImg; fitSize(); } else if (hitImg) fitSize();
    var dark = !!(target && target.closest && target.closest('[data-surface="dark"]'));
    root.setAttribute('data-over', dark ? 'dark' : 'light');
    if (onImg && !img) sq.forEach(function (q) { if (q.op < 0.05 && !q.wave) { q.x = mx + q.d.ox; q.y = my + q.d.oy; } });
    img = onImg; root.classList.toggle('is-img', img);
    root.classList.toggle('is-reveal', !!(target && target.closest && target.closest(revealSel)));
  }
  function onMove(e) {
    if (e.pointerType === 'touch') return;
    var og = origin(); mx = e.clientX - og.x; my = e.clientY - og.y;
    if (!has) { has = true; pmx = mx; pmy = my; root.classList.add('is-on'); }
    setOver(e.target);
  }
  function onOut(e) { if (!e.relatedTarget && !container) { has = false; root.classList.remove('is-on'); } }
  function onLeave() { has = false; root.classList.remove('is-on'); }
  function burst(x, y) {
    if (reduce) return;
    var now = performance.now();
    sq.forEach(function (q, n) {
      var dx = q.x - x, dy = q.y - y;
      if (!has || q.op < 0.05) { q.x = x + q.d.ox; q.y = y + q.d.oy; dx = q.d.ox; dy = q.d.oy; }
      var a = Math.atan2(dy, dx);
      if (Math.abs(dx) + Math.abs(dy) < 4) a = Math.random() * 6.283;
      q.op = 1;
      var single = defs.length === 1;
      q.wave = { t0: now + n * 40, a: a, dist: single ? 0 : 110 + n * 28, amp: single ? 0 : 14 + n * 4, ph: n, grow: single ? 0.6 : 0.25 };
    });
  }
  function onDown(e) {
    if (!(e.target && e.target.closest && e.target.closest(imgSel))) return;
    var og = origin(); burst(e.clientX - og.x, e.clientY - og.y);
  }
  function onScroll() { lastProbe = 0; }
  var target = container || window;
  target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerdown', onDown, true);
  window.addEventListener('scroll', onScroll, { passive: true });
  if (container) container.addEventListener('pointerleave', onLeave); else window.addEventListener('pointerout', onOut);

  var off = Ticker.add(function (now) {
    var vx = mx - pmx, vy = my - pmy, sp = Math.sqrt(vx * vx + vy * vy), n, q;
    pmx = mx; pmy = my;
    var pos = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    cross.style.transform = pos; arrow.style.transform = pos;
    for (n = 0; n < sq.length; n++) {
      q = sq[n];
      var tx = mx + q.d.ox, ty = my + q.d.oy;
      if (has) { if (reduce) { q.x = tx; q.y = ty; } else { q.x += (tx - q.x) * q.d.k; q.y += (ty - q.y) * q.d.k; } }
      var X = q.x, Y = q.y, sc = 1 + Math.min(sp * 0.004, 0.15), rot = root.classList.contains('is-reveal') ? 0 : clamp(vx * 0.2, -8, 8) * (n % 2 ? 1 : -1) * (defs.length === 1 ? 0.4 : 1), w = q.wave;
      if (w) {
        var t = (now - w.t0) / 700;
        if (t >= 1) { q.wave = null; q.op = 0.04; }
        else if (t >= 0) {
          var e = 1 - Math.pow(1 - t, 3), s = Math.sin(t * 9.42 + w.ph) * w.amp * (1 - t);
          X += Math.cos(w.a) * w.dist * e + Math.cos(w.a + 1.5708) * s;
          Y += Math.sin(w.a) * w.dist * e + Math.sin(w.a + 1.5708) * s;
          sc *= 1 + w.grow * e; q.op = 1 - 0.96 * e;
        }
      } else { var goal = (has && img) ? 1 : 0; q.op += (goal - q.op) * (goal ? 0.12 : 0.2); if (reduce) q.op = goal; }
      q.s += (q.ts - q.s) * (reduce ? 1 : 0.18);
      if (Math.abs(q.s - q.drawn) > 0.5) { q.drawn = q.s; q.el.style.width = q.el.style.height = q.s.toFixed(1) + 'px'; }
      q.el.style.transform = 'translate3d(' + (X - q.drawn / 2) + 'px,' + (Y - q.drawn / 2) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      q.el.style.opacity = q.op < 0.01 ? 0 : q.op.toFixed(3);
    }
    if (has && now - lastProbe > 120) {
      lastProbe = now;
      var og = origin(); setOver(document.elementFromPoint(mx + og.x, my + og.y));
    }
  });
  return {
    burst: burst,
    destroy: function () {
      off(); target.removeEventListener('pointermove', onMove); target.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('scroll', onScroll);
      if (container) container.removeEventListener('pointerleave', onLeave); else window.removeEventListener('pointerout', onOut);
      if (!container) document.documentElement.classList.remove('ns-has-cursor');
      if (root.parentNode) root.parentNode.removeChild(root);
    }
  };
}

/* ---------- pixel reveal: a hidden colour image shows through the cursor square ---------- */
/* frame: the image frame (carries data-cursor-reveal); canvas: an empty canvas laid over it; src: the colour image.
   Under the square the colour image shows in full detail; around it, square colour pixels on the image's grid
   scatter outward and flicker, fading with distance. Follows the square's live position, size and opacity. */
function pixelReveal(frame, canvas, src, o) {
  o = o || {};
  var img = new Image(), ready = false, full = document.createElement('canvas'), small = document.createElement('canvas'),
    ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = 1, cell = 8, cols = 0, rows = 0, px = null, reduce = REDUCE(),
    spread = o.spread || 0.9, density = o.density || 0.7, gridCols = o.gridCols || 64;
  function prep() {
    var r = frame.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.round(r.width * dpr); H = Math.round(r.height * dpr);
    if (!W || !H || !ready) return;
    canvas.width = W; canvas.height = H; full.width = W; full.height = H;
    var iw = img.naturalWidth, ih = img.naturalHeight, ir = iw / ih, cr = W / H, sx = 0, sy = 0, sw = iw, sh = ih;
    if (ir > cr) { sw = ih * cr; sx = (iw - sw) / 2; } else { sh = iw / cr; sy = (ih - sh) / 2; }
    var fc = full.getContext('2d'); fc.imageSmoothingEnabled = true; fc.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    cell = W / gridCols; cols = gridCols; rows = Math.ceil(H / cell);
    small.width = cols; small.height = rows;
    var sc = small.getContext('2d'); sc.imageSmoothingEnabled = true; sc.drawImage(full, 0, 0, W, H, 0, 0, cols, H / cell);
    px = sc.getImageData(0, 0, cols, rows).data;
  }
  function hash(i, j, k) { var h = (i * 374761393 + j * 668265263 + k * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  img.onload = function () { ready = true; prep(); };
  img.src = src;
  var ro = window.ResizeObserver ? new ResizeObserver(prep) : null; if (ro) ro.observe(frame);
  var off = Ticker.add(function (now) {
    ctx.clearRect(0, 0, W, H);
    if (!px || !frame.offsetParent) return;
    var root = document.querySelector('.ns-cursor'), sqEl = root && root.querySelector('.ns-cur-sq');
    if (!sqEl || !root.classList.contains('is-on') && !sqEl.style.opacity) return;
    var op = parseFloat(sqEl.style.opacity) || 0; if (op < 0.02) return;
    var fr = frame.getBoundingClientRect(), r = sqEl.getBoundingClientRect();
    if (r.right < fr.left || r.left > fr.right || r.bottom < fr.top || r.top > fr.bottom) return;
    var x0 = (r.left - fr.left) * dpr, y0 = (r.top - fr.top) * dpr, w = r.width * dpr, hh = r.height * dpr;
    var R = w * spread, tick = reduce ? 0 : Math.floor(now / 140);
    var i0 = Math.max(0, Math.floor((x0 - R) / cell)), i1 = Math.min(cols - 1, Math.floor((x0 + w + R) / cell)),
      j0 = Math.max(0, Math.floor((y0 - R) / cell)), j1 = Math.min(rows - 1, Math.floor((y0 + hh + R) / cell)), i, j;
    for (j = j0; j <= j1; j++) {
      for (i = i0; i <= i1; i++) {
        var cx = (i + 0.5) * cell, cy = (j + 0.5) * cell;
        var dx = Math.max(x0 - cx, 0, cx - (x0 + w)), dy = Math.max(y0 - cy, 0, cy - (y0 + hh)), d = Math.max(dx, dy);
        if (d <= 0 || d > R) continue;
        var f = 1 - d / R;
        if (hash(i, j, tick) > density * Math.pow(f, 1.6)) continue;
        var k = (j * cols + i) * 4;
        ctx.globalAlpha = op * (0.35 + 0.65 * f);
        ctx.fillStyle = 'rgb(' + px[k] + ',' + px[k + 1] + ',' + px[k + 2] + ')';
        ctx.fillRect(Math.round(i * cell), Math.round(j * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
    var cx0 = Math.max(0, x0), cy0 = Math.max(0, y0), cx1 = Math.min(W, x0 + w), cy1 = Math.min(H, y0 + hh);
    if (cx1 > cx0 && cy1 > cy0) { ctx.globalAlpha = op; ctx.drawImage(full, cx0, cy0, cx1 - cx0, cy1 - cy0, cx0, cy0, cx1 - cx0, cy1 - cy0); }
    ctx.globalAlpha = 1;
  });
  return { destroy: function () { off(); if (ro) ro.disconnect(); } };
}

/* ---------- pixel appear: an image grows in from its centre as a wavy front of pixels ---------- */
/* A canvas over the frame is filled with the colour behind the frame; on play() it clears from the centre outward.
   The front is wavy (sine on the angle, drifting while it grows) and the cells along it flicker before they open. */
function pixelAppear(frame, o) {
  o = o || {};
  if (REDUCE()) return { play: function () { }, destroy: function () { } };
  var cv = el('canvas', 'ns-appear'); cv.setAttribute('aria-hidden', 'true'); frame.appendChild(cv);
  var ctx = cv.getContext('2d'), W = 0, H = 0, cell = 12, cells = [], state = 'hidden', prog = 0, off = null,
    dur = o.duration || 1100, phase = Math.random() * 6.283, color = o.color || null;
  function bgOf(n) {
    n = n.parentElement;
    while (n && n !== document.documentElement) {
      var c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c)) return c;
      n = n.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor || cssVar('--surface-100', '#F4F4F4');
  }
  function size() {
    var r = frame.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!r.width || !r.height) return;
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.max(10, Math.round(W / (o.cols || 28)));
    var cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), cx = W / 2, cy = H / 2, maxR = Math.hypot(cx, cy), i, j;
    cells = [];
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
      var dx = i * cell + cell / 2 - cx, dy = j * cell + cell / 2 - cy;
      cells.push({ x: i * cell, y: j * cell, r: Math.hypot(dx, dy) / maxR, a: Math.atan2(dy, dx), n: Math.random() });
    }
    draw(prog);
  }
  function draw(p) {
    ctx.clearRect(0, 0, W, H);
    if (state === 'done') return;
    if (!color) color = bgOf(frame);
    ctx.fillStyle = color;
    if (state === 'hidden') { ctx.fillRect(0, 0, W, H); return; }
    var front = p * 1.38 - 0.12, band = 0.1;
    for (var n = 0; n < cells.length; n++) {
      var c = cells[n];
      var edge = front + Math.sin(c.a * 5 + phase + p * 9) * 0.05 + Math.sin(c.a * 3 - phase - p * 6) * 0.03 + (c.n - 0.5) * 0.07;
      var d = c.r - edge;
      if (d <= 0) continue;
      if (d < band) {
        if (Math.random() < 0.45 * (1 - d / band)) continue;
        ctx.globalAlpha = 0.25 + 0.75 * (d / band);
      } else ctx.globalAlpha = 1;
      ctx.fillRect(c.x, c.y, cell + 0.5, cell + 0.5);
    }
    ctx.globalAlpha = 1;
  }
  function play() {
    if (state !== 'hidden') return;
    state = 'playing'; var t0 = performance.now();
    off = Ticker.add(function (now) {
      var k = Math.min(1, (now - t0) / dur); prog = 1 - Math.pow(1 - k, 2.2); draw(prog);
      if (k >= 1) { state = 'done'; off(); off = null; ctx.clearRect(0, 0, W, H); cv.style.display = 'none'; }
    });
  }
  var ro = window.ResizeObserver ? new ResizeObserver(size) : null; if (ro) ro.observe(frame);
  size();
  return { play: play, destroy: function () { if (off) off(); if (ro) ro.disconnect(); if (cv.parentNode) cv.parentNode.removeChild(cv); } };
}

/* ---------- project image: pixelated placeholder that resolves ---------- */
function pixelImage(canvas, o) {
  o = o || {};
  var imgA = null, imgB = null, level = 0, target = 0, timer = null, tmp = document.createElement('canvas'), reduce = REDUCE();
  var hasB = !!o.resolvedSrc;
  var levels = hasB
    ? [{ img: 'a', blocks: 0, smooth: false }, { img: 'b', blocks: 24 }, { img: 'b', blocks: 48 }, { img: 'b', blocks: 96 }, { img: 'b', blocks: 0, smooth: true }]
    : [{ img: 'a', blocks: 0, smooth: false }, { img: 'a', blocks: 0, smooth: true }];
  function load(src, cb) { if (!src) { cb(null); return; } var im = new Image(); im.onload = function () { cb(im); }; im.onerror = function () { cb(null); }; im.src = src; }
  function render() {
    var lv = levels[level], im = lv.img === 'b' ? (imgB || imgA) : imgA;
    if (!im) return;
    var r = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    var iw = im.naturalWidth, ih = im.naturalHeight, ir = iw / ih, cr = W / H, sx = 0, sy = 0, sw = iw, sh = ih;
    if (ir > cr) { sw = ih * cr; sx = (iw - sw) / 2; } else { sh = iw / cr; sy = (ih - sh) / 2; }
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    if (!lv.blocks) { ctx.imageSmoothingEnabled = !!lv.smooth; ctx.drawImage(im, sx, sy, sw, sh, 0, 0, W, H); return; }
    var cols = lv.blocks, rows = Math.max(1, Math.round(cols * H / W));
    tmp.width = cols; tmp.height = rows;
    var tc = tmp.getContext('2d'); tc.imageSmoothingEnabled = true; tc.drawImage(im, sx, sy, sw, sh, 0, 0, cols, rows);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(tmp, 0, 0, cols, rows, 0, 0, W, H);
  }
  function report() { if (o.onLevel) o.onLevel(level, level === levels.length - 1); }
  function go(t) {
    target = t;
    if (reduce) { level = t; render(); report(); return; }
    if (timer) return;
    timer = setInterval(function () {
      if (level < target) level++; else if (level > target) level--;
      render(); report();
      if (level === target) { clearInterval(timer); timer = null; }
    }, o.stepMs || 110);
  }
  load(o.src, function (a) { imgA = a; render(); });
  load(o.resolvedSrc, function (b) { imgB = b; });
  var ro = null;
  if (window.ResizeObserver) { ro = new ResizeObserver(render); ro.observe(canvas); }
  return {
    resolve: function () { go(levels.length - 1); },
    reset: function () { go(0); },
    render: render,
    destroy: function () { if (timer) clearInterval(timer); if (ro) ro.disconnect(); }
  };
}
