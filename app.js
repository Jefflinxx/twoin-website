const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const forceVisible = new URLSearchParams(window.location.search).has('qa');
const isEnglish = document.documentElement.lang.startsWith('en');
const revealItems = document.querySelectorAll('.reveal');
const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');

function updateHeaderState() {
  if (!header || !hero) return;
  const heroBottom = hero.getBoundingClientRect().bottom;
  header.classList.toggle('is-scrolled', heroBottom <= header.offsetHeight);
}

if (header && hero) {
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);
}

if (forceVisible || reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => observer.observe(item));
}

const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', isEnglish ? 'Open menu' : '開啟選單');
  navigation.classList.remove('is-open');
  document.body.classList.remove('nav-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen
      ? (isEnglish ? 'Open menu' : '開啟選單')
      : (isEnglish ? 'Close menu' : '關閉選單'));
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
const successDialog = document.querySelector('[data-success-dialog]');
const dialogCloseButton = document.querySelector('[data-dialog-close]');

if (successDialog && dialogCloseButton) {
  dialogCloseButton.addEventListener('click', () => successDialog.close());
  successDialog.addEventListener('click', (event) => {
    if (event.target === successDialog) successDialog.close();
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(data.entries());
    payload.language = isEnglish ? 'en' : 'zh';

    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    if (formStatus) formStatus.textContent = isEnglish ? 'Sending...' : '正在送出…';

    try {
      const response = await fetch(contactForm.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      contactForm.reset();
      if (formStatus) {
        formStatus.textContent = isEnglish
          ? 'Sent. Thank you — we will get back to you shortly.'
          : '已送出，謝謝你的詢問，我們會盡快回覆。';
      }
      if (successDialog) successDialog.showModal();
    } catch (error) {
      console.error(error);
      if (formStatus) {
        formStatus.textContent = isEnglish
          ? 'Unable to send right now. Please email twoin.service@gmail.com.'
          : '目前無法送出，請直接來信 twoin.service@gmail.com。';
      }
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });
}
