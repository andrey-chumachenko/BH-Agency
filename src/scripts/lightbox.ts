const lightbox = document.querySelector<HTMLElement>('[data-lightbox]');
const lightboxImage = document.querySelector<HTMLImageElement>('[data-lightbox-image]');
const openers = document.querySelectorAll<HTMLButtonElement>('[data-lightbox-open]');
const closers = document.querySelectorAll<HTMLElement>('[data-lightbox-close]');

let previousLightboxFocus: HTMLElement | null = null;

const currentTheme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

const setLightbox = (isOpen: boolean) => {
  if (!lightbox) return;

  document.body.classList.toggle('is-lightbox-open', isOpen);
  lightbox.dataset.open = String(isOpen);
  lightbox.setAttribute('aria-hidden', String(!isOpen));

  if (!isOpen) {
    previousLightboxFocus?.focus();
  }
};

openers.forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightboxImage) return;

    previousLightboxFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lightboxImage.src = currentTheme() === 'dark' ? button.dataset.darkImage || '' : button.dataset.lightImage || '';
    lightboxImage.alt = button.dataset.alt || 'Кейс BH Agency';
    setLightbox(true);
    lightbox?.querySelector<HTMLButtonElement>('[data-lightbox-close]')?.focus();
  });
});

closers.forEach((button) => {
  button.addEventListener('click', () => setLightbox(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox?.dataset.open === 'true') {
    setLightbox(false);
  }
});
