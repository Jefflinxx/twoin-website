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

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const subject = isEnglish
      ? `TWOIN project inquiry: ${data.get('service')}`
      : `TWOIN 網站需求：${data.get('service')}`;
    const body = (isEnglish
      ? [
          `Name: ${data.get('name')}`,
          `Contact: ${data.get('contact')}`,
          `Service: ${data.get('service')}`,
          '',
          'Project details:',
          data.get('message'),
        ]
      : [
          `姓名：${data.get('name')}`,
          `聯絡方式：${data.get('contact')}`,
          `服務：${data.get('service')}`,
          '',
          '需求描述：',
          data.get('message'),
        ]).join('\n');

    if (formStatus) {
      formStatus.textContent = isEnglish
        ? 'Your email draft is ready. Opening your email app now.'
        : 'Email 草稿已準備完成，正在開啟你的 Email 軟體。';
    }
    window.location.href = `mailto:hello@twoin.tw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
