// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveal
const revealEls = document.querySelectorAll(
  '.service-card, .step, .contact-card, .cred-stats, .contact-form-wrap, .cred-text, .cta-inner'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Stagger service cards
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 3) * 80}ms`;
});

// Stagger steps
document.querySelectorAll('.step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 60}ms`;
});

// Contact form
async function handleSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');
  const origText = btn.textContent;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch('/api/fgl/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    document.getElementById('name').value,
        company: document.getElementById('company').value,
        email:   document.getElementById('email').value,
        phone:   document.getElementById('phone').value,
        product: document.getElementById('product').value,
      }),
    });

    if (!res.ok) throw new Error('Server error');

    btn.style.display = 'none';
    success.style.display = 'block';
    form.reset();
  } catch {
    btn.textContent = origText;
    btn.disabled = false;
    success.textContent = 'Something went wrong — please email us directly at dex@firstgoldenlogistics.com';
    success.style.display = 'block';
    success.style.color = '#c0392b';
  }
}
