const revealTargets = document.querySelectorAll<HTMLElement>('.section-heading, .card, .case-card, .showreel, .team-card');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    observer.observe(target);
  });
}
