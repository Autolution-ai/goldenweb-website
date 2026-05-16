/* ═══════════════════════════════════════════════════════
   VIDEO SCROLL – Blob preload + sticky scroll scrubbing
   ═══════════════════════════════════════════════════════
   Technique:
   • Fetch the entire MP4 as a Blob so the browser has
     every byte in memory – eliminates partial-content
     seek stalls that cause the choppy / frozen look.
   • Hero section = tall scroll container (350vh).
   • Hero sticky div = position: sticky; height: 100svh.
   • Scroll progress (0–1) maps to video.currentTime.
   • requestAnimationFrame + ticking guard = at most one
     seek write per paint frame.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var video     = document.getElementById('heroVideo');
  var hero      = document.getElementById('hero');
  var loaderEl  = document.getElementById('heroLoader');
  var loaderBar = document.getElementById('heroLoaderBar');

  if (!video || !hero) return;

  var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking  = false;
  var ready    = false;
  var duration = 0;

  /* ── Frame update ─────────────────────────────────────── */
  function updateFrame () {
    ticking = false;
    if (!ready || duration <= 0) return;

    var rect     = hero.getBoundingClientRect();
    var scrolled = -rect.top;                          /* px scrolled into section */
    var total    = hero.offsetHeight - window.innerHeight; /* total scrollable px    */
    if (total <= 0) return;

    var progress = Math.max(0, Math.min(0.999, scrolled / total));
    video.currentTime = progress * duration;
  }

  function onScroll () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateFrame);
    }
  }

  /* ── Blob preloader with progress bar ────────────────── */
  function fetchBlob (src) {
    return fetch(src).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);

      var contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
      if (!contentLength || !response.body) {
        return response.blob();
      }

      /* Chunked read so we can show a progress bar */
      var reader   = response.body.getReader();
      var received = 0;
      var chunks   = [];

      function pump () {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(r.value);
          received += r.value.length;
          if (loaderBar) {
            loaderBar.style.width =
              Math.min(99, Math.round(received / contentLength * 100)) + '%';
          }
          return pump();
        });
      }
      return pump();
    });
  }

  /* ── Main init ────────────────────────────────────────── */
  function init () {
    var src = video.dataset.src;
    if (!src) return;

    if (loaderEl) loaderEl.style.display = 'flex';

    fetchBlob(src)
      .then(function (blob) {
        if (loaderBar) loaderBar.style.width = '100%';
        var objectURL = URL.createObjectURL(blob);
        video.src = objectURL;
        video.load();

        /* Wait for metadata to know duration */
        return new Promise(function (resolve) {
          if (video.readyState >= 1) { resolve(); return; }
          video.addEventListener('loadedmetadata', resolve, { once: true });
          setTimeout(resolve, 8000); /* hard timeout */
        });
      })
      .then(function () {
        duration             = video.duration || 0;
        video.currentTime    = 0;
        ready                = true;

        /* Fade out loader */
        if (loaderEl) {
          loaderEl.style.transition = 'opacity 0.4s ease';
          loaderEl.style.opacity    = '0';
          setTimeout(function () { loaderEl.style.display = 'none'; }, 420);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function () {
          ticking = false;
          onScroll();
        }, { passive: true });

        onScroll(); /* set initial frame */
      })
      .catch(function () {
        /* Fallback: use the src directly without blob caching */
        if (loaderEl) loaderEl.style.display = 'none';
        video.src = src;
        video.addEventListener('loadedmetadata', function () {
          duration = video.duration || 0;
          ready    = true;
          window.addEventListener('scroll', onScroll, { passive: true });
          onScroll();
        }, { once: true });
        video.load();
      });
  }

  /* ── Reduced motion: jump to last frame ──────────────── */
  if (reduced) {
    video.src = video.dataset.src;
    video.addEventListener('loadedmetadata', function () {
      video.currentTime = video.duration;
    }, { once: true });
    video.load();
    return;
  }

  /* ── Mobile: plain display at frame 0, no scrubbing ──── */
  if (window.innerWidth < 860) {
    if (loaderEl) loaderEl.style.display = 'none';
    video.src = video.dataset.src;
    video.load();
    return;
  }

  init();
})();
