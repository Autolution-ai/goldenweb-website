/* ═══════════════════════════════════════════════════════
   HERO 3D – Mousemove Tilt + Float
   ═══════════════════════════════════════════════════════ */

(function () {
  var scene = document.getElementById('heroScene');
  var stack = document.getElementById('uiStack');
  if (!scene || !stack) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targetX = 0, targetY = 0;
  var currentX = 0, currentY = 0;
  var raf = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);
    stack.style.transform = 'rotateX(' + currentY.toFixed(2) + 'deg) rotateY(' + currentX.toFixed(2) + 'deg)';
    raf = requestAnimationFrame(animate);
  }

  scene.addEventListener('mousemove', function (e) {
    var rect = scene.getBoundingClientRect();
    var dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    var dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    targetX =  dx * 10;
    targetY = -dy * 7;
    if (!raf) raf = requestAnimationFrame(animate);
  });

  scene.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
  });

  /* Stagger card entrance on load */
  var cards = stack.querySelectorAll('.ui-card');
  cards.forEach(function (card, i) {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(function () {
      card.style.opacity = '1';
    }, 400 + i * 180);
  });
})();
