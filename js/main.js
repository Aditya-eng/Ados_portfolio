/* Aditya Garg: portfolio interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ados-theme', next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');
  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Active section in nav ---------- */
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        each(navLinks, function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    each(navLinks, function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }

  /* ---------- Project filters ---------- */
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.card');
  each(chips, function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      each(chips, function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      each(cards, function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        card.classList.toggle('is-hidden', f !== 'all' && tags.indexOf(f) === -1);
      });
    });
  });

  /* ---------- Hero feature row: progress segment cycles ---------- */
  var features = document.querySelector('.features');
  if (features) {
    var items = features.querySelectorAll('.features__list li');
    var idx = 0, timer = null;
    var setActive = function (i) {
      idx = i;
      features.style.setProperty('--i', i);
      each(items, function (li, n) { li.classList.toggle('is-active', n === i); });
    };
    var start = function () {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { setActive((idx + 1) % items.length); }, 3200);
    };
    var stop = function () { clearInterval(timer); timer = null; };
    each(items, function (li, n) {
      li.addEventListener('mouseenter', function () { stop(); setActive(n); });
    });
    features.addEventListener('mouseleave', start);
    start();
  }

  /* ---------- Aurora follows the pointer, gently ---------- */
  var hero = document.querySelector('.hero__panel');
  var blob = hero && hero.querySelector('.b1');
  if (hero && blob && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 80;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 60;
      blob.style.setProperty('--mx', x.toFixed(1) + 'px');
      blob.style.setProperty('--my', y.toFixed(1) + 'px');
    });
    hero.addEventListener('pointerleave', function () {
      blob.style.setProperty('--mx', '0px');
      blob.style.setProperty('--my', '0px');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.section h2, .paper, .q, .card, .tools__group, .timeline li, .awards, .stack, .stat, .contact__panel');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    each(revealEls, function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    each(document.querySelectorAll('[data-count]'), function (n) { co.observe(n); });
  }

  /* ---------- Résumé viewer (slides up; image page, no PDF plugin needed) ---------- */
  var viewer = document.getElementById('viewer');
  var lastTrigger = null;
  function loadResumePage() {
    if (!viewer) return;
    var img = viewer.querySelector('img[data-src]');
    if (!img) return;
    var page = img.parentNode;
    img.addEventListener('load', function () { page.classList.add('is-loaded'); });
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
    if (img.complete && img.naturalWidth) page.classList.add('is-loaded');
  }
  function openResume(trigger) {
    if (!viewer) return false;
    lastTrigger = trigger || document.activeElement;
    loadResumePage();
    viewer.removeAttribute('inert');
    viewer.classList.add('is-open');
    root.classList.add('is-locked');
    closeMenu();
    var closeBtn = viewer.querySelector('.viewer__close');
    setTimeout(function () { if (closeBtn) closeBtn.focus({ preventScroll: true }); }, 80);
    return true;
  }
  function closeResume() {
    if (!viewer || !viewer.classList.contains('is-open')) return;
    viewer.classList.remove('is-open');
    viewer.setAttribute('inert', '');
    root.classList.remove('is-locked');
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
  }
  window.adosOpenResume = openResume;

  each(document.querySelectorAll('[data-open-resume]'), function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;   // let "open in new tab" work
      e.preventDefault();
      openResume(a);
    });
    // warm the image up on intent so the sheet is ready when the panel arrives
    a.addEventListener('pointerenter', loadResumePage, { once: true });
  });
  var paperBtn = document.getElementById('paper');
  if (paperBtn) paperBtn.addEventListener('pointerenter', loadResumePage, { once: true });

  if (viewer) {
    viewer.querySelector('.viewer__close').addEventListener('click', closeResume);
    viewer.querySelector('.viewer__scroll').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeResume();     // click the backdrop to close
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeResume(); });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
