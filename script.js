const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-scroll-top]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});


const contactModal = document.querySelector('#contact-modal');
const contactOpenButtons = document.querySelectorAll('[data-contact-modal-open]');
const contactCloseButtons = document.querySelectorAll('[data-contact-modal-close]');
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.contact-form-status');
let lastFocusedElement = null;

function openContactModal() {
  if (!contactModal) return;
  lastFocusedElement = document.activeElement;
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const firstInput = contactModal.querySelector('input:not([type="hidden"])');
  if (firstInput) window.setTimeout(() => firstInput.focus(), 50);
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

contactOpenButtons.forEach((button) => button.addEventListener('click', openContactModal));
contactCloseButtons.forEach((button) => button.addEventListener('click', closeContactModal));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal?.classList.contains('open')) closeContactModal();
});

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    contactStatus.textContent = '';
    contactStatus.className = 'contact-form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Submission failed');
      contactForm.reset();
      contactStatus.textContent = 'Thanks! We’ll be in touch soon.';
      contactStatus.classList.add('success');
      submitButton.textContent = 'Sent';
    } catch (error) {
      contactStatus.textContent = 'Something went wrong. Please try again.';
      contactStatus.classList.add('error');
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
