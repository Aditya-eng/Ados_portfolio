/* Liquid-glass cursor: a water droplet that glides after the pointer,
   stretches along its velocity, and leaves ripples on the page as it moves.
   Desktop (fine pointer) only; disabled for reduced motion. */
(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var HOVER = 'a, button, .chip, .card, .q, .stack__list li, .glass-ring, .features__list li, [data-cursor]';

  function el(cls) { var d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d); return d; }

  var rings = [];
  for (var r = 0; r < 12; r++) rings.push(el('cursor-ring'));
  var drop = el('cursor-drop');
  var dot = el('cursor-dot');
  root.classList.add('has-glass-cursor');

  var mx = -200, my = -200;        // pointer
  var x = mx, y = my;              // droplet (lags behind)
  var scale = 1, scaleTarget = 1;
  var raf = 0, lastRipple = 0, ringIdx = 0, hovering = false, pressed = false;

  function ripple(px, py, size, strength) {
    var ring = rings[ringIdx++ % rings.length];
    if (!ring.animate) return;
    ring.animate([
      { transform: 'translate3d(' + px + 'px,' + py + 'px,0) scale(' + (0.35 * size) + ')', opacity: 0.55 * strength },
      { transform: 'translate3d(' + px + 'px,' + py + 'px,0) scale(' + (2.3 * size) + ')', opacity: 0 }
    ], { duration: 900 + 300 * size, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }

  function loop(now) {
    var dx = mx - x, dy = my - y;
    x += dx * 0.18;
    y += dy * 0.18;
    var speed = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    var stretch = Math.min(speed / 140, 0.42);           // droplet elongates as it glides
    scale += (scaleTarget - scale) * 0.18;

    drop.style.transform =
      'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) rotate(' + angle.toFixed(3) + 'rad) scale(' +
      (scale * (1 + stretch)).toFixed(3) + ',' + (scale * (1 - stretch * 0.55)).toFixed(3) + ')';

    if (speed > 7 && now - lastRipple > 75) {
      lastRipple = now;
      ripple(x, y, Math.min(1.25, 0.6 + speed / 140), Math.min(1, speed / 40));
    }

    if (speed > 0.15 || Math.abs(scaleTarget - scale) > 0.005) raf = requestAnimationFrame(loop);
    else raf = 0;
  }
  function wake() { if (!raf) raf = requestAnimationFrame(loop); }

  function updateScale() {
    scaleTarget = (hovering ? 1.55 : 1) * (pressed ? 0.8 : 1);
    wake();
  }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    if (!root.classList.contains('cursor-visible')) {
      x = mx; y = my;                                     // don't glide in from the corner
      root.classList.add('cursor-visible');
    }
    var h = !!(e.target && e.target.closest && e.target.closest(HOVER));
    if (h !== hovering) { hovering = h; updateScale(); }
    wake();
  }, { passive: true });

  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    pressed = true; updateScale();
    ripple(mx, my, 1.1, 1);                              // splash
    setTimeout(function () { ripple(mx, my, 1.6, 0.7); }, 90);
  });
  window.addEventListener('pointerup', function () { pressed = false; updateScale(); });

  document.addEventListener('mouseleave', function () { root.classList.remove('cursor-visible'); });
  document.addEventListener('mouseenter', function () { root.classList.add('cursor-visible'); });
  window.addEventListener('blur', function () { root.classList.remove('cursor-visible'); });
})();
