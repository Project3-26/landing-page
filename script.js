const isPhilippinesLanding = window.location.pathname.startsWith('/ph');

if (isPhilippinesLanding) {
  const phLayout = document.createElement('link');
  phLayout.rel = 'stylesheet';
  phLayout.href = '/ph/desktop.css?v=20260828-1';
  document.head.appendChild(phLayout);
}

const freeJohnOfferUrl = isPhilippinesLanding
  ? 'https://app.project326.io/start/john?utm_source=philippines&utm_medium=landing_page&utm_campaign=ph_launch'
  : 'https://app.project326.io/start/john?utm_source=landing_page&utm_medium=website&utm_campaign=v2_launch';
const fullBibleOfferUrl = isPhilippinesLanding
  ? 'https://app.project326.io/api/billing/landing-checkout?market=PH'
  : 'https://app.project326.io/api/billing/landing-checkout?market=US';
const leaderGroupCheckoutUrl = 'https://app.project326.io/api/billing/landing-group-checkout';

document.querySelectorAll('.v2-price-option').forEach((card) => {
  const label = card.querySelector('.v2-pricing-label')?.textContent?.trim().toLowerCase();
  const button = card.querySelector('a.button');
  if (!label || !button) return;
  if (label === 'free john') button.href = freeJohnOfferUrl;
  if (label === 'full bible study') button.href = fullBibleOfferUrl;
  if (label === 'leader + group') {
    button.href = leaderGroupCheckoutUrl;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const groupName = window.prompt('What is the name of your church or group?');
      if (groupName === null) return;
      const normalized = groupName.trim().replace(/\s+/g, ' ');
      if (normalized.length < 2) {
        window.alert('Please enter your church or group name.');
        return;
      }
      window.location.href = `${leaderGroupCheckoutUrl}?groupName=${encodeURIComponent(normalized.slice(0, 160))}`;
    });
  }
});

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
const contactEyebrow = document.querySelector('#contact-modal-eyebrow');
const contactTitle = document.querySelector('#contact-modal-title');
const contactIntro = document.querySelector('#contact-modal-intro');
const interestType = document.querySelector('#interest-type');
const contactOffer = document.querySelector('#contact-offer');
let lastFocusedElement = null;

const contactModalCopy = {
  leader: {
    eyebrow: 'Leader Plan',
    title: 'Lead your people through the Bible—together.',
    intro: 'Tell us a little about your group, and we’ll help you explore the Leader Plan for up to 18 people.'
  },
  churchwide: {
    eyebrow: 'Churchwide access',
    title: 'Let’s talk about your church.',
    intro: 'Tell us a little about your church or ministry, and we’ll help you find the right Project 3|26 plan.'
  }
};

function openContactModal(type = 'churchwide') {
  if (!contactModal) return;
  const selection = contactModalCopy[type] || contactModalCopy.churchwide;
  if (contactEyebrow) contactEyebrow.textContent = selection.eyebrow;
  if (contactTitle) contactTitle.textContent = selection.title;
  if (contactIntro) contactIntro.textContent = selection.intro;
  if (interestType) interestType.value = type;
  if (contactOffer) contactOffer.value = type === 'leader' ? 'leader-plan' : 'churchwide';
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

contactOpenButtons.forEach((button) => button.addEventListener('click', () => {
  openContactModal(button.dataset.contactType || 'churchwide');
}));
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
