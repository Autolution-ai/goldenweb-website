(function () {

  function syncScrollDistance(slider) {
    var imgs      = Array.from(slider.querySelectorAll('.ba-slider__track img'));
    var sliderH   = slider.offsetHeight;

    function calculate() {
      var min = Infinity;
      imgs.forEach(function (img) {
        if (!img.complete || img.naturalHeight === 0) return;
        var scrollable = img.offsetHeight - sliderH;
        if (scrollable > 0) min = Math.min(min, scrollable);
      });
      if (min < Infinity) {
        slider.style.setProperty('--ba-scroll', '-' + Math.round(min * 0.92) + 'px');
      }
    }

    calculate();
    imgs.forEach(function (img) { img.addEventListener('load', calculate); });
    window.addEventListener('load', calculate);
    window.addEventListener('resize', calculate);
  }

  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      var handle     = slider.querySelector('.ba-slider__handle');
      var isDragging = false;

      syncScrollDistance(slider);

      function setPos(clientX) {
        var rect = slider.getBoundingClientRect();
        var x    = Math.max(0, Math.min(clientX - rect.left, rect.width));
        slider.style.setProperty('--pos', (x / rect.width * 100).toFixed(2) + '%');
      }

      function onMove(e) {
        if (!isDragging) return;
        setPos(e.touches ? e.touches[0].clientX : e.clientX);
      }

      function onDown(e) {
        isDragging = true;
        slider.classList.add('is-dragging');
        e.preventDefault();
      }

      function onUp() {
        if (!isDragging) return;
        isDragging = false;
        slider.classList.remove('is-dragging');
      }

      handle.addEventListener('mousedown',  onDown);
      handle.addEventListener('touchstart', function () {
        isDragging = true;
        slider.classList.add('is-dragging');
      }, { passive: true });

      slider.addEventListener('click', function (e) {
        if (!isDragging) setPos(e.clientX);
      });

      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove',  onMove, { passive: true });
      window.addEventListener('mouseup',    onUp);
      window.addEventListener('touchend',   onUp);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }
})();
