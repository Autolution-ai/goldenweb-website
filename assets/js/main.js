/* ═══════════════════════════════════════════════════════
   MAIN.JS – Nav, Hamburger, Marquee, Smooth Scroll
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     Navigation – Scroll Behavior
     ══════════════════════════════════════ */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;

    function updateNav() {
      if (window.scrollY > 80) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    updateNav();
  }

  /* ══════════════════════════════════════
     Hamburger / Mobile Menu
     ══════════════════════════════════════ */
  function initHamburger() {
    const btn = document.getElementById('navHamburger');
    const menu = document.getElementById('navMobile');
    if (!btn || !menu) return;

    const mobileLinks = menu.querySelectorAll('a');
    let isOpen = false;

    function openMenu() {
      isOpen = true;
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
      isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  }

  /* ══════════════════════════════════════
     Marquee – Pause on Hover
     ══════════════════════════════════════ */
  function initMarquee() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    marquee.addEventListener('mouseenter', () => {
      document.querySelectorAll('.marquee-track').forEach((t) => {
        t.style.animationPlayState = 'paused';
      });
    });

    marquee.addEventListener('mouseleave', () => {
      document.querySelectorAll('.marquee-track').forEach((t) => {
        t.style.animationPlayState = 'running';
      });
    });
  }

  /* ══════════════════════════════════════
     Active Nav Link on Scroll
     ══════════════════════════════════════ */
  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.style.color = '';
              if (link.getAttribute('href') === `#${id}`) {
                link.style.color = 'var(--color-gold)';
              }
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHamburger();
    initMarquee();
    initActiveLinks();
  });
})();
