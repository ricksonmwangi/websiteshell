/* =============================================================
   THEME — apply immediately to prevent flash of wrong theme
   ============================================================= */
(function () {
  var KEY = 'dc-theme';
  var html = document.documentElement;
  var saved = localStorage.getItem(KEY);
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  html.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  });
})();

/* =============================================================
   NAVBAR — scroll effects, active link highlight, hamburger
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var navbar    = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  var allLinks  = document.querySelectorAll('.nav-link');
  var sectionIds = ['home', 'about', 'stack', 'process', 'pricing', 'contact'];
  var sections   = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActive();
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  function updateActive() {
    var current = 'home';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    allLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  updateActive();
});

/* =============================================================
   ANIMATIONS — scroll reveal via IntersectionObserver
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var animated = [
    '.stack-card', '.process-step', '.pricing-card',
    '.about-values .value-item', '.contact-method', '.addon'
  ];
  animated.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add('reveal', 'reveal-delay-' + (Math.min(i + 1, 5)));
    });
  });
  document.querySelectorAll('.section-header, .about-content, .contact-info').forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }
  // Also trigger visible for any already-in-view elements on load
  setTimeout(function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) { el.classList.add('visible'); }
    });
  }, 100);
});

/* =============================================================
   CONTACT FORM — validation and simulated submission
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var form       = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelectorAll('input, textarea, select').forEach(function (f) { f.style.borderColor = ''; });

    var valid = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      if (!f.value.trim()) { f.style.borderColor = '#ef4444'; valid = false; }
    });

    var emailField = document.getElementById('email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = '#ef4444';
      valid = false;
    }
    if (!valid) return;

    var btn  = form.querySelector('[type="submit"]');
    var orig = btn.textContent;
    btn.textContent = 'Sending\u2026';
    btn.disabled = true;

    setTimeout(function () {
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(function () { successMsg.classList.remove('show'); }, 5000);
      }
    }, 1200);
  });

  form.querySelectorAll('input, textarea, select').forEach(function (f) {
    f.addEventListener('input', function () { f.style.borderColor = ''; });
  });
});

/* =============================================================
   LEGAL PANELS — show / hide Privacy and Terms sections
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var privacy = document.getElementById('privacy');
  var terms   = document.getElementById('terms');

  function showLegal(id) {
    [privacy, terms].forEach(function (s) { if (s) s.classList.remove('legal-visible'); });
    var target = document.getElementById(id);
    if (!target) return;
    target.classList.add('legal-visible');
    setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  }

  function hideLegal(panel) {
    if (!panel) return;
    panel.classList.remove('legal-visible');
    var footer = document.querySelector('.footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.open-legal').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showLegal(this.getAttribute('data-target'));
    });
  });

  var closePrivacy = document.getElementById('closePrivacy');
  var closeTerms   = document.getElementById('closeTerms');
  if (closePrivacy) closePrivacy.addEventListener('click', function () { hideLegal(privacy); });
  if (closeTerms)   closeTerms.addEventListener('click',   function () { hideLegal(terms); });

  document.querySelectorAll('.legal-back-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      [privacy, terms].forEach(function (s) { if (s) s.classList.remove('legal-visible'); });
      var contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

/* =============================================================
   HERO STARS — animated star field (dark mode only)
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('heroStars');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var stars = [];
  var raf = null;

  function resize() {
    // Use the hero section dimensions, not the canvas element itself
    var hero = canvas.parentElement || document.body;
    canvas.width  = hero.offsetWidth  || window.innerWidth;
    canvas.height = hero.offsetHeight || window.innerHeight;
  }

  function buildStars() {
    stars = [];
    for (var i = 0; i < 200; i++) {
      stars.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.5 + 0.2,
        a:  Math.random(),
        da: (Math.random() - 0.5) * 0.007
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.globalAlpha = Math.max(0, Math.min(1, s.a)) * 0.78;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  function start() {
    if (raf) return;
    resize();
    buildStars();
    draw();
  }

  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Hero is always dark-navy — stars always run
  function sync() { start(); }

  window.addEventListener('resize', function () {
    resize(); buildStars();
  }, { passive: true });

  sync();
});
