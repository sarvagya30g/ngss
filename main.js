/* ============================================================
   NGSS VENTURE GENESIS — JAVASCRIPT
   ============================================================ */

// ----- NAVBAR SCROLL EFFECT -----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ----- MOBILE NAV TOGGLE -----
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ----- ACTIVE NAV LINK ON SCROLL -----
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < bottom) {
      allNavLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

// ----- SCROLL-TRIGGERED FADE ANIMATIONS -----
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.who-card, .sector-card, .reason-item, .adv-point, .service-item, .about-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of the same parent
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ----- ANIMATED COUNTERS -----
function animateCounter(el, target, suffix, duration = 1600) {
  const isFloat  = target % 1 !== 0;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = [
    { selector: '.hero-stats .stat-item:nth-child(1) .stat-num', end: 1100, suffix: '+' },
    { selector: '.hero-stats .stat-item:nth-child(3) .stat-num', end: 6,    suffix: '%', prefix: '<' },
    { selector: '.hero-stats .stat-item:nth-child(5) .stat-num', end: 5,    suffix: '' },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => {
          const el = document.querySelector(c.selector);
          if (!el) return;
          const suffix = document.createElement('span');
          suffix.className = 'stat-plus';
          suffix.textContent = c.suffix;
          el.innerHTML = (c.prefix || '') + '0';
          el.appendChild(suffix);
          animateCounter(
            el.childNodes[0].nodeType === 3
              ? el.childNodes[0]
              : el,
            c.end, '', 1800
          );
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const stats = document.querySelector('.hero-stats');
  if (stats) observer.observe(stats);
}

// ----- CONTACT FORM HANDLING -----
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach(el => el.remove());

    // Validate required fields
    const required = form.querySelectorAll('[required]');
    required.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.textContent = 'This field is required.';
        field.insertAdjacentElement('afterend', msg);
        valid = false;
      }
    });

    // Validate email format
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      emailField.classList.add('error');
      const existing = emailField.nextElementSibling;
      if (!existing || !existing.classList.contains('error-msg')) {
        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.textContent = 'Please enter a valid email address.';
        emailField.insertAdjacentElement('afterend', msg);
      }
      valid = false;
    }

    if (!valid) return;

    // Simulate form submission (replace with real endpoint as needed)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ----- SMOOTH ANCHOR SCROLL -----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ----- INIT -----
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initContactForm();
  initSmoothScroll();
});
