/* ═══════════════════════════════════════════════════════
   ACCORDION.JS – FAQ
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      const body = item.querySelector('.faq-body');
      if (!trigger || !body) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        /* Alle anderen schließen */
        items.forEach((other) => {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            other.querySelector('.faq-body').style.maxHeight = null;
          }
        });

        /* Aktuelles togglen */
        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAccordion);
})();
