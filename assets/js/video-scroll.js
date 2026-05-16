/* ═══════════════════════════════════════════════════════════
   VIDEO SCROLL  –  Blob-preload + wheel-event interception
   ═══════════════════════════════════════════════════════════

   Why wheel-events instead of position:sticky?
   The global CSS has `body { overflow-x: hidden }` which
   silently breaks position:sticky on ALL descendants.
   Wheel-event interception is independent of CSS overflow
   and gives us true scroll-lock + precise frame control.

   Flow:
   1. Page loads  →  body locked, loader visible
   2. Fetch full MP4 as Blob  →  loader bar animates
   3. Set video.src = objectURL  →  loadedmetadata fires
   4. Loader fades out, ready = true
   5. Wheel/keyboard  →  video.currentTime driven by delta
   6. video reaches end  →  body unlocked, normal scroll
   7. User scrolls back to top  →  relock, video reset to 0
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var video     = document.getElementById('heroVideo');
  var loaderEl  = document.getElementById('heroLoader');
  var loaderBar = document.getElementById('heroLoaderBar');

  if (!video) return;

  var reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.innerWidth >= 860;

  /* ── Mobile / reduced-motion: show static first frame ──── */
  if (!isDesktop || reduced) {
    video.src = video.dataset.src;
    if (reduced) {
      video.addEventListener('loadedmetadata', function () {
        video.currentTime = video.duration;
      }, { once: true });
    }
    if (loaderEl) loaderEl.style.display = 'none';
    video.load();
    return;
  }

  /* ══════════════════════════════════════════════════════
     DESKTOP  –  full scroll-lock + video scrubbing
     ══════════════════════════════════════════════════════ */

  var locked       = true;
  var ready        = false;
  var pendingDelta = 0;
  var rafId        = null;
  var duration     = 0;

  /* Lock body scroll immediately */
  document.body.style.overflow = 'hidden';

  /* Show loader */
  if (loaderEl) loaderEl.style.display = 'flex';

  /* ── unlock / relock ──────────────────────────────────── */
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

  /* ── RAF frame processor ──────────────────────────────── */
  function processFrame () {
    rafId = null;
    if (!ready || !locked || !duration) return;

    /* Map wheel delta to seconds  (higher = slower scroll feel) */
    var dt   = pendingDelta / 550;
    pendingDelta = 0;

    var next = Math.max(0, Math.min(duration, video.currentTime + dt));
    video.currentTime = next;

    if (next >= duration) unlock();
  }

  /* ── Wheel – intercept while locked ──────────────────── */
  window.addEventListener('wheel', function (e) {
    if (!locked) return;
    e.preventDefault();
    pendingDelta += e.deltaY;
    if (!rafId) rafId = requestAnimationFrame(processFrame);
  }, { passive: false });

  /* ── Keyboard support ─────────────────────────────────── */
  window.addEventListener('keydown', function (e) {
    if (!locked || !ready) return;
    var step = 0;
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') step =  0.35;
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')                    step = -0.35;
    if (!step) return;
    e.preventDefault();
    var next = Math.max(0, Math.min(duration, video.currentTime + step));
    video.currentTime = next;
    if (next >= duration) unlock();
  });

  /* ── Re-lock on scroll-to-top ────────────────────────── */
  window.addEventListener('scroll', function () {
    if (!locked && window.scrollY === 0) relock();
  }, { passive: true });

  /* ══════════════════════════════════════════════════════
     Blob preloader  –  fetches entire file so every
     frame is instantly seekable (no partial-content stalls)
     ══════════════════════════════════════════════════════ */
  function loadBlob (src) {
    return fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);

        var contentLength = parseInt(res.headers.get('Content-Length') || '0', 10);

        /* Chunked read with progress bar */
        if (contentLength > 0 && res.body && loaderBar) {
          var reader   = res.body.getReader();
          var received = 0;
          var chunks   = [];

          function pump () {
            return reader.read().then(function (chunk) {
              if (chunk.done) return new Blob(chunks, { type: 'video/mp4' });
              chunks.push(chunk.value);
              received += chunk.value.length;
              loaderBar.style.width =
                Math.min(98, Math.round(received / contentLength * 100)) + '%';
              return pump();
            });
          }
          return pump();
        }

        /* Fallback: no content-length → load whole blob at once */
        return res.blob();
      });
  }

  /* ── Init sequence ────────────────────────────────────── */
  loadBlob(video.dataset.src)
    .then(function (blob) {
      if (loaderBar) loaderBar.style.width = '100%';
      video.src = URL.createObjectURL(blob);
      video.load();

      return new Promise(function (resolve) {
        if (video.readyState >= 1) { resolve(); return; }
        video.addEventListener('loadedmetadata', resolve, { once: true });
        setTimeout(resolve, 10000); /* hard timeout */
      });
    })
    .then(function () {
      duration = video.duration || 0;
      video.currentTime = 0;
      ready = true;

      /* Fade out loader */
      if (loaderEl) {
        loaderEl.style.transition = 'opacity 0.5s ease';
        loaderEl.style.opacity    = '0';
        setTimeout(function () { loaderEl.style.display = 'none'; }, 520);
      }
    })
    .catch(function () {
      /* Fallback: use src attribute directly */
      if (loaderEl) loaderEl.style.display = 'none';
      video.src = video.dataset.src;
      video.addEventListener('loadedmetadata', function () {
        duration = video.duration || 0;
        ready    = true;
      }, { once: true });
      video.load();
    });

})();
