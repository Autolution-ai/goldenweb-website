/* ═══════════════════════════════════════════════════════
   CAROUSEL.JS – Case Studies (Mobile Swipe + Dots)
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initCarousel() {
    const grid = document.getElementById('casesGrid');
    const dotsContainer = document.getElementById('carouselDots');
    if (!grid || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    /* Update dots on scroll */
    function updateDots() {
      if (window.innerWidth >= 768) return;

      const cards = grid.querySelectorAll('.case-card');
      const scrollLeft = grid.scrollLeft;
      const cardWidth = cards[0]?.offsetWidth + 16 || 0;
      const activeIndex = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    }

    grid.addEventListener('scroll', updateDots, { passive: true });

    /* Dot click → scroll to card */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const cards = grid.querySelectorAll('.case-card');
        const card = cards[i];
        if (card) {
          grid.scrollTo({
            left: card.offsetLeft - 24,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initCarousel);
})();
