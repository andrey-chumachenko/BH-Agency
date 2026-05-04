const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const panel = menu?.querySelector<HTMLElement>('.mobile-menu__panel');
const closeTargets = menu?.querySelectorAll<HTMLElement>('[data-menu-close], [data-menu-link]');

let previousFocus: HTMLElement | null = null;

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const setMenuState = (isOpen: boolean) => {
  if (!openButton || !menu) return;

  if (isOpen) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  document.body.classList.toggle('is-menu-open', isOpen);
  menu.dataset.open = String(isOpen);
  menu.setAttribute('aria-hidden', String(!isOpen));
  openButton.setAttribute('aria-expanded', String(isOpen));
  openButton.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');

  if (isOpen) {
    const firstFocusable = panel?.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();
  } else {
    previousFocus?.focus();
  }
};

openButton?.addEventListener('click', () => {
  setMenuState(openButton.getAttribute('aria-expanded') !== 'true');
});

closeTargets?.forEach((target) => {
  target.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (!menu || menu.dataset.open !== 'true') return;

  if (event.key === 'Escape') {
    setMenuState(false);
    return;
  }

  if (event.key !== 'Tab' || !panel) return;

  const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
