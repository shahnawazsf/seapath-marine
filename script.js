// ── Preloader ─────────────────────────────────────
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => setTimeout(() => preloader.classList.add('hidden'), 300));
setTimeout(() => preloader.classList.add('hidden'), 2500);

// ── Navbar + Back-to-top ──────────────────────────
const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const overlay   = document.createElement('div');
overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:998;display:none;backdrop-filter:blur(3px)';
document.body.appendChild(overlay);

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Mobile menu ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  overlay.style.display = isOpen ? 'block' : 'none';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

// ── Active nav on scroll ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a[href^="#"]');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe;

sections.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

// ── Hero particles ────────────────────────────────
(function() {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1';
  document.querySelector('.hero').appendChild(wrap);

  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,${0.15 + Math.random() * 0.25});
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;
      bottom:${Math.random() * 30}%;
      animation:particle-rise ${10 + Math.random() * 18}s linear ${Math.random() * 14}s infinite;
    `;
    wrap.appendChild(s);
  }

  const style = document.createElement('style');
  style.textContent = `@keyframes particle-rise{0%{transform:translateY(0);opacity:0}10%{opacity:1}90%{opacity:.4}100%{transform:translateY(-100vh);opacity:0}}`;
  document.head.appendChild(style);
})();

// ── Animated counters ─────────────────────────────
const counters = document.querySelectorAll('.hs-num[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const start = performance.now();
    const dur = 1800;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ── Services accordion ────────────────────────────
document.querySelectorAll('.acc-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Gallery lightbox ──────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCap    = document.getElementById('lbCap');
const lbClose  = document.getElementById('lbClose');

document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', () => {
    lbImg.src = item.querySelector('img').src;
    lbCap.textContent = item.querySelector('.g-cap span')?.textContent || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 350);
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Scroll reveal ─────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.acc-item,.port-card,.av-item,.g-item,.office-block,.form-card,.tn-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  revealObs.observe(el);
});

// ── Contact form ──────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function() {
  const btn = document.getElementById('formBtn');
  btn.querySelector('span').textContent = 'Sending…';
  btn.disabled = true;
});
