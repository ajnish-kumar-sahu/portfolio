/* ============================================
   PREMIUM GSAP ANIMATIONS & SaaS INTERACTIONS V2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth <= 768;

  // ─── PREMIUM PAGE LOADER ───
  const loader = document.querySelector('.page-loader');
  if (loader) {
    const loaderTl = gsap.timeline();
    const pctEl = loader.querySelector('.loader-percent');
    const statusEl = loader.querySelector('.loader-status');
    const statusMessages = ['Loading assets...', 'Initializing components...', 'Almost ready...', 'Welcome!'];
    let msgIdx = 0;

    loaderTl
      // Icon entrance
      .from('.loader-logo-icon', { scale: 0, rotation: -180, duration: 0.6, ease: 'back.out(2)' }, 0.2)
      .from('.loader-ring', { scale: 0, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.3)
      // Progress bar fill
      .to('.loader-bar-fill', {
        width: '100%', duration: 2, ease: 'power1.inOut',
        onUpdate: function () {
          const pct = Math.round(this.progress() * 100);
          if (pctEl) pctEl.textContent = pct + '%';
          // Update status message at thresholds
          const newIdx = pct < 30 ? 0 : pct < 60 ? 1 : pct < 90 ? 2 : 3;
          if (statusEl && newIdx !== msgIdx) {
            msgIdx = newIdx;
            gsap.to(statusEl, { opacity: 0, duration: 0.15, onComplete: () => {
              statusEl.textContent = statusMessages[msgIdx];
              gsap.to(statusEl, { opacity: 1, duration: 0.15 });
            }});
          }
        }
      }, 0.6)
      // Exit sequence
      .to('.loader-logo-icon', { scale: 1.3, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to('.loader-text', { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.25')
      .to('.loader-ring', { scale: 1.5, opacity: 0, duration: 0.3 }, '-=0.25')
      .to('.loader-progress', { y: 10, opacity: 0, duration: 0.2 }, '-=0.2')
      .to('.loader-status', { opacity: 0, duration: 0.15 }, '-=0.15')
      .to('.loader-orb', { scale: 2, opacity: 0, duration: 0.4 }, '-=0.3')
      .to(loader, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
      .set(loader, { display: 'none' });
  }

  // ─── CUSTOM CURSOR (Desktop only) ───
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursor && cursorDot && !isMobile) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursorDot, { left: e.clientX, top: e.clientY, duration: 0.1 });
      gsap.to(cursor, { left: e.clientX, top: e.clientY, duration: 0.35, ease: 'power2.out' });
    });
    document.querySelectorAll('a, button, .btn, .card, .project-card, .cert-card, .contact-card, .skill-tag, .social-link, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ─── ENHANCED PARTICLES (Desktop only — saves mobile battery) ───
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !isMobile) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = -9999, mouseY = -9999;
    const PARTICLE_COUNT = 60;
    const MOUSE_RADIUS = 120;
    const CONNECT_DIST = 100;

    // Multi-color palette matching the portfolio theme
    const particleColors = [
      { r: 59, g: 130, b: 246 },   // neo-blue
      { r: 255, g: 112, b: 166 },  // neo-pink
      { r: 168, g: 85, b: 247 },   // neo-purple
      { r: 51, g: 255, b: 87 },    // neo-green
      { r: 251, g: 255, b: 72 },   // neo-yellow
    ];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

    // Track mouse for interaction (shared with cursor handler below)
    let sharedMouseX = -9999, sharedMouseY = -9999;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; sharedMouseX = e.clientX; sharedMouseY = e.clientY; });
    document.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; sharedMouseX = -9999; sharedMouseY = -9999; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2.5 + 0.8;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.baseOpacity = Math.random() * 0.5 + 0.15;
        this.opacity = this.baseOpacity;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.angle = 0;
      }
      update(time) {
        // Breathing pulse
        this.size = this.baseSize + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.6;

        // Mouse repulsion
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 3;
          this.y += Math.sin(angle) * force * 3;
          // Glow near mouse
          this.opacity = Math.min(1, this.baseOpacity + force * 0.6);
          this.size = this.baseSize + force * 2;
        } else {
          this.opacity += (this.baseOpacity - this.opacity) * 0.05;
          this.size += (this.baseSize + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.6 - this.size) * 0.1;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }
      draw() {
        // Simple colored dot (no expensive radial gradient per frame)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    let frameTime = 0;
    (function animate() {
      frameTime++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(frameTime); p.draw(); });

      // Simple connection lines (no gradient per line — major perf win)
      // Draw connections only on even frames to halve the work
      if (frameTime % 2 === 0) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < CONNECT_DIST * CONNECT_DIST) {
              const alpha = 0.06 * (1 - Math.sqrt(distSq) / CONNECT_DIST);
              const ci = particles[i].color;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${ci.r},${ci.g},${ci.b},${alpha})`;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(animate);
    })();
  }

  // ─── HERO CINEMATIC ENTRANCE ───
  const heroDelay = isMobile ? 1.0 : 1.6;
  const heroTl = gsap.timeline({ delay: heroDelay });

  // Orbs fade in softly
  heroTl
    .from('.hero-orb', { opacity: 0, scale: 0.3, duration: 1.2, stagger: 0.15, ease: 'power2.out' })
    .from('.hero-grid-pattern', { opacity: 0, duration: 0.8 }, '-=0.8')
    .from('.hero-badge', { y: 25, opacity: 0, scale: 0.9, duration: 0.6, ease: 'back.out(2)' }, '-=0.6')
    .from('.hero-title > div:first-child', { y: 50, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.25')
    .from('.gradient-text', { y: 60, opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.out' }, '-=0.25')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('.hero-social-strip a', { y: 20, opacity: 0, scale: 0.7, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }, '-=0.3')
    .from('.hero-social-divider', { width: 0, opacity: 0, duration: 0.4 }, '-=0.1')
    .from('.hero-buttons .btn', { y: 25, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.3')
    .from('.hero-terminal', { y: 40, opacity: 0, scale: 0.95, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .from('.terminal-line', { x: -15, opacity: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, '-=0.3')
    .from('.stat-card', { y: 35, opacity: 0, scale: 0.85, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, '-=0.2')
    .from('.availability-badge', { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
    .from('.scroll-indicator', { y: 15, opacity: 0, duration: 0.35 }, '-=0.1');

  // ─── MARQUEE ANIMATION (GSAP-powered for smoothness) ───
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // Clone items for infinite loop
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  // ─── SCROLL-TRIGGERED REVEALS ───
  const revealConfig = (trigger, props) => ({
    scrollTrigger: { trigger, start: isMobile ? 'top 92%' : 'top 85%', toggleActions: 'play none none none' },
    ...props
  });

  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, revealConfig(el, { y: 40, opacity: 0, scale: 0.92, duration: 0.7, ease: 'back.out(1.5)' }));
  });

  gsap.utils.toArray('.section-subtitle').forEach(el => {
    gsap.from(el, revealConfig(el, { y: 25, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.15 }));
  });

  // About cards
  gsap.utils.toArray('.about-grid .card').forEach((card, i) => {
    gsap.from(card, revealConfig(card, {
      x: isMobile ? 0 : (i % 2 === 0 ? -50 : 50),
      y: isMobile ? 40 : 0,
      opacity: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.12
    }));
  });

  // Education
  gsap.utils.toArray('.education-item').forEach((item, i) => {
    gsap.from(item, revealConfig(item, {
      x: isMobile ? 0 : -60,
      y: isMobile ? 40 : 0,
      opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.15
    }));
  });

  // Skills
  gsap.utils.toArray('.skills-grid .card').forEach((card, i) => {
    gsap.from(card, revealConfig(card, {
      y: 50, opacity: 0, scale: 0.92, duration: 0.6, ease: 'back.out(1.5)', delay: i * 0.08
    }));
  });

  // Progress bars
  document.querySelectorAll('.progress-fill').forEach(bar => {
    const w = bar.getAttribute('data-width');
    bar.style.width = '0';
    ScrollTrigger.create({
      trigger: bar,
      start: isMobile ? 'top 95%' : 'top 90%',
      onEnter: () => gsap.to(bar, { width: w + '%', duration: 1.2, ease: 'power3.out' })
    });
  });

  // Skill tags
  gsap.utils.toArray('.skill-tags .skill-tag').forEach((tag, i) => {
    gsap.from(tag, revealConfig(tag, {
      y: 20, opacity: 0, scale: 0.85, duration: 0.4, ease: 'back.out(2)', delay: i * 0.05
    }));
  });

  // Projects
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, revealConfig(card, {
      y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.12
    }));
  });

  // Certifications
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.from(card, revealConfig(card, {
      y: 50, opacity: 0, scale: 0.92, duration: 0.6, ease: 'back.out(1.5)', delay: i * 0.1
    }));
  });

  // Testimonials
  gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
    gsap.from(card, revealConfig(card, {
      y: 40, opacity: 0, scale: 0.94, duration: 0.7, ease: 'power3.out', delay: i * 0.12
    }));
  });

  // Contact
  gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.from(card, revealConfig(card, {
      y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.08
    }));
  });

  // Form
  const formCard = document.querySelector('.form-card');
  if (formCard) {
    gsap.from(formCard, revealConfig(formCard, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }));
  }

  // Footer
  gsap.from('.footer-grid > div', {
    scrollTrigger: { trigger: '.footer-grid', start: 'top 92%', toggleActions: 'play none none none' },
    y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out'
  });

  // Counter banner
  document.querySelectorAll('.counter-value').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (match) {
      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      el.textContent = '0' + suffix;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.to({ v: 0 }, {
            v: target, duration: 2.2, ease: 'power2.out',
            onUpdate: function () { el.textContent = Math.floor(this.targets()[0].v) + suffix; }
          });
        }
      });
    }
  });

  // ─── 3D TILT ON CARDS (Desktop only) ───
  if (!isMobile) {
    document.querySelectorAll('.card, .project-card, .cert-card, .testimonial-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ─── MAGNETIC BUTTONS (Desktop only) ───
  if (!isMobile) {
    document.querySelectorAll('.btn, .social-link').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  // ─── HERO STAT COUNTERS ───
  document.querySelectorAll('.stat-number').forEach(stat => {
    const text = stat.textContent.trim();
    const match = text.match(/^(\d+)/);
    if (match) {
      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      stat.textContent = '0' + suffix;
      ScrollTrigger.create({
        trigger: stat, start: 'top 88%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate: function () { stat.textContent = Math.floor(this.targets()[0].val) + suffix; }
          });
        }
      });
    }
  });

  // ─── MERGED SCROLL HANDLER (perf: single listener instead of 3) ───
  let lastScrollY = 0;
  const nav = document.querySelector('nav');
  const mobileMenuEl = document.getElementById('mobile-menu');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgressEl = document.getElementById('scroll-progress');

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      // Nav hide/show
      if (!(mobileMenuEl && mobileMenuEl.classList.contains('active'))) {
        if (y > 300 && y > lastScrollY) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
      }
      lastScrollY = y;

      // Scroll-to-top button visibility
      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', y > 500);
      }

      // Active nav link
      let current = '';
      sections.forEach(s => { if (y >= s.offsetTop - 150) current = s.id; });
      navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href').slice(1) === current) l.classList.add('active');
      });

      // Scroll progress bar
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0 && scrollProgressEl) {
        scrollProgressEl.style.width = (y / height) * 100 + '%';
      }

      scrollTicking = false;
    });
  });

  // Scroll-to-top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: 'power3.inOut' });
    });
  }

  // ─── DARK MODE TOGGLE ───
  const darkToggle = document.querySelector('.dark-mode-toggle');
  if (darkToggle) {
    // Check saved preference
    if (localStorage.getItem('darkMode') === 'on') {
      document.documentElement.classList.add('dark-mode');
      darkToggle.innerHTML = '<i class="ri-sun-line"></i>';
    }
    darkToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      darkToggle.innerHTML = isDark ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
      localStorage.setItem('darkMode', isDark ? 'on' : 'off');
      gsap.from(darkToggle, { rotation: 360, duration: 0.5, ease: 'back.out(2)' });
    });
  }

  // ─── FLOATING SHAPES PARALLAX ───
  gsap.utils.toArray('.floating-shape').forEach((shape, i) => {
    gsap.to(shape, {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      y: (i + 1) * 40, rotation: (i + 1) * 25, ease: 'none'
    });
  });

  // ─── TYPING TEXT EFFECT ───
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = ['dynamic web applications', 'responsive interfaces', 'clean & scalable code', 'innovative solutions'];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;

    function typeEffect() {
      const current = phrases[phraseIdx];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeEffect, 350); return; }
      } else {
        typingEl.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) { isDeleting = true; setTimeout(typeEffect, 1800); return; }
      }
      setTimeout(typeEffect, isDeleting ? 35 : 70);
    }
    setTimeout(typeEffect, heroDelay * 1000 + 1500);
  }

  // ─── SMOOTH SCROLLING ───
  // Helper to close mobile menu
  function closeMobileMenu() {
    const mm = document.getElementById('mobile-menu');
    if (mm && mm.classList.contains('active')) {
      mm.classList.remove('active');
      const icon = document.getElementById('mobile-menu-btn').querySelector('i');
      if (icon) icon.classList.replace('ri-close-line', 'ri-menu-line');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        closeMobileMenu();
        gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
      }
    });
  });

  // ─── MOBILE MENU ───
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) icon.classList.replace('ri-menu-line', 'ri-close-line');
    document.body.style.overflow = 'hidden';
  }

  mobileMenuBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close button inside the mobile menu
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close menu when tapping on the overlay area (outside links)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // ─── SKILLS FILTER ───
  const skillBtns = document.querySelectorAll('.skill-nav-btn');
  const skillCards = document.querySelectorAll('.skills-grid .card');
  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      skillCards.forEach(card => {
        const cc = card.getAttribute('data-category');
        if (category === 'all' || cc === category) {
          card.classList.remove('hidden');
          gsap.from(card, { scale: 0.92, opacity: 0, duration: 0.4, ease: 'back.out(1.5)' });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─── SCROLL DOWN ───
  const scrollDown = document.getElementById('scroll-down');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      gsap.to(window, { scrollTo: { y: '#about', offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
    });
  }

  // ─── FORM SUBMISSION WITH ANIMATION ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      // Success animation
      btn.innerHTML = '<i class="ri-check-double-line"></i> SENT SUCCESSFULLY!';
      btn.style.background = 'var(--neo-green)';
      btn.style.color = 'var(--neo-black)';
      gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });

      // Confetti-like effect on form inputs
      gsap.to('.form-control', { y: -5, opacity: 0, stagger: 0.05, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          setTimeout(() => {
            gsap.to('.form-control', { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' });
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.color = '';
            this.reset();
          }, 2500);
        }
      });
    });
  }

  // ─── TOUCH FEEDBACK FOR MOBILE ───
  if (isMobile) {
    document.querySelectorAll('.card, .project-card, .cert-card, .testimonial-card, .contact-card, .btn').forEach(el => {
      el.addEventListener('touchstart', () => {
        gsap.to(el, { scale: 0.97, duration: 0.15, ease: 'power2.out' });
      }, { passive: true });
      el.addEventListener('touchend', () => {
        gsap.to(el, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
      }, { passive: true });
    });
  }

  // ═══════════════════════════════════════════
  //  ANTIGRAVITY EASTER EGG (Matter.js Physics)
  // ═══════════════════════════════════════════

  const antigravityState = {
    active: false,
    zeroGravity: false,
    engine: null,
    runner: null,
    bodies: [],
    elementMap: new Map(), // body.id -> { el, origRect, origStyles }
    walls: [],
    mouseConstraint: null,
    rafId: null
  };

  const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

  const triggerBtn = document.getElementById('antigravity-trigger');
  const overlay = document.getElementById('antigravity-overlay');
  const controls = document.getElementById('antigravity-controls');
  const zeroGBtn = document.getElementById('zero-gravity-btn');
  const resetBtn = document.getElementById('antigravity-reset-btn');

  // Elements that become physics bodies
  const PHYSICS_SELECTORS = [
    '.card', '.project-card', '.stat-card', '.cert-card',
    '.testimonial-card', '.hero-badge', '.hero-terminal',
    '.skill-tag', '.contact-card', '.education-card'
  ].join(', ');

  function createWalls() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = 50; // wall thickness
    const wallOpts = { isStatic: true, restitution: 0.5, friction: 0.3 };
    return [
      Bodies.rectangle(w / 2, h + t / 2, w + 200, t, wallOpts),   // floor
      Bodies.rectangle(w / 2, -t / 2, w + 200, t, wallOpts),       // ceiling
      Bodies.rectangle(-t / 2, h / 2, t, h + 200, wallOpts),       // left
      Bodies.rectangle(w + t / 2, h / 2, t, h + 200, wallOpts)     // right
    ];
  }

  function activateAntigravity() {
    if (antigravityState.active) return;
    antigravityState.active = true;

    // Scroll to top first for best effect
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Create engine
    const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } });
    antigravityState.engine = engine;

    // Create runner
    const runner = Runner.create();
    antigravityState.runner = runner;
    Runner.run(runner, engine);

    // Create walls
    const walls = createWalls();
    antigravityState.walls = walls;
    Composite.add(engine.world, walls);

    // Convert elements to physics bodies
    const elements = document.querySelectorAll(PHYSICS_SELECTORS);
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // Skip elements that are too small or off-screen
      if (rect.width < 20 || rect.height < 20 || rect.top > window.innerHeight + 200) return;

      // Store original styles
      const origStyles = {
        position: el.style.position,
        left: el.style.left,
        top: el.style.top,
        width: el.style.width,
        height: el.style.height,
        transform: el.style.transform,
        transition: el.style.transition,
        zIndex: el.style.zIndex
      };

      // Create physics body
      const body = Bodies.rectangle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        rect.width,
        rect.height,
        {
          restitution: 0.5,
          friction: 0.1,
          frictionAir: 0.008,
          density: 0.001,
          angle: 0
        }
      );

      Composite.add(engine.world, body);
      antigravityState.bodies.push(body);
      antigravityState.elementMap.set(body.id, { el, origRect: rect, origStyles });

      // Fix element size and make it physics-controlled
      el.classList.add('physics-body');
      el.style.width = rect.width + 'px';
      el.style.height = rect.height + 'px';
      el.style.left = '0px';
      el.style.top = '0px';
    });

    // Mouse constraint for drag & toss
    const canvasElement = document.body;
    const mouse = Mouse.create(canvasElement);
    // Fix mouse offset
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.1,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);
    antigravityState.mouseConstraint = mouseConstraint;

    // UI updates
    document.body.classList.add('antigravity-active');
    overlay.classList.add('active');
    controls.classList.add('active');
    triggerBtn.classList.add('active');
    triggerBtn.querySelector('i').classList.replace('ri-rocket-line', 'ri-rocket-fill');

    // Start render loop
    startRenderLoop();
  }

  function startRenderLoop() {
    function render() {
      antigravityState.bodies.forEach(body => {
        const data = antigravityState.elementMap.get(body.id);
        if (!data) return;
        const { el } = data;
        const { x, y } = body.position;
        const w = parseFloat(el.style.width);
        const h = parseFloat(el.style.height);
        el.style.left = (x - w / 2) + 'px';
        el.style.top = (y - h / 2) + 'px';
        el.style.transform = `rotate(${body.angle}rad)`;
      });
      antigravityState.rafId = requestAnimationFrame(render);
    }
    render();
  }

  function toggleZeroGravity() {
    antigravityState.zeroGravity = !antigravityState.zeroGravity;
    const engine = antigravityState.engine;

    if (antigravityState.zeroGravity) {
      // Zero gravity
      engine.gravity.y = 0;
      engine.gravity.x = 0;
      zeroGBtn.classList.add('active-zero-g');
      zeroGBtn.innerHTML = '<i class="ri-planet-fill"></i> GRAVITY';

      // Give random impulses to all bodies
      antigravityState.bodies.forEach(body => {
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      });
    } else {
      // Restore gravity
      engine.gravity.y = 1;
      engine.gravity.x = 0;
      zeroGBtn.classList.remove('active-zero-g');
      zeroGBtn.innerHTML = '<i class="ri-planet-line"></i> ZERO-G';
    }
  }

  function deactivateAntigravity() {
    if (!antigravityState.active) return;

    // Stop render loop
    if (antigravityState.rafId) {
      cancelAnimationFrame(antigravityState.rafId);
      antigravityState.rafId = null;
    }

    // Restore elements
    antigravityState.elementMap.forEach(({ el, origStyles }) => {
      el.classList.remove('physics-body');
      el.style.position = origStyles.position;
      el.style.left = origStyles.left;
      el.style.top = origStyles.top;
      el.style.width = origStyles.width;
      el.style.height = origStyles.height;
      el.style.transform = origStyles.transform;
      el.style.transition = origStyles.transition;
      el.style.zIndex = origStyles.zIndex;
    });

    // Clean up physics
    if (antigravityState.runner) Runner.stop(antigravityState.runner);
    if (antigravityState.engine) {
      Composite.clear(antigravityState.engine.world, false);
      Engine.clear(antigravityState.engine);
    }

    // Reset state
    antigravityState.bodies = [];
    antigravityState.elementMap.clear();
    antigravityState.walls = [];
    antigravityState.engine = null;
    antigravityState.runner = null;
    antigravityState.mouseConstraint = null;
    antigravityState.active = false;
    antigravityState.zeroGravity = false;

    // UI updates
    document.body.classList.remove('antigravity-active');
    overlay.classList.remove('active');
    controls.classList.remove('active');
    triggerBtn.classList.remove('active');
    triggerBtn.querySelector('i').classList.replace('ri-rocket-fill', 'ri-rocket-line');
    zeroGBtn.classList.remove('active-zero-g');
    zeroGBtn.innerHTML = '<i class="ri-planet-line"></i> ZERO-G';
  }

  // Event listeners
  triggerBtn.addEventListener('click', () => {
    if (antigravityState.active) {
      deactivateAntigravity();
    } else {
      activateAntigravity();
    }
  });

  resetBtn.addEventListener('click', deactivateAntigravity);
  zeroGBtn.addEventListener('click', toggleZeroGravity);

  // Keyboard shortcut: Press G
  document.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (antigravityState.active) {
        deactivateAntigravity();
      } else {
        activateAntigravity();
      }
    }
  });

  // Update walls on resize
  window.addEventListener('resize', () => {
    if (!antigravityState.active || !antigravityState.engine) return;
    // Remove old walls
    Composite.remove(antigravityState.engine.world, antigravityState.walls);
    // Add new walls
    const newWalls = createWalls();
    antigravityState.walls = newWalls;
    Composite.add(antigravityState.engine.world, newWalls);
  });

  // ═══════════════════════════════════════════
  //  FLOATING CODE SYMBOLS (Desktop only)
  // ═══════════════════════════════════════════
  const codeCanvas = document.getElementById('code-symbols-canvas');
  if (codeCanvas && !isMobile) {
    const cCtx = codeCanvas.getContext('2d');
    const codeSymbols = ['{ }', '< />', '( )', '//', '=>', '&&', '||', '[ ]', '::',  '++', '!=', '**'];
    let codeParticles = [];
    const CODE_COUNT = 10;

    const cResize = () => { codeCanvas.width = window.innerWidth; codeCanvas.height = window.innerHeight; };
    cResize();
    let cResizeTimer;
    window.addEventListener('resize', () => { clearTimeout(cResizeTimer); cResizeTimer = setTimeout(cResize, 150); });

    class CodeSymbol {
      constructor() { this.reset(true); }
      reset(initial) {
        this.symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        this.x = Math.random() * codeCanvas.width;
        this.y = initial ? Math.random() * codeCanvas.height : codeCanvas.height + 50;
        this.fontSize = 12 + Math.random() * 16;
        this.opacity = 0.04 + Math.random() * 0.08;
        this.speedY = -(0.15 + Math.random() * 0.35);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.rotation = (Math.random() - 0.5) * 0.3;
        this.rotAngle = Math.random() * Math.PI * 2;
        this.color = [
          'rgba(59,130,246,',   // blue
          'rgba(168,85,247,',   // purple
          'rgba(255,112,166,',  // pink
          'rgba(51,255,87,',    // green
          'rgba(251,255,72,',   // yellow
        ][Math.floor(Math.random() * 5)];
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotAngle += this.rotation * 0.01;
        if (this.y < -60) this.reset(false);
      }
      draw() {
        cCtx.save();
        cCtx.translate(this.x, this.y);
        cCtx.rotate(this.rotAngle);
        cCtx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;
        cCtx.fillStyle = this.color + this.opacity + ')';
        cCtx.textAlign = 'center';
        cCtx.fillText(this.symbol, 0, 0);
        cCtx.restore();
      }
    }

    for (let i = 0; i < CODE_COUNT; i++) codeParticles.push(new CodeSymbol());

    (function animateCode() {
      cCtx.clearRect(0, 0, codeCanvas.width, codeCanvas.height);
      codeParticles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateCode);
    })();
  }

  // ═══════════════════════════════════════════
  //  MOUSE CLICK RIPPLE EFFECT (Desktop only)
  // ═══════════════════════════════════════════
  if (!isMobile) {
    const rippleContainer = document.getElementById('mouse-ripple-container');
    if (rippleContainer) {
      document.addEventListener('click', (e) => {
        // Don't show ripple on interactive elements to avoid obstructing UI
        if (e.target.closest('a, button, input, textarea, select')) return;

        for (let i = 0; i < 3; i++) {
          const ring = document.createElement('div');
          ring.className = 'ripple-ring';
          const size = 120 + i * 80;
          ring.style.width = size + 'px';
          ring.style.height = size + 'px';
          ring.style.left = e.clientX + 'px';
          ring.style.top = e.clientY + 'px';
          ring.style.animationDelay = (i * 0.12) + 's';
          ring.style.animationDuration = (0.6 + i * 0.2) + 's';
          rippleContainer.appendChild(ring);

          // Clean up after animation
          ring.addEventListener('animationend', () => ring.remove());
        }
      });
    }
  }

  // ═══════════════════════════════════════════
  //  SECTION PARTICLE BURST ON SCROLL
  // ═══════════════════════════════════════════
  if (!isMobile) {
    const burstColors = ['#3b82f6', '#ff70a6', '#a855f7', '#33ff57', '#fbff48'];

    document.querySelectorAll('.section-header').forEach(header => {
      let hasBurst = false;
      ScrollTrigger.create({
        trigger: header,
        start: 'top 85%',
        onEnter: () => {
          if (hasBurst) return;
          hasBurst = true;
          const rect = header.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
              position: fixed;
              width: ${4 + Math.random() * 6}px;
              height: ${4 + Math.random() * 6}px;
              background: ${burstColors[Math.floor(Math.random() * burstColors.length)]};
              border-radius: 50%;
              left: ${cx}px;
              top: ${cy}px;
              pointer-events: none;
              z-index: 9998;
            `;
            document.body.appendChild(dot);

            const angle = (Math.PI * 2 / 20) * i + (Math.random() - 0.5) * 0.5;
            const dist = 60 + Math.random() * 100;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;

            gsap.to(dot, {
              x: tx,
              y: ty,
              opacity: 0,
              scale: 0,
              duration: 0.6 + Math.random() * 0.4,
              ease: 'power2.out',
              onComplete: () => dot.remove()
            });
          }
        }
      });
    });
  }

});
