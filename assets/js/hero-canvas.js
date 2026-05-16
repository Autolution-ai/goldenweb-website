/* ═══════════════════════════════════════════════════════════
   HERO CANVAS SCRUBBER
   ─────────────────────────────────────────────────────────
   81 JPEG-Frames statt video.currentTime – kein Decoder-Lag,
   kein Blank-Frame, funktioniert in jedem Browser.

   Ablauf:
   1. Frames 1–8 mit fetchPriority:high parallel laden
   2. Sobald 8 geladen → GSAP ScrollTrigger initialisieren
      (scrubben geht los, nearestLoaded() fängt fehlende Frames ab)
   3. Rest der Frames im Hintergrund laden
   4. DPR-aware Canvas Resize bei Window-Resize
   ═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

(function () {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx         = canvas.getContext('2d');
  var FRAME_COUNT = 81;
  var FRAME_DIR   = 'assets/media/frames/';
  var PRIORITY    = 8;   /* erste N Frames mit high-priority laden */
  var PX_PER_FRAME = 30; /* Scrollpixel pro Frame → Gesamtscroll = 81×30 = 2430px */

  var images   = new Array(FRAME_COUNT);
  var loaded   = new Array(FRAME_COUNT).fill(false);
  var curFrame = 0;

  /* ── Hilfsfunktionen ──────────────────────────────────── */

  function src (i) {
    return FRAME_DIR + 'frame_' + String(i + 1).padStart(3, '0') + '.jpg';
  }

  /* Nächster geladener Frame als Fallback */
  function nearestLoaded (index) {
    for (var d = 1; d < FRAME_COUNT; d++) {
      if (index - d >= 0 && loaded[index - d]) return images[index - d];
      if (index + d < FRAME_COUNT && loaded[index + d]) return images[index + d];
    }
    return null;
  }

  /* Canvas auf Containergröße × DPR setzen */
  function resizeCanvas () {
    var dpr  = Math.min(window.devicePixelRatio || 1, 2);
    var el   = canvas.parentElement;
    canvas.width  = Math.round(el.offsetWidth  * dpr);
    canvas.height = Math.round(el.offsetHeight * dpr);
  }

  /* Frame auf Canvas zeichnen (object-fit: cover) */
  function drawFrame (index) {
    var img = (loaded[index] ? images[index] : null) || nearestLoaded(index);
    if (!img) return;

    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var scale = Math.max(cw / iw, ch / ih);
    var x = (cw - iw * scale) / 2;
    var y = (ch - ih * scale) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, iw * scale, ih * scale);
  }

  /* ── GSAP ScrollTrigger ───────────────────────────────── */

  function initScrollTrigger () {
    var proxy = { frame: 0 };

    gsap.to(proxy, {
      frame    : FRAME_COUNT - 1,
      snap     : 'frame',
      ease     : 'none',
      scrollTrigger: {
        trigger    : '#hero',
        start      : 'top top',
        end        : '+=' + (FRAME_COUNT * PX_PER_FRAME),
        scrub      : 0.3,
        pin        : true,
        pinSpacing : true,
        onUpdate   : function () {
          var f = Math.round(proxy.frame);
          if (f !== curFrame) {
            curFrame = f;
            drawFrame(f);
          }
        }
      }
    });
  }

  /* ── Preload ──────────────────────────────────────────── */

  var scrollTriggerInited = false;

  function loadFrame (i, high) {
    var img = new Image();
    if (high) img.fetchPriority = 'high';

    img.onload = function () {
      loaded[i] = true;

      /* Erstes geladenes Frame: Canvas zeigen + ScrollTrigger starten */
      if (!scrollTriggerInited) {
        scrollTriggerInited = true;
        resizeCanvas();
        drawFrame(i);
        initScrollTrigger();
      } else {
        /* Wenn aktuelles Frame nachgeladen: neu zeichnen */
        if (i === curFrame) drawFrame(i);
      }
    };

    img.src    = src(i);
    images[i]  = img;
  }

  /* Responsive: gsap.matchMedia für Desktop / Mobile */
  var mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop   : '(min-width: 860px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    function (ctx) {
      var c = ctx.conditions;

      if (!c.isDesktop) {
        /* Mobile: erstes Frame statisch laden und zeichnen */
        var img = new Image();
        img.onload = function () {
          resizeCanvas();
          loaded[0] = true;
          images[0] = img;
          drawFrame(0);
        };
        img.src = src(0);
        return;
      }

      if (c.reduceMotion) {
        /* Reduced motion: letztes Frame zeigen */
        var last = new Image();
        last.onload = function () {
          resizeCanvas();
          loaded[FRAME_COUNT - 1] = true;
          images[FRAME_COUNT - 1] = last;
          drawFrame(FRAME_COUNT - 1);
        };
        last.src = src(FRAME_COUNT - 1);
        return;
      }

      /* Desktop: Prioritäts-Frames zuerst, Rest im Hintergrund */
      for (var i = 0; i < PRIORITY; i++)      loadFrame(i, true);
      for (var j = PRIORITY; j < FRAME_COUNT; j++) loadFrame(j, false);
    }
  );

  /* ── Resize ───────────────────────────────────────────── */
  window.addEventListener('resize', function () {
    resizeCanvas();
    drawFrame(curFrame);
    ScrollTrigger.refresh();
  }, { passive: true });

})();
