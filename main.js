/* ================================================
   BARBER STUDIO — JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Cerrar menú al hacer click en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Cerrar menú al click fuera
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── BACK TO TOP ── */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── SCROLL REVEAL ── */
  const revealElements = () => {
    const elements = document.querySelectorAll(
      '.service-card, .team-card, .gallery-item, .schedule-item, .contact-item, .strip-item, .section-header, .horarios-info, .horarios-image, .contacto-info, .contacto-form, .stat'
    );
    elements.forEach(el => {
      el.classList.add('scroll-reveal');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger for grid children
          const siblings = entry.target.parentElement.querySelectorAll('.scroll-reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
  };
  revealElements();

  /* ── TESTIMONIALS SLIDER ── */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const cards = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  let autoplayTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    cards[currentSlide].style.opacity = '0';
    currentSlide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    cards[currentSlide].style.opacity = '1';
    dots.forEach(d => d.classList.remove('active'));
    dots[currentSlide].classList.add('active');
    resetAutoplay();
  }

  // Initially set all cards opacity
  cards.forEach((card, i) => { card.style.transition = 'opacity 0.4s'; card.style.opacity = i === 0 ? '1' : '0'; });

  document.getElementById('sliderPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('sliderNext').addEventListener('click', () => goToSlide(currentSlide + 1));

  function startAutoplay() {
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // Touch swipe for testimonials
  let touchStartX = 0;
  const slider = document.getElementById('testimonialsSlider');
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goToSlide(currentSlide + (delta > 0 ? 1 : -1));
  });

  /* ── CONTACT FORM ── */
  const form = document.getElementById('reservaForm');
  const formSuccess = document.getElementById('formSuccess');

  // Set min date to today
  const dateInput = document.getElementById('fecha');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1800);
  });

  function validateForm() {
    let valid = true;
    const required = form.querySelectorAll('[required]');

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e05555';
        valid = false;
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });

    if (!valid) {
      const firstInvalid = form.querySelector('[required]:invalid, [style*="e05555"]');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  }

  /* ── SMOOTH NAV HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── PARALLAX HERO ── */
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });

  /* ── GOLD CURSOR TRAIL ── */
  if (window.innerWidth > 768) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed; width: 6px; height: 6px;
      background: #c9a84c; border-radius: 50%;
      pointer-events: none; z-index: 9999;
      opacity: 0; transition: opacity 0.3s;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      trail.style.opacity = '0.7';
    });

    document.addEventListener('mouseleave', () => { trail.style.opacity = '0'; });

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.left = `${trailX - 3}px`;
      trail.style.top = `${trailY - 3}px`;
      requestAnimationFrame(animateTrail);
    };
    animateTrail();
  }

  /* ── COUNTER ANIMATION ── */
  const stats = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');

        if (isNaN(num)) return;

        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = start + (num - start) * eased;

          el.textContent = (Number.isInteger(num) ? Math.floor(current) : current.toFixed(1)) + suffix;

          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => counterObserver.observe(s));

  /* ── GALLERY LIGHTBOX (simple) ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-placeholder span')?.textContent || 'Trabajo';
      // Could integrate a real lightbox here; for demo, add a class
      item.classList.toggle('active');
    });
  });

  /* ── NAV ACTIVE STYLE ── */
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--gold) !important; }`;
  document.head.appendChild(style);

});