(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav shadow/blur intensifies once the page has scrolled past the hero top.
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile hamburger menu (only present on pages with more than one nav link).
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });
  }

  // Scroll progress bar across the top of the page.
  var progress = document.querySelector('.scroll-progress');
  function onProgress() {
    if (!progress) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = pct + '%';
  }
  onProgress();
  window.addEventListener('scroll', onProgress, { passive: true });

  if (reducedMotion) return;

  // Fade/slide-up reveal for elements marked `.reveal` (present in the markup
  // from the start, so CSS hides them before this script even runs - no
  // flash of visible content). Stagger delays for `.reveal-stagger` groups
  // are handled purely in CSS via nth-child, so there's no JS/CSS ordering
  // dependency here.
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Count-up animation for the stats strip, triggered once visible.
  var statValues = document.querySelectorAll('.stat-value[data-count-to]');
  if ('IntersectionObserver' in window && statValues.length) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          statObserver.unobserve(entry.target);
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count-to'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 900;
          var start = null;
          function step(ts) {
            if (start === null) start = ts;
            var elapsed = ts - start;
            var t = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    statValues.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  // Language switcher dropdown.
  var langSwitcher = document.querySelector('.lang-switcher');
  var langButton = document.querySelector('.lang-current');
  if (langSwitcher && langButton) {
    langButton.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = langSwitcher.classList.toggle('is-open');
      langButton.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!langSwitcher.contains(e.target)) {
        langSwitcher.classList.remove('is-open');
        langButton.setAttribute('aria-expanded', 'false');
      }
    });
    langSwitcher.querySelectorAll('.lang-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        try {
          localStorage.setItem('talvo-lang-choice', '1');
        } catch (err) {
          /* localStorage unavailable (private mode, etc.) - not critical, the click still navigates. */
        }
      });
    });
  }

  // Subtle parallax on the hero visual, following pointer movement on desktop.
  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var rect = null;
    heroVisual.addEventListener('mouseenter', function () {
      rect = heroVisual.getBoundingClientRect();
    });
    heroVisual.addEventListener('mousemove', function (e) {
      if (!rect) rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = 'rotate(' + (x * 3) + 'deg) translate(' + (x * 8) + 'px,' + (y * 8) + 'px)';
    });
    heroVisual.addEventListener('mouseleave', function () {
      heroVisual.style.transform = '';
    });
  }
})();
