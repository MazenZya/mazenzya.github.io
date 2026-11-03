// Everything runs after the page has loaded
document.documentElement.classList.add('js');

// ---- Mobile menu ----
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// ---- Scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- Active nav link, nav border and back-to-top ----
const links = document.querySelectorAll('.menu a');
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
const nav = document.getElementById('nav');
const topBtn = document.getElementById('top');
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 10);
  topBtn.classList.toggle('show', y > 500);
  let current = -1;
  sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= 120) current = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Contact form validation ----
const form = document.getElementById('form');
const status = document.getElementById('status');
const rules = {
  name:    v => v.trim().length >= 2 ? '' : 'Enter your name.',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
  subject: v => v.trim().length >= 3 ? '' : 'Enter a subject.',
  message: v => v.trim().length >= 10 ? '' : 'Write at least 10 characters.'
};
function check(field) {
  const msg = rules[field.name](field.value);
  document.getElementById('e-' + field.name).textContent = msg;
  field.classList.toggle('invalid', !!msg);
  field.setAttribute('aria-invalid', !!msg);
  return !msg;
}
form.querySelectorAll('input,textarea').forEach(f => f.addEventListener('blur', () => check(f)));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = '';
  const ok = [...form.querySelectorAll('input,textarea')].map(check).every(Boolean);
  if (!ok) return;
  /* Real delivery needs a backend or form service. Example with Formspree:
     fetch('https://formspree.io/f/YOUR_ID', {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}})
       .then(r => r.ok ? showOk() : alert('Send failed'));
     Until then, this demo only confirms that validation passed. */
  status.textContent = 'Validation passed. Connect a form service to send real emails.';
  form.reset();
});

// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();
