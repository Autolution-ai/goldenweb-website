/* ═══════════════════════════════════════════════════════
   ANIMATIONS.JS – Scroll-Trigger + Count-Up
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Easing ── */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /* ══════════════════════════════════════
     Fade-Up Scroll Trigger
     ══════════════════════════════════════ */
  function initFadeUp() {
    const elements = document.querySelectorAll('.fade-up, .fade-in, .scale-up');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════
     Count-Up Animation
     ══════════════════════════════════════ */
  function countUp(el, target, duration) {
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutExpo(progress) * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            countUp(el, target, 2000);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════
     Process Steps Activation
     ══════════════════════════════════════ */
  function initProcessSteps() {
    const stepsWrapper = document.getElementById('processSteps');
    if (!stepsWrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stepsWrapper.classList.add('is-animating');

            const steps = stepsWrapper.querySelectorAll('.process-step');
            steps.forEach((step, i) => {
              setTimeout(() => {
                steps.slice(0, i).forEach((s) => {
                  s.classList.remove('is-active');
                  s.classList.add('is-done');
                });
                step.classList.add('is-active');
              }, i * 350);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(stepsWrapper);
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initFadeUp();
    initCountUp();
    initProcessSteps();
  });
})();
