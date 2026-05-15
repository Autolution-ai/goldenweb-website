/* ═══════════════════════════════════════════════════════
   BEFORE / AFTER DRAG SLIDER – GoldenWeb
   ═══════════════════════════════════════════════════════ */

(function () {
  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      var handle = slider.querySelector('.ba-slider__handle');
      var after  = slider.querySelector('.ba-slider__after');
      var isDragging = false;

      function setPos(clientX) {
        var rect = slider.getBoundingClientRect();
        var x    = Math.max(0, Math.min(clientX - rect.left, rect.width));
        var pct  = (x / rect.width * 100).toFixed(2) + '%';
        slider.style.setProperty('--pos', pct);
      }

      function onMove(e) {
        if (!isDragging) return;
        var cx = e.touches ? e.touches[0].clientX : e.clientX;
        setPos(cx);
      }

      function onUp() { isDragging = false; }

      handle.addEventListener('mousedown', function (e) {
        isDragging = true;
        e.preventDefault();
      });

      handle.addEventListener('touchstart', function (e) {
        isDragging = true;
      }, { passive: true });

      slider.addEventListener('click', function (e) {
        setPos(e.clientX);
      });

      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('mouseup',   onUp);
      window.addEventListener('touchend',  onUp);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }
})();
