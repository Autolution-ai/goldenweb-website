/* ═══════════════════════════════════════════════════════════
   VIDEO SCROLL  –  GSAP ScrollTrigger + Blob preload
   ═══════════════════════════════════════════════════════════

   Why GSAP instead of position:sticky or wheel-event hack?
   ─ GSAP pins via position:fixed internally, bypassing the
     body { overflow-x: hidden } that breaks CSS sticky.
   ─ ScrollTrigger's onUpdate fires every scroll frame and
     maps self.progress (0–1) directly to video.currentTime.
   ─ Blob preload puts the full MP4 in memory so every frame
     is instantly seekable with no partial-content stalls.

   Scroll distance: duration × 450px per second of video
   (≈ 2250px for a 5s clip → comfortable cinematic speed)
   ═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  'use strict';

  var video     = document.getElementById('heroVideo');
  var loaderEl  = document.getElementById('heroLoader');
  var loaderBar = document.getElementById('heroLoaderBar');

  if (!video) return;

  var duration = 0;
  var ready    = false;

  /* ── Blob preloader ───────────────────────────────────── */
  function loadBlob (src) {
    return fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var cl = parseInt(res.headers.get('Content-Length') || '0', 10);

        if (cl > 0 && res.body && loaderBar) {
          var reader   = res.body.getReader();
          var received = 0;
          var chunks   = [];
          function pump () {
            return reader.read().then(function (r) {
              if (r.done) return new Blob(chunks, { type: 'video/mp4' });
              chunks.push(r.value);
              received += r.value.length;
              loaderBar.style.width =
                Math.min(98, Math.round(received / cl * 100)) + '%';
              return pump();
            });
          }
          return pump();
        }
        return res.blob();
      });
  }

  /* ── GSAP ScrollTrigger setup (called after video ready) ─ */
  function initScrollTrigger () {
    /* Scroll distance = 450px per second of video content */
    var scrollPx = Math.round(duration * 450);

    ScrollTrigger.create({
      trigger    : '#hero',
      start      : 'top top',
      end        : '+=' + scrollPx,
      pin        : true,          /* GSAP uses position:fixed → bypasses overflow-x:hidden */
      pinSpacing : true,          /* adds spacer so page content flows correctly after */
      anticipatePin: 1,           /* prevents snap-jump when pinning starts */
      onUpdate   : function (self) {
        if (!ready || !duration) return;
        video.currentTime = self.progress * duration;
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     gsap.matchMedia — handles desktop vs mobile and
     prefers-reduced-motion correctly
     ══════════════════════════════════════════════════════ */
  var mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop   : '(min-width: 860px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    function (ctx) {
      var c = ctx.conditions;

      /* Mobile / reduced-motion: static display only */
      if (!c.isDesktop || c.reduceMotion) {
        video.src = video.dataset.src;
        if (c.reduceMotion) {
          video.addEventListener('loadedmetadata', function () {
            video.currentTime = video.duration;
          }, { once: true });
        }
        if (loaderEl) loaderEl.style.display = 'none';
        video.load();
        return;
      }

      /* ── Desktop: blob preload → ScrollTrigger ───────── */
      if (loaderEl) loaderEl.style.display = 'flex';

      loadBlob(video.dataset.src)
        .then(function (blob) {
          if (loaderBar) loaderBar.style.width = '100%';
          video.src = URL.createObjectURL(blob);
          video.load();

          return new Promise(function (resolve) {
            if (video.readyState >= 1) { resolve(); return; }
            video.addEventListener('loadedmetadata', resolve, { once: true });
            setTimeout(resolve, 10000);
          });
        })
        .then(function () {
          duration          = video.duration || 0;
          video.currentTime = 0;
          ready             = true;

          /* Fade out loader */
          if (loaderEl) {
            loaderEl.style.transition = 'opacity 0.5s ease';
            loaderEl.style.opacity    = '0';
            setTimeout(function () { loaderEl.style.display = 'none'; }, 520);
          }

          initScrollTrigger();
          ScrollTrigger.refresh();
        })
        .catch(function () {
          /* Fallback: direct src without blob cache */
          if (loaderEl) loaderEl.style.display = 'none';
          video.src = video.dataset.src;
          video.addEventListener('loadedmetadata', function () {
            duration = video.duration || 0;
            ready    = true;
            initScrollTrigger();
            ScrollTrigger.refresh();
          }, { once: true });
          video.load();
        });
    }
  );

})();
