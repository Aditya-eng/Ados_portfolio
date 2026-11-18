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

  /* ---------- Pages: one section per "page", hash-routed (#about, #cv …) ---------- */
  var pages = Array.prototype.slice.call(document.querySelectorAll('[data-page]'));
  var pageIds = pages.map(function (p) { return p.id; });
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  var pager = document.querySelector('.pager');
  var baseTitle = document.title;
  var current = null;

  function setPager(i) {
    if (!pager) return;
    pager.hidden = false;
    [['.pager__prev', i - 1], ['.pager__next', i + 1]].forEach(function (pair) {
      var a = pager.querySelector(pair[0]), p = pages[pair[1]];
      a.classList.toggle('is-gone', !p);
      a.tabIndex = p ? 0 : -1;
      if (p) { a.setAttribute('href', '#' + p.id); a.querySelector('strong').textContent = p.getAttribute('data-page'); }
    });
  }
  function go(id, opts) {
    opts = opts || {};
    if (pageIds.indexOf(id) === -1) id = 'home';
    if (id === current && !opts.force) return;
    var page = document.getElementById(id);
    var first = current === null;
    current = id;
    root.setAttribute('data-route', id);
    each(navLinks, function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = id === 'home' ? baseTitle : page.getAttribute('data-page') + ' · Aditya Garg';
    setPager(pageIds.indexOf(id));
    closeMenu();
    if (!first) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (!reduceMotion) {
        page.classList.remove('page-enter'); void page.offsetWidth; page.classList.add('page-enter');
      }
      page.setAttribute('tabindex', '-1');
      page.focus({ preventScroll: true });
    }
    window.dispatchEvent(new CustomEvent('ados:page', { detail: id }));
  }
  function fromHash() { return location.hash.slice(1); }
  window.addEventListener('hashchange', function () {
    var h = fromHash();
    if (pageIds.indexOf(h) > -1 || h === '') go(h);   // #main, #top etc. are not pages: stay put
  });
  each(document.querySelectorAll('a[href="#top"]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' }); });
  });
  go(fromHash());

  /* ---------- Contact: "Let's ___ that sh*t." ---------- */
  var swap = document.querySelector('.swap__word');
  if (swap && !reduceMotion) {
    var verbs = ['build', 'debug', 'synthesise', 'ship', 'route', 'measure', 'tape out'];
    var vi = 0;
    setInterval(function () {
      if (current !== 'contact' || document.hidden) return;
      swap.classList.remove('is-in'); swap.classList.add('is-out');
      setTimeout(function () {
        vi = (vi + 1) % verbs.length;
        swap.textContent = verbs[vi];
        swap.classList.remove('is-out'); void swap.offsetWidth; swap.classList.add('is-in');
      }, 340);
    }, 2200);
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
  var revealEls = document.querySelectorAll('.section h2, .study, .q, .card, .tools__group, .timeline li, .awards, .stack, .stat, .contact__panel, .pun');
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
