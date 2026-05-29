// ── Preloader ────────────────────────────────────────────
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => preloader.classList.add('hidden'), 400);
});
// Fallback: hide after 2.5s even if load event is slow
setTimeout(() => preloader.classList.add('hidden'), 2500);

// ── Navbar scroll effect ─────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

const onScroll = () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 400);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Hamburger menu ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const overlay   = document.createElement('div');
overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:998;display:none;backdrop-filter:blur(3px)';
document.body.appendChild(overlay);

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  overlay.style.display = 'none';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  overlay.style.display = isOpen ? 'block' : 'none';
});

overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

// ── Active nav link on scroll ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Hero particles ───────────────────────────────────────
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 28;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const span = document.createElement('span');
  const size = Math.random() * 3 + 1.5;
  const left = Math.random() * 100;
  const delay = Math.random() * 14;
  const duration = 10 + Math.random() * 18;
  const opacity = 0.15 + Math.random() * 0.4;

  span.style.cssText = `
    left:${left}%;
    bottom:${Math.random() * 30}%;
    width:${size}px;
    height:${size}px;
    opacity:${opacity};
    animation-duration:${duration}s;
    animation-delay:${delay}s;
  `;
  particleContainer.appendChild(span);
}

// ── Animated stat counters ───────────────────────────────
const statNums = document.querySelectorAll('.stat-num[data-target]');

const countUp = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// ── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.service-card, .port-card, .value-pill, .contact-card, .stat-item, .commit-body, .tariff-notes, .about-card-main, .about-card-accent, .gallery-item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── Gallery lightbox ─────────────────────────────────────
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">✕</button>
  <img src="" alt="" />
  <div class="lightbox-caption"></div>
`;
document.body.appendChild(lightbox);

const lbImg     = lightbox.querySelector('img');
const lbCaption = lightbox.querySelector('.lightbox-caption');
const lbClose   = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gc-tag');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = cap ? cap.textContent : '';
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

// ── Contact form → Formsubmit.co ─────────────────────────
document.getElementById('contactForm').addEventListener('submit', function() {
  const btn = document.getElementById('formBtn');
  btn.innerHTML = 'Sending…';
  btn.disabled  = true;
});
