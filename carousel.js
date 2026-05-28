/*
 * Streamly marketing carousel.
 * Crossfades between full-bleed slides on auto-rotate. No deps.
 * Markup:
 *   <div class="carousel-wrapper">
 *     <div class="phone-frame">                            // or .tv-frame
 *       <div class="carousel-track" data-carousel data-autoplay="4500">
 *         <img class="carousel-slide active" src="..." alt="Home" data-caption="Home">
 *         <img class="carousel-slide"        src="..." alt="Movies" data-caption="Movies">
 *       </div>
 *     </div>
 *     <div class="carousel-caption" data-carousel-caption></div>  // optional
 *     <div class="carousel-dots"    data-carousel-dots></div>     // dots injected here
 *   </div>
 *
 * Behavior:
 *   - Auto-advances every data-autoplay ms (default 4500).
 *   - Pauses on hover / focus-within / page-hidden.
 *   - Dots injected by JS for accessibility (real <button> elements, ARIA).
 *   - Respects prefers-reduced-motion (no auto-advance, dots still work).
 */
(function () {
  'use strict';

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(initCarousel);

  function initCarousel(track) {
    const wrapper      = track.closest('.carousel-wrapper');
    const dotsHost     = wrapper?.querySelector('[data-carousel-dots]');
    const captionEl    = wrapper?.querySelector('[data-carousel-caption]');
    const slides       = Array.from(track.querySelectorAll('.carousel-slide'));
    const intervalMs   = parseInt(track.dataset.autoplay, 10) || 4500;
    if (slides.length < 2) return;

    let current = slides.findIndex(s => s.classList.contains('active'));
    if (current < 0) current = 0;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));

    // Build dots
    const dots = [];
    if (dotsHost) {
      slides.forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Show ${slide.dataset.caption || slide.alt || `slide ${i + 1}`}`);
        dot.addEventListener('click', () => { goTo(i); restart(); });
        dotsHost.appendChild(dot);
        dots.push(dot);
      });
    }

    // Caption
    updateCaption();

    function goTo(i) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      updateCaption();
    }
    function next() { goTo(current + 1); }
    function updateCaption() {
      if (!captionEl) return;
      captionEl.textContent = slides[current].dataset.caption || slides[current].alt || '';
    }

    // Auto-rotate
    let timer = null;
    function start() {
      if (REDUCED_MOTION) return;
      stop();
      timer = setInterval(next, intervalMs);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    // Pause on hover / focus / hidden
    wrapper?.addEventListener('mouseenter', stop);
    wrapper?.addEventListener('mouseleave', start);
    wrapper?.addEventListener('focusin', stop);
    wrapper?.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    // Keyboard support (focus the carousel-wrapper first)
    wrapper?.setAttribute('tabindex', '-1');
    wrapper?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); restart(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); restart(); }
    });

    start();
  }
})();
