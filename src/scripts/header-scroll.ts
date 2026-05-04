const header = document.querySelector<HTMLElement>('[data-site-header]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let ticking = false;

const setHeaderProgress = () => {
  if (!header) {
    return;
  }

  const progress = reduceMotion.matches ? Number(window.scrollY > 0) : Math.min(window.scrollY / 96, 1);
  const maxWidthReduction = window.innerWidth >= 1100 ? 500 : window.innerWidth >= 920 ? 360 : 180;

  header.style.setProperty('--header-width-reduction', `${Math.round(progress * maxWidthReduction)}px`);
  header.style.setProperty('--header-height-reduction', `${Math.round(progress * 8)}px`);
  header.style.setProperty('--header-top-reduction', `${Math.round(progress * 6)}px`);
  header.style.setProperty('--header-padding-reduction', `${Math.round(progress * 2)}px`);
  header.style.setProperty('--header-gap-reduction', `${Math.round(progress * 6)}px`);
  header.style.setProperty('--header-nav-gap-reduction', `${Math.round(progress * 4)}px`);
  header.style.setProperty('--header-brand-gap-reduction', `${Math.round(progress * 4)}px`);
  header.style.setProperty('--header-link-x-reduction', `${Math.round(progress * 8)}px`);
  header.style.setProperty('--header-mark-size-reduction', `${Math.round(progress * 4)}px`);
};

const requestHeaderUpdate = () => {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    setHeaderProgress();
    ticking = false;
  });
};

setHeaderProgress();
window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
window.addEventListener('resize', requestHeaderUpdate);
reduceMotion.addEventListener('change', requestHeaderUpdate);
