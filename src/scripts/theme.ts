const root = document.documentElement;
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme: string) => {
  root.dataset.theme = theme;
  toggles.forEach((toggle) => {
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  });
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
};

applyTheme(localStorage.getItem('theme') || root.dataset.theme || getSystemTheme());

toggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!localStorage.getItem('theme')) {
    applyTheme(getSystemTheme());
  }
});
