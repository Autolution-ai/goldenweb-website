/* ═══════════════════════════════════════════════════════
   VIDEO SCROLL – Wheel-driven video scrubbing + scroll lock
   ═══════════════════════════════════════════════════════ */

(function () {
  var video = document.getElementById('heroVideo');
  if (!video) return;

  var reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.innerWidth >= 860;

  /* ── Reduced motion: jump straight to end ─────────── */
  if (reduced) {
    video.addEventListener('loadedmetadata', function () {
      video.currentTime = video.duration;
    });
    video.load();
    return;
  }

  /* ── Mobile: just show video, no scroll lock ──────── */
  if (!isDesktop) {
    video.load();
    return;
  }

  /* ══════════════════════════════════════════════════
     DESKTOP – wheel-event interception
     ══════════════════════════════════════════════════ */

  var locked       = true;
  var pendingDelta = 0;
  var rafId        = null;
  var duration     = 0;

  /* Lock body scroll on load */
  document.body.style.overflow = 'hidden';

  function unlock () {
    locked = false;
    document.body.style.overflow = '';
  }

  function relock () {
    locked       = true;
    pendingDelta = 0;
    document.body.style.overflow = 'hidden';
    if (duration) video.currentTime = 0;
  }

  function processFrame () {
    rafId = null;
    if (!locked || !duration) return;

    /* Map wheel delta → seconds (600 = comfortable scroll speed) */
    var dt = pendingDelta / 600;
    pendingDelta = 0;

    var next = Math.max(0, Math.min(duration, video.currentTime + dt));
    video.currentTime = next;

    if (next >= duration) unlock();
  }

  /* Wheel – intercept while locked */
  window.addEventListener('wheel', function (e) {
    if (!locked) return;
    e.preventDefault();
    pendingDelta += e.deltaY;
    if (!rafId) rafId = requestAnimationFrame(processFrame);
  }, { passive: false });

  /* Keyboard – arrow / space / page */
  window.addEventListener('keydown', function (e) {
    if (!locked) return;
    var step = 0;
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') step =  0.4;
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')                    step = -0.4;
    if (!step) return;
    e.preventDefault();
    if (!duration) return;
    var next = Math.max(0, Math.min(duration, video.currentTime + step));
    video.currentTime = next;
    if (next >= duration) unlock();
  });

  /* Re-lock when user scrolls back to top */
  window.addEventListener('scroll', function () {
    if (!locked && window.scrollY === 0) relock();
  }, { passive: true });

  /* Init video */
  video.addEventListener('loadedmetadata', function () {
    duration = video.duration;
    video.currentTime = 0;
  });

  video.load();
})();
