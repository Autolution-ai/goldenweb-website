/* ═══════════════════════════════════════════════════════
   VIDEO SCROLL – Scroll-driven video scrubbing
   ═══════════════════════════════════════════════════════ */

(function () {
  var video   = document.getElementById('heroVideo');
  var wrapper = document.getElementById('hero');

  if (!video || !wrapper) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reduced motion: jump to last frame, done */
  if (reduced) {
    video.addEventListener('loadedmetadata', function () {
      video.currentTime = video.duration;
    });
    return;
  }

  var duration = 0;
  var ticking  = false;

  function updateFrame () {
    var rect     = wrapper.getBoundingClientRect();
    var scrolled = -rect.top;
    var total    = rect.height - window.innerHeight;
    var progress = Math.max(0, Math.min(1, scrolled / total));
    video.currentTime = progress * duration;
    ticking = false;
  }

  function onScroll () {
    if (!ticking) {
      requestAnimationFrame(updateFrame);
      ticking = true;
    }
  }

  video.addEventListener('loadedmetadata', function () {
    duration = video.duration;
    updateFrame();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  /* Preload trigger – needed on some browsers */
  video.load();
})();
