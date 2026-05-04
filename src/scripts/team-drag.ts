const teamRail = document.querySelector<HTMLElement>('[data-team-rail]');

if (teamRail) {
  let isDragging = false;
  let isHovering = false;
  let startX = 0;
  let startScrollLeft = 0;
  let setWidth = 0;

  const measure = () => {
    setWidth = teamRail.scrollWidth / 3;
    if (teamRail.scrollLeft < 1 && setWidth > 0) {
      teamRail.scrollLeft = setWidth;
    }
  };

  const wrapScroll = () => {
    if (!setWidth) return;

    if (teamRail.scrollLeft >= setWidth * 2) {
      teamRail.scrollLeft -= setWidth;
    } else if (teamRail.scrollLeft <= 0) {
      teamRail.scrollLeft += setWidth;
    }
  };

  const tick = () => {
    if (!isDragging && !isHovering && setWidth) {
      teamRail.scrollLeft += 0.42;
      wrapScroll();
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(() => {
    measure();
    tick();
  });

  window.addEventListener('resize', measure);

  teamRail.addEventListener('mouseenter', () => {
    isHovering = true;
  });

  teamRail.addEventListener('mouseleave', () => {
    isHovering = false;
  });

  teamRail.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    isDragging = true;
    startX = event.clientX;
    startScrollLeft = teamRail.scrollLeft;
    teamRail.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    event.preventDefault();
    const deltaX = event.clientX - startX;
    teamRail.scrollLeft = startScrollLeft - deltaX;
    wrapScroll();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;

    isDragging = false;
    teamRail.classList.remove('is-dragging');
  });
}
