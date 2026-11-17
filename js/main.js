/* Aditya Garg — portfolio interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ados-theme', next); } catch (e) {}
      drawTraces();
    });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Nav border on scroll + active link ---------- */
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }

  /* ---------- Project filters ---------- */
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.card');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      Array.prototype.forEach.call(chips, function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      Array.prototype.forEach.call(cards, function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        card.classList.toggle('is-hidden', f !== 'all' && tags.indexOf(f) === -1);
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.section h2, .paper, .q, .card, .tools__group, .timeline li, .awards, .stack');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- Count-up stats ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(nums, function (n) { co.observe(n); });
  }

  /* ---------- Typed terminal ---------- */
  var term = document.querySelector('[data-typed] code');
  if (term) {
    var lines = term.textContent.split('\n');
    var colour = function (line) {
      var safe = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (line.indexOf('$') === 0) return '<span class="cmd">' + safe + '</span>';
      if (line === 'PASS' || /mismatches: 0/.test(line)) return '<span class="ok">' + safe + '</span>';
      return safe;
    };
    if (reduceMotion) {
      term.innerHTML = lines.map(colour).join('\n');
    } else {
      term.innerHTML = '';
      var i = 0;
      var tick = function () {
        if (i < lines.length) {
          term.innerHTML = lines.slice(0, i + 1).map(colour).join('\n') + '<span class="caret"></span>';
          i++;
          setTimeout(tick, lines[i - 1].indexOf('$') === 0 ? 650 : 280);
        } else {
          term.innerHTML = lines.map(colour).join('\n') + '\n<span class="caret"></span>';
        }
      };
      setTimeout(tick, 500);
    }
  }

  /* ---------- Hero PCB traces (canvas) ---------- */
  var canvas = document.querySelector('.hero__traces');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var pulses = [];
  var paths = [];
  var rafId = null;

  function seeded(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  function buildPaths(w, h) {
    var rand = seeded(2405);
    var grid = 28;
    var out = [];
    var count = Math.max(10, Math.round(w / 70));
    for (var n = 0; n < count; n++) {
      var x = Math.round((rand() * w) / grid) * grid;
      var y = Math.round((rand() * h) / grid) * grid;
      var pts = [[x, y]];
      var segs = 2 + Math.floor(rand() * 4);
      var dir = rand() > 0.5 ? 0 : 1;
      for (var s = 0; s < segs; s++) {
        var len = grid * (2 + Math.floor(rand() * 6));
        if (dir === 0) x += rand() > 0.5 ? len : -len; else y += rand() > 0.5 ? len : -len;
        // 45-degree jog, PCB style
        if (rand() > 0.55) { var d = grid * (rand() > 0.5 ? 1 : -1); x += d; y += d; }
        pts.push([x, y]);
        dir = 1 - dir;
      }
      out.push(pts);
    }
    return out;
  }

  function pathLength(pts) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }

  function pointAt(pts, t) {
    var target = pathLength(pts) * t, acc = 0;
    for (var i = 1; i < pts.length; i++) {
      var seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (acc + seg >= target) {
        var k = seg ? (target - acc) / seg : 0;
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
      }
      acc += seg;
    }
    return pts[pts.length - 1];
  }

  function drawTraces() {
    if (!ctx) return;
    var styles = getComputedStyle(root);
    var trace = styles.getPropertyValue('--trace').trim();
    var accent = styles.getPropertyValue('--accent').trim();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = trace;
    ctx.fillStyle = trace;
    paths.forEach(function (pts) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      [pts[0], pts[pts.length - 1]].forEach(function (p) {
        ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.stroke();
      });
    });
    pulses.forEach(function (p) {
      var pt = pointAt(paths[p.path], p.t);
      ctx.beginPath();
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.85;
      ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function animate() {
    pulses.forEach(function (p) {
      p.t += p.v;
      if (p.t > 1) { p.t = 0; p.path = Math.floor(Math.random() * paths.length); }
    });
    drawTraces();
    rafId = requestAnimationFrame(animate);
  }

  function setupCanvas() {
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    paths = buildPaths(canvas.clientWidth, canvas.clientHeight);
    pulses = [];
    for (var i = 0; i < Math.min(8, paths.length); i++) {
      pulses.push({ path: i, t: Math.random(), v: 0.002 + Math.random() * 0.003 });
    }
    drawTraces();
  }

  if (ctx) {
    setupCanvas();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCanvas, 150);
    });
    if (!reduceMotion) {
      // Only animate while the hero is on screen
      var heroObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { if (!rafId) animate(); }
        else if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      });
      heroObs.observe(canvas);
    }
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
