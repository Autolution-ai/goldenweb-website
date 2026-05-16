/* ═══════════════════════════════════════════════════════════
   VIDEO SCROLL  –  GSAP ScrollTrigger, korrekte Methode
   ═══════════════════════════════════════════════════════════

   Warum vorher nichts funktionierte:
   1. body { overflow-x: hidden } → erzeugt BFC → bricht sticky/pin
      Fix: overflow-x: clip in design-system.css (kein BFC!)
   2. Falsches GSAP-Pattern: onUpdate + manuelle Berechnung
      Fix: tl.to(video, { currentTime: video.duration, ease: "none" })
           GSAP interpoliert currentTime direkt – korrekte Methode.

   Ablauf:
   1. Blob-Preload → ganzes MP4 im Speicher, Seeks sofort
   2. loadedmetadata → duration bekannt
   3. GSAP Timeline mit pin:true (= position:fixed, kein sticky nötig)
      + scrub:1 + tl.to(video, currentTime)
   ═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  'use strict';

  var video     = document.getElementById('heroVideo');
  var loaderEl  = document.getElementById('heroLoader');
  var loaderBar = document.getElementById('heroLoaderBar');

  if (!video) return;

  /* ── Blob preload für frame-genaues Seeking ───────────── */
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

  /* ── GSAP ScrollTrigger Setup ─────────────────────────── */
  function initScrollTrigger (dur) {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger     : '#hero',
        start       : 'top top',
        end         : '+=' + Math.round(dur * 480), /* px pro Sekunde Video */
        scrub       : 1,          /* 1s Catch-Up → flüssiges Gefühl */
        pin         : true,       /* GSAP pin = position:fixed, kein CSS sticky */
        pinSpacing  : true,
        anticipatePin: 1
      }
    });

    /* Kern: GSAP interpoliert currentTime direkt von 0 → duration */
    tl.to(video, { currentTime: dur, ease: 'none' });
  }

  /* ══════════════════════════════════════════════════════
     Responsive Setup via gsap.matchMedia
     ══════════════════════════════════════════════════════ */
  var mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop   : '(min-width: 860px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    function (ctx) {
      var c = ctx.conditions;

      /* Mobile / Reduced Motion ─────────────────────────── */
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

      /* Desktop ─────────────────────────────────────────── */
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
          var dur = video.duration || 0;
          video.currentTime = 0;

          if (loaderEl) {
            loaderEl.style.transition = 'opacity 0.5s ease';
            loaderEl.style.opacity    = '0';
            setTimeout(function () { loaderEl.style.display = 'none'; }, 520);
          }

          initScrollTrigger(dur);
          ScrollTrigger.refresh();
        })
        .catch(function () {
          if (loaderEl) loaderEl.style.display = 'none';
          video.src = video.dataset.src;
          video.addEventListener('loadedmetadata', function () {
            initScrollTrigger(video.duration || 0);
          }, { once: true });
          video.load();
        });
    }
  );
})();
