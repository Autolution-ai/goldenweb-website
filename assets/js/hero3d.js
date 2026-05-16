/* ═══════════════════════════════════════════════════════
   HERO 3D – Wheel-driven animation + Mousemove Tilt
   ═══════════════════════════════════════════════════════ */

(function () {
  var hero      = document.getElementById('hero');
  var scene     = document.getElementById('heroScene');
  var stack     = document.getElementById('uiStack');
  var codePanel = document.getElementById('codePanel');

  if (!scene || !stack) return;

  var reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.innerWidth >= 860;
  var cards     = stack.querySelectorAll('.ui-card');
  var lines     = codePanel ? codePanel.querySelectorAll('.code-panel__line:not(.code-panel__line--blank)') : [];

  /* ── Helpers ─────────────────────────────────────────── */
  function clamp (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function ease  (t)         { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
  function lerp  (a, b, t)   { return a + (b - a) * t; }

  /* ── Core animation (p = 0 → 1) ─────────────────────── */
  function runAnimation (p) {
    if (!codePanel) return;

    /* Code panel: shrinks away in Z, lines scatter in X/Y */
    var panelP = clamp(p / 0.65, 0, 1);
    var panelZ = -panelP * 1200;

    lines.forEach(function (line, i) {
      var dx      = parseFloat(line.dataset.dx || 0);
      var dy      = parseFloat(line.dataset.dy || 0);
      var stagger = i * 0.025;
      var lp      = clamp((p - stagger) / Math.max(0.01, 0.60 - stagger * 0.5), 0, 1);
      var scatter = ease(lp) * 70;
      var alpha   = clamp(1 - lp * 2, 0, 1);
      line.style.transform = 'translateX(' + (dx * scatter).toFixed(1) + 'px) translateY(' + (dy * scatter).toFixed(1) + 'px)';
      line.style.opacity   = alpha.toFixed(3);
    });

    codePanel.style.transform = 'translateZ(' + panelZ.toFixed(1) + 'px)';
    codePanel.style.opacity   = clamp(1 - panelP * 1.4, 0, 1).toFixed(3);

    /* UI cards: materialise from p=0.38, staggered */
    cards.forEach(function (card, i) {
      var start = 0.38 + i * 0.06;
      var cp    = clamp((p - start) / 0.28, 0, 1);
      card.style.opacity = ease(cp).toFixed(3);
    });
  }

  /* ── Desktop: wheel-driven scroll lock ───────────────── */
  if (isDesktop && !reduced) {

    /* Initial state: code panel visible, cards hidden */
    cards.forEach(function (c) { c.style.opacity = '0'; });
    document.body.style.overflow = 'hidden';

    var animProgress = 0;
    var locked       = true;
    var pendingDelta = 0;
    var animRAF      = null;

    function unlock () {
      locked = false;
      document.body.style.overflow = '';
    }

    function relock () {
      locked       = true;
      animProgress = 0;
      pendingDelta = 0;
      document.body.style.overflow = 'hidden';
      runAnimation(0);
    }

    function processFrame () {
      animRAF = null;
      if (!locked) return;

      animProgress  = clamp(animProgress + pendingDelta / 320, 0, 1);
      pendingDelta  = 0;

      runAnimation(animProgress);

      if (animProgress >= 1) unlock();
    }

    /* Wheel – intercept while locked */
    window.addEventListener('wheel', function (e) {
      if (!locked) return;
      e.preventDefault();
      pendingDelta += e.deltaY;
      if (!animRAF) animRAF = requestAnimationFrame(processFrame);
    }, { passive: false });

    /* Keyboard – arrow / space / page */
    window.addEventListener('keydown', function (e) {
      if (!locked) return;
      var step = 0;
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') { step =  0.15; }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')                    { step = -0.15; }
      if (!step) return;
      e.preventDefault();
      animProgress = clamp(animProgress + step, 0, 1);
      runAnimation(animProgress);
      if (animProgress >= 1) unlock();
    });

    /* Re-lock when user scrolls back to very top */
    window.addEventListener('scroll', function () {
      if (!locked && window.scrollY === 0) relock();
    }, { passive: true });

  } else if (isDesktop && reduced) {
    /* Reduced motion: skip straight to cards */
    if (codePanel) codePanel.style.opacity = '0';
    cards.forEach(function (c) { c.style.opacity = '1'; });

  } else {
    /* Mobile: staggered card entrance, code panel fades out */
    if (codePanel) {
      setTimeout(function () {
        codePanel.style.transition = 'opacity 0.8s ease';
        codePanel.style.opacity   = '0';
      }, 600);
    }
    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transition = 'opacity 0.6s ease';
      setTimeout(function () { card.style.opacity = '1'; }, 500 + i * 180);
    });
  }

  /* ── Mousemove Tilt (always active) ──────────────────── */
  if (reduced) return;

  var targetX = 0, targetY = 0;
  var currentX = 0, currentY = 0;
  var raf = null;

  function tiltLoop () {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);
    stack.style.transform =
      'rotateX(' + currentY.toFixed(2) + 'deg) rotateY(' + currentX.toFixed(2) + 'deg)';
    raf = requestAnimationFrame(tiltLoop);
  }

  scene.addEventListener('mousemove', function (e) {
    var rect = scene.getBoundingClientRect();
    targetX  =  ((e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)) * 10;
    targetY  = -((e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)) * 7;
    if (!raf) raf = requestAnimationFrame(tiltLoop);
  });

  scene.addEventListener('mouseleave', function () { targetX = 0; targetY = 0; });

  if (!raf) raf = requestAnimationFrame(tiltLoop);
})();
