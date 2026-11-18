/* Pinned résumé sheet: a small Verlet cloth.
   The sheet unrolls when the CV section first scrolls into view, flutters on hover,
   bends in 3D when dragged, and opens the résumé viewer on click.
   Vanilla JS, canvas 2D, no dependencies. */
(function () {
  'use strict';

  var btn = document.getElementById('paper');
  if (!btn) return;
  var canvas = btn.querySelector('.paper__canvas');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- constants ---- */
  var NX = 9, NY = 12, N = NX * NY, PIN = (NX - 1) / 2;   // pinned at top-centre
  var TEX_W = 600, TEX_H = 776;
  var FOCAL = 720, STEP = 1 / 120, ITER = 7, DAMP = 0.991, GRAV = 2300 * STEP * STEP;
  var REST_SPRING = 0.012;
  var LIGHT = (function (x, y, z) { var l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; })(-0.35, -0.55, 0.76);

  /* ---- state ---- */
  var px = new Float32Array(N), py = new Float32Array(N), pz = new Float32Array(N);
  var ox = new Float32Array(N), oy = new Float32Array(N), oz = new Float32Array(N);
  var rx = new Float32Array(N), ry = new Float32Array(N), inv = new Float32Array(N);
  var U = new Float32Array(N), V = new Float32Array(N), rowf = new Float32Array(N);
  var SX = new Float32Array(N), SY = new Float32Array(N);
  var cons = [], tris = [], NT = 0, order = [], depth, nzs;
  var PW, PH, SZ, C0x, C0y, dpr;

  var tex = new Image(), texReady = false;
  var raf = 0, last = 0, acc = 0, spring = REST_SPRING, springTarget = REST_SPRING;
  var grabbed = -1, tx = 0, ty = 0, tz = 0, offX = 0, offY = 0;
  var downX = 0, downY = 0, dragged = false, hitDown = false, over = false, introDone = false;

  /* ---- build the mesh to fit the current layout ---- */
  function build() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    PW = Math.round(Math.min(210, Math.max(150, btn.clientWidth * 0.62)));
    btn.style.setProperty('--pw', PW + 'px');
    PH = PW * TEX_H / TEX_W;
    var cw = PW / (NX - 1), ch = PH / (NY - 1);

    SZ = Math.round(PW * 2.5);
    C0x = SZ / 2;
    C0y = Math.round(SZ * 0.28);
    canvas.width = canvas.height = Math.round(SZ * dpr);
    canvas.style.width = canvas.style.height = SZ + 'px';
    canvas.style.marginLeft = (-SZ / 2) + 'px';
    canvas.style.top = (36 - C0y) + 'px';

    for (var j = 0; j < NY; j++) {
      for (var i = 0; i < NX; i++) {
        var k = j * NX + i;
        rx[k] = px[k] = ox[k] = (i - PIN) * cw;
        ry[k] = py[k] = oy[k] = j * ch;
        pz[k] = oz[k] = 0;
        inv[k] = 1;
        U[k] = i / (NX - 1) * TEX_W;
        V[k] = j / (NY - 1) * TEX_H;
        rowf[k] = j / (NY - 1);
      }
    }
    inv[PIN] = 0;

    cons = []; tris = [];
    function link(a, b, s) { cons.push([a, b, Math.hypot(rx[a] - rx[b], ry[a] - ry[b]), s]); }
    for (j = 0; j < NY; j++) {
      for (i = 0; i < NX; i++) {
        var q = j * NX + i;
        if (i < NX - 1) link(q, q + 1, 1);
        if (j < NY - 1) link(q, q + NX, 1);
        if (i < NX - 1 && j < NY - 1) {
          link(q, q + NX + 1, 0.7); link(q + 1, q + NX, 0.7);
          tris.push(q, q + 1, q + NX, q + 1, q + NX + 1, q + NX);
        }
        if (i < NX - 2) link(q, q + 2, 0.35);          // bending stiffness: paper, not silk
        if (j < NY - 2) link(q, q + 2 * NX, 0.35);
      }
    }
    NT = tris.length / 3;
    order = []; for (var t = 0; t < NT; t++) order.push(t);
    depth = new Float32Array(NT); nzs = new Float32Array(NT);
  }

  /* ---- roll the sheet up like a scroll (start of the unwrap) ---- */
  function rollUp() {
    var turns = 1.35, R = PH / (2 * Math.PI * turns);
    for (var k = 0; k < N; k++) {
      if (k === PIN) continue;
      var s = ry[k], th = s / R, r = R * (1 - 0.35 * s / PH);   // tightening spiral
      px[k] = ox[k] = rx[k] * 0.96;
      py[k] = oy[k] = r * Math.sin(th);
      pz[k] = oz[k] = r * (1 - Math.cos(th));
    }
    spring = 0; springTarget = 0;
    // let gravity do the unrolling first, then ease the sheet home; wake() in case the sim slept
    setTimeout(function () { springTarget = REST_SPRING; wake(); }, 900);
  }

  /* ---- physics ---- */
  function step() {
    var a, b, k, it, c, dx, dy, dz, d, f, wa, wb;
    spring += (springTarget - spring) * 0.02;
    var sp = grabbed < 0 ? spring : 0;
    for (k = 0; k < N; k++) {
      if (inv[k] === 0) continue;
      var vx = (px[k] - ox[k]) * DAMP, vy = (py[k] - oy[k]) * DAMP, vz = (pz[k] - oz[k]) * DAMP;
      ox[k] = px[k]; oy[k] = py[k]; oz[k] = pz[k];
      px[k] += vx; py[k] += vy + GRAV; pz[k] += vz;
      if (sp > 0) { px[k] += (rx[k] - px[k]) * sp; py[k] += (ry[k] - py[k]) * sp; pz[k] -= pz[k] * sp; }
    }
    if (grabbed >= 0) {
      ox[grabbed] = px[grabbed]; oy[grabbed] = py[grabbed]; oz[grabbed] = pz[grabbed];
      px[grabbed] += (tx - px[grabbed]) * 0.35;
      py[grabbed] += (ty - py[grabbed]) * 0.35;
      pz[grabbed] += (tz - pz[grabbed]) * 0.35;
    }
    for (it = 0; it < ITER; it++) {
      for (c = 0; c < cons.length; c++) {
        var cn = cons[c]; a = cn[0]; b = cn[1]; wa = inv[a]; wb = inv[b];
        if (wa + wb === 0) continue;
        dx = px[b] - px[a]; dy = py[b] - py[a]; dz = pz[b] - pz[a];
        d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        f = (d - cn[2]) / d * cn[3] / (wa + wb);
        px[a] += dx * f * wa; py[a] += dy * f * wa; pz[a] += dz * f * wa;
        px[b] -= dx * f * wb; py[b] -= dy * f * wb; pz[b] -= dz * f * wb;
      }
      px[PIN] = py[PIN] = pz[PIN] = 0;
    }
  }

  function ruffle(strength) {
    for (var k = 0; k < N; k++) {
      if (inv[k] === 0) continue;
      oz[k] = pz[k] - (Math.random() - 0.3) * strength * rowf[k];
      ox[k] = px[k] - (Math.random() - 0.5) * strength * 0.5 * rowf[k];
    }
  }

  function moving() {
    if (grabbed >= 0 || Math.abs(spring - springTarget) > 1e-4) return true;
    for (var k = 0; k < N; k++) {
      if (Math.abs(px[k] - ox[k]) + Math.abs(py[k] - oy[k]) + Math.abs(pz[k] - oz[k]) > 0.01) return true;
    }
    return false;
  }

  /* ---- rendering: perspective + per-triangle affine texture mapping ---- */
  function project() {
    for (var k = 0; k < N; k++) {
      var s = FOCAL / (FOCAL - pz[k]);
      SX[k] = C0x + px[k] * s;
      SY[k] = C0y + py[k] * s;
    }
  }

  function affine(u0, v0, u1, v1, u2, v2, x0, x1, x2) {
    var det = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
    if (Math.abs(det) < 1e-9) return null;
    var A = (x0 * (v1 - v2) + x1 * (v2 - v0) + x2 * (v0 - v1)) / det;
    var C = (x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)) / det;
    return [A, C, x0 - A * u0 - C * v0];
  }

  function draw() {
    project();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SZ, SZ);
    var t, a, b, c;
    for (t = 0; t < NT; t++) {
      a = tris[t * 3]; b = tris[t * 3 + 1]; c = tris[t * 3 + 2];
      var ux = px[b] - px[a], uy = py[b] - py[a], uz = pz[b] - pz[a];
      var vx = px[c] - px[a], vy = py[c] - py[a], vz = pz[c] - pz[a];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      var l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= l; ny /= l; nz /= l;
      // lighting relative to a flat sheet; sign-flip for the back face
      var front = nz >= 0, sgn = front ? 1 : -1;
      nzs[t] = (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) * sgn - LIGHT[2];
      depth[t] = (pz[a] + pz[b] + pz[c]) / 3 + (front ? 0.001 : 0);
    }
    order.sort(function (p, q) { return depth[p] - depth[q]; });

    for (var o = 0; o < NT; o++) {
      t = order[o];
      a = tris[t * 3]; b = tris[t * 3 + 1]; c = tris[t * 3 + 2];
      var X0 = SX[a], Y0 = SY[a], X1 = SX[b], Y1 = SY[b], X2 = SX[c], Y2 = SY[c];
      var cx = (X0 + X1 + X2) / 3, cy = (Y0 + Y1 + Y2) / 3;
      // facing test in screen space (after projection)
      var front2 = ((X1 - X0) * (Y2 - Y0) - (Y1 - Y0) * (X2 - X0)) >= 0;

      ctx.save();
      ctx.beginPath();
      // expand each triangle slightly to hide hairline seams
      var pts = [X0, Y0, X1, Y1, X2, Y2];
      for (var m = 0; m < 3; m++) {
        var ex = pts[m * 2] - cx, ey = pts[m * 2 + 1] - cy, el = Math.sqrt(ex * ex + ey * ey) || 1;
        var qx = pts[m * 2] + ex / el * 0.75, qy = pts[m * 2 + 1] + ey / el * 0.75;
        if (m) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy);
      }
      ctx.closePath();
      ctx.clip();

      if (front2 && texReady) {
        var mx = affine(U[a], V[a], U[b], V[b], U[c], V[c], X0, X1, X2);
        var my = affine(U[a], V[a], U[b], V[b], U[c], V[c], Y0, Y1, Y2);
        if (mx && my) {
          var bx = Math.max(0, Math.floor(Math.min(U[a], U[b], U[c])) - 1);
          var by = Math.max(0, Math.floor(Math.min(V[a], V[b], V[c])) - 1);
          var bw = Math.min(TEX_W, Math.ceil(Math.max(U[a], U[b], U[c])) + 1) - bx;
          var bh = Math.min(TEX_H, Math.ceil(Math.max(V[a], V[b], V[c])) + 1) - by;
          ctx.transform(mx[0], my[0], mx[1], my[1], mx[2], my[2]);
          ctx.drawImage(tex, bx, by, bw, bh, bx, by, bw, bh);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      } else {
        ctx.fillStyle = '#e8e0cd';                     // paper back
        ctx.fillRect(0, 0, SZ, SZ);
      }

      var sh = nzs[t];
      if (sh > 0.02) { ctx.fillStyle = 'rgba(255,250,236,' + Math.min(0.42, sh * 1.25).toFixed(3) + ')'; ctx.fillRect(0, 0, SZ, SZ); }
      else if (sh < -0.02) { ctx.fillStyle = 'rgba(24,18,10,' + Math.min(0.48, -sh * 1.35).toFixed(3) + ')'; ctx.fillRect(0, 0, SZ, SZ); }
      ctx.restore();
    }
  }

  /* ---- loop ---- */
  function frame() {
    var now = performance.now();                      // rAF timestamps can lag the clock
    acc += Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    var n = 0;
    while (acc >= STEP && n < 6) { step(); acc -= STEP; n++; }
    if (n === 6) acc = 0;
    draw();
    if (moving()) raf = requestAnimationFrame(frame);
    else raf = 0;
  }
  function wake() {
    if (reduce) { draw(); return; }
    if (!raf) { last = performance.now(); acc = 0; raf = requestAnimationFrame(frame); }
  }

  /* ---- interaction ---- */
  function local(e) {
    var r = canvas.getBoundingClientRect(), k = r.width / SZ;
    return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
  }
  function hit(x, y) {
    for (var t = 0; t < NT; t++) {
      var a = tris[t * 3], b = tris[t * 3 + 1], c = tris[t * 3 + 2];
      var d = (SY[b] - SY[c]) * (SX[a] - SX[c]) + (SX[c] - SX[b]) * (SY[a] - SY[c]);
      if (Math.abs(d) < 1e-6) continue;
      var l1 = ((SY[b] - SY[c]) * (x - SX[c]) + (SX[c] - SX[b]) * (y - SY[c])) / d;
      var l2 = ((SY[c] - SY[a]) * (x - SX[c]) + (SX[a] - SX[c]) * (y - SY[c])) / d;
      if (l1 >= 0 && l2 >= 0 && 1 - l1 - l2 >= 0) return true;
    }
    return false;
  }

  btn.addEventListener('pointerdown', function (e) {
    hitDown = false; dragged = false;
    if (!texReady || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var q = local(e);
    if (!hit(q[0], q[1])) return;
    hitDown = true;
    downX = e.clientX; downY = e.clientY;
    if (reduce) return;
    var best = 1e9;
    for (var k = 0; k < N; k++) {
      if (k === PIN) continue;
      var dd = Math.hypot(SX[k] - q[0], SY[k] - q[1]);
      if (dd < best) { best = dd; grabbed = k; }
    }
    offX = px[grabbed] - (q[0] - C0x);
    offY = py[grabbed] - (q[1] - C0y);
    inv[grabbed] = 0;
    tx = px[grabbed]; ty = py[grabbed]; tz = pz[grabbed];
    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
    wake();
  });

  btn.addEventListener('pointermove', function (e) {
    var q = local(e);
    if (grabbed >= 0) {
      var lx = q[0] - C0x + offX, ly = q[1] - C0y + offY;
      var r0 = Math.hypot(rx[grabbed], ry[grabbed]), d = Math.hypot(lx, ly);
      if (d > r0 && d > 0) { lx *= r0 / d; ly *= r0 / d; }      // paper doesn't stretch
      tx = lx; ty = ly; tz = 26;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dragged = true;
      wake();
      return;
    }
    if (e.pointerType !== 'mouse' || reduce || !texReady) return;
    var o = hit(q[0], q[1]);
    if (o && !over) { ruffle(0.9); wake(); }
    over = o;
  });

  function release() {
    if (grabbed < 0) return;
    inv[grabbed] = 1;
    grabbed = -1;
    spring = 0;                                        // let it swing, then ease home
    if (dragged) ruffle(2.2);
    wake();
  }
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointercancel', release);
  btn.addEventListener('lostpointercapture', release);
  btn.addEventListener('pointerleave', function () { over = false; });

  btn.addEventListener('click', function (e) {
    if (dragged) { e.preventDefault(); dragged = false; return; }
    // mouse/touch clicks must land on the sheet; keyboard clicks (detail 0) always open
    if (e.detail !== 0 && !hitDown) return;
    if (typeof window.adosOpenResume === 'function') window.adosOpenResume(btn);
  });

  /* ---- boot ---- */
  build();
  tex.onload = function () {
    texReady = true;
    btn.classList.add('is-live');
    draw();
    if (reduce || !('IntersectionObserver' in window)) { introDone = true; return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !introDone) {
        introDone = true;
        io.disconnect();
        rollUp();
        wake();
      }
    }, { threshold: 0.45 });
    io.observe(btn);
  };
  tex.src = 'assets/resume-thumb.jpg';

  var lastW = btn.clientWidth, rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (btn.clientWidth === lastW) return;
      lastW = btn.clientWidth;
      build();
      draw();
    }, 150);
  });
})();
