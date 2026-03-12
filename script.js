/* ═══════════════════════════════════════════════
   K MIDUNRAJA — PORTFOLIO SCRIPTS
   script.js
═══════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════
// Custom Cursor
// ══════════════════════════════
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = -100, my = -100;
  let fx = -100, fy = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();


// ══════════════════════════════
// Canvas Grid Background
// ══════════════════════════════
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    const CELL = 70;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Radial vignette
    const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.hypot(W, H) * 0.6);
    grd.addColorStop(0, 'rgba(7,9,15,0)');
    grd.addColorStop(1, 'rgba(7,9,15,0.9)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  window.addEventListener('resize', resize);
  resize();
})();


// ══════════════════════════════
// Typing Animation
// ══════════════════════════════
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Backend Developer',
    'Java Programmer',
    'Problem Solver',
    'CS Student',
    'Data Structures Enthusiast',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const word = phrases[pIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 38);
    }
  }

  setTimeout(tick, 1200);
})();


// ══════════════════════════════
// Navbar scroll behaviour
// ══════════════════════════════
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ══════════════════════════════
// Mobile hamburger menu
// ══════════════════════════════
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
    });
  });
})();


// ══════════════════════════════
// Scroll Reveal
// ══════════════════════════════
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.children]
          .filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();


// ══════════════════════════════
// Animated Stats Counter
// ══════════════════════════════
(function initCounters() {
  const stats = document.querySelectorAll('.stat-n[data-target]');
  if (!stats.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
})();


// ══════════════════════════════
// Project card mouse-glow effect
// ══════════════════════════════
(function initProjectGlow() {
  document.querySelectorAll('.project-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();


// ══════════════════════════════
// Active nav link on scroll
// ══════════════════════════════
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();


// ══════════════════════════════
// Contact form — Formspree
// ══════════════════════════════
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('submitBtn');
  if (!form || !btn) return;

  const FORMSPREE_URL = 'https://formspree.io/f/xaqpjykl';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Loading state
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res  = await fetch(FORMSPREE_URL, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        // Success state
        btn.textContent          = 'Message Sent ✓';
        btn.style.background     = 'var(--accent3)';
        btn.style.boxShadow      = '0 0 30px rgba(16,185,129,0.35)';
        btn.style.opacity        = '1';
        form.reset();

        setTimeout(() => {
          btn.textContent      = 'Send Message';
          btn.style.background = '';
          btn.style.boxShadow  = '';
          btn.disabled         = false;
        }, 4000);

      } else {
        // Server error
        const body = await res.json().catch(() => ({}));
        const msg  = body?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
        btn.textContent      = '✕ ' + msg;
        btn.style.background = 'var(--accent-r)';
        btn.style.boxShadow  = '0 0 24px rgba(255,77,109,0.3)';
        btn.style.opacity    = '1';

        setTimeout(() => {
          btn.textContent      = 'Send Message';
          btn.style.background = '';
          btn.style.boxShadow  = '';
          btn.disabled         = false;
        }, 4000);
      }

    } catch (err) {
      // Network error
      btn.textContent      = '✕ Network error — try email';
      btn.style.background = 'var(--accent-r)';
      btn.style.opacity    = '1';

      setTimeout(() => {
        btn.textContent      = 'Send Message';
        btn.style.background = '';
        btn.disabled         = false;
      }, 4000);
    }
  });
})();


// ══════════════════════════════
// Smooth scroll for anchor links
// ══════════════════════════════
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


// ══════════════════════════════
// Page load progress bar
// ══════════════════════════════
(function initLoadBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #00e5ff, #6d28d9);
    z-index: 99999; transition: width 0.4s ease, opacity 0.5s ease;
    pointer-events: none;
  `;
  document.body.prepend(bar);

  let w = 0;
  const interval = setInterval(() => {
    w += Math.random() * 20;
    if (w > 90) { clearInterval(interval); return; }
    bar.style.width = w + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => { bar.style.opacity = '0'; }, 400);
  });
})();    // Grid lines
    const CELL = 70;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Radial vignette
    const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.hypot(W, H) * 0.6);
    grd.addColorStop(0, 'rgba(7,9,15,0)');
    grd.addColorStop(1, 'rgba(7,9,15,0.9)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  window.addEventListener('resize', resize);
  resize();
})();


// ══════════════════════════════
// Typing Animation
// ══════════════════════════════
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Backend Developer',
    'Java Programmer',
    'Problem Solver',
    'CS Student',
    'Data Structures Enthusiast',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const word = phrases[pIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 38);
    }
  }

  setTimeout(tick, 1200);
})();


// ══════════════════════════════
// Navbar scroll behaviour
// ══════════════════════════════
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ══════════════════════════════
// Mobile hamburger menu
// ══════════════════════════════
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
    });
  });
})();


// ══════════════════════════════
// Scroll Reveal
// ══════════════════════════════
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.children]
          .filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();


// ══════════════════════════════
// Animated Stats Counter
// ══════════════════════════════
(function initCounters() {
  const stats = document.querySelectorAll('.stat-n[data-target]');
  if (!stats.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = isDecimal ? value.toFixed(2) : Math.round(value);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
})();


// ══════════════════════════════
// Project card mouse-glow effect
// ══════════════════════════════
(function initProjectGlow() {
  document.querySelectorAll('.project-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();


// ══════════════════════════════
// Active nav link on scroll
// ══════════════════════════════
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();


// ══════════════════════════════
// Contact form — Formspree
// ══════════════════════════════
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('submitBtn');
  if (!form || !btn) return;

  const FORMSPREE_URL = 'https://formspree.io/f/xaqpjykl';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Loading state
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res  = await fetch(FORMSPREE_URL, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        // Success state
        btn.textContent          = 'Message Sent ✓';
        btn.style.background     = 'var(--accent3)';
        btn.style.boxShadow      = '0 0 30px rgba(16,185,129,0.35)';
        btn.style.opacity        = '1';
        form.reset();

        setTimeout(() => {
          btn.textContent      = 'Send Message';
          btn.style.background = '';
          btn.style.boxShadow  = '';
          btn.disabled         = false;
        }, 4000);

      } else {
        // Server error
        const body = await res.json().catch(() => ({}));
        const msg  = body?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
        btn.textContent      = '✕ ' + msg;
        btn.style.background = 'var(--accent-r)';
        btn.style.boxShadow  = '0 0 24px rgba(255,77,109,0.3)';
        btn.style.opacity    = '1';

        setTimeout(() => {
          btn.textContent      = 'Send Message';
          btn.style.background = '';
          btn.style.boxShadow  = '';
          btn.disabled         = false;
        }, 4000);
      }

    } catch (err) {
      // Network error
      btn.textContent      = '✕ Network error — try email';
      btn.style.background = 'var(--accent-r)';
      btn.style.opacity    = '1';

      setTimeout(() => {
        btn.textContent      = 'Send Message';
        btn.style.background = '';
        btn.disabled         = false;
      }, 4000);
    }
  });
})();


// ══════════════════════════════
// Smooth scroll for anchor links
// ══════════════════════════════
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


// ══════════════════════════════
// Page load progress bar
// ══════════════════════════════
(function initLoadBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #00e5ff, #6d28d9);
    z-index: 99999; transition: width 0.4s ease, opacity 0.5s ease;
    pointer-events: none;
  `;
  document.body.prepend(bar);

  let w = 0;
  const interval = setInterval(() => {
    w += Math.random() * 20;
    if (w > 90) { clearInterval(interval); return; }
    bar.style.width = w + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => { bar.style.opacity = '0'; }, 400);
  });
})();
