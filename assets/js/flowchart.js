/* ═══════════════════════════════════════════════════════
   FLOWCHART.JS – System-Diagramm Animation
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initFlowchart() {
    const flowchart = document.getElementById('flowchart');
    if (!flowchart) return;

    const nodes = flowchart.querySelectorAll('.flowchart__node');
    const arrows = flowchart.querySelectorAll('.flowchart__arrow-path');

    function animateNodes() {
      nodes.forEach((node, i) => {
        setTimeout(() => {
          node.classList.add('is-visible');

          /* Arrow nach jedem Node außer dem letzten */
          if (arrows[i]) {
            setTimeout(() => {
              arrows[i].classList.add('is-drawn');
            }, 200);
          }
        }, i * 300);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNodes();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(flowchart);
  }

  document.addEventListener('DOMContentLoaded', initFlowchart);
})();
