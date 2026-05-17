(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  var stage = document.getElementById('animStage');
  if (!stage) return;

  function scaleEndframe() {
    var ef = document.getElementById('efFrameWrap');
    if (!ef) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var naturalH = ef.offsetHeight || 780;
    var scaleW = (vw * 0.96) / 1280;
    var scaleH = (vh * 0.88) / naturalH;
    var s = Math.min(scaleW, scaleH);
    ef.style.transform = 'scale(' + s + ')';
    ef.style.transformOrigin = 'top center';
  }

  /* Anfangszustand */
  gsap.set('#layerEnd',  { opacity: 0 });
  gsap.set('.end-nav, .end-hero-s, .end-process, .end-rail', { opacity: 0, y: 18 });
  gsap.set('#efTagline', { opacity: 0, y: 12 });

  window.addEventListener('load', scaleEndframe);
  window.addEventListener('resize', function () {
    scaleEndframe();
    ScrollTrigger.refresh();
  }, { passive: true });

  var mm = gsap.matchMedia();

  /* ── Desktop: Scroll-Animation ── */
  mm.add('(min-width: 860px)', function () {

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start:  'top top',
        end:    '+=2000',
        scrub:  0.4,
        pin:    true,
        pinSpacing: true,
      }
    });

    /* Shell-Chrome sofort ausblenden */
    tl.to('.anim-shell-head', { opacity: 0, y: -8, duration: 0.06 }, 0);
    tl.to('.anim-code-root',  { opacity: 0, duration: 0.05 }, 0);
    tl.to('.anim-status',     { opacity: 0, duration: 0.05 }, 0);
    tl.to('.anim-prompt',     { opacity: 0, duration: 0.04 }, 0);

    /* Code-Gruppen fliegen mit steigender Beschleunigung raus */
    var groups = [
      { id: 'nav',        t: 0.00, dur: 0.12, ease: 'power1.in' },
      { id: 'hero',       t: 0.08, dur: 0.10, ease: 'power2.in' },
      { id: 'system',     t: 0.15, dur: 0.09, ease: 'power2.in' },
      { id: 'pakete',     t: 0.21, dur: 0.08, ease: 'power3.in' },
      { id: 'referenzen', t: 0.27, dur: 0.07, ease: 'power3.in' },
      { id: 'footer',     t: 0.32, dur: 0.06, ease: 'power4.in' },
    ];
    groups.forEach(function (g) {
      var el = document.querySelector('.anim-code-group[data-id="' + g.id + '"]');
      if (el) tl.to(el, { x: '130vw', opacity: 0, duration: g.dur, ease: g.ease }, g.t);
    });

    /* Terminal-Layer selbst beginnt früh zu verblassen – Endframe scheint durch */
    tl.to('#layerStart', { opacity: 0, duration: 0.22, ease: 'power1.out' }, 0.12);

    /* Endframe erscheint – überlappt mit Code-Exit */
    tl.to('#layerEnd',    { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.06);
    tl.to('.end-nav',     { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' }, 0.14);
    tl.to('.end-hero-s',  { opacity: 1, y: 0, duration: 0.13, ease: 'power2.out' }, 0.22);
    tl.to('.end-process', { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.40);
    tl.to('.end-rail',    { opacity: 1,        duration: 0.07                    }, 0.56);

    /* Tagline zuletzt */
    tl.to('#efTagline',   { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.64);
  });

  /* ── Mobile: statisch, kein Scroll-Effekt ── */
  mm.add('(max-width: 859px)', function () {
    gsap.set('#layerStart', { opacity: 0 });
    gsap.set('#layerEnd',   { opacity: 1 });
    gsap.set('.end-nav, .end-hero-s, .end-process, .end-rail', { opacity: 1, y: 0 });
    gsap.set('#efTagline',  { opacity: 1, y: 0 });
  });

})();
