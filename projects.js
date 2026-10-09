const page = document.body;
const projectsButton = document.querySelector('[data-show-projects]');
const galleryButton = document.querySelector('[data-show-gallery]');
const portfolioView = document.querySelector('[data-portfolio-view]');
const projectsView = document.querySelector('[data-projects-view]');
const themeColor = document.querySelector('meta[name="theme-color"]');
const projectButtons = [...document.querySelectorAll('[data-project-target]')];
const projectPanels = [...document.querySelectorAll('[data-project-panel]')];
const projectVideos = [...document.querySelectorAll('.project-video-preview')];

function pauseProjectVideos(except = null) {
  projectVideos.forEach((video) => {
    if (video !== except) video.pause();
  });
}

function selectProject(projectId) {
  const currentIndex = projectPanels.findIndex((panel) => panel.classList.contains('is-active'));
  const nextIndex = projectPanels.findIndex((panel) => panel.dataset.projectPanel === projectId);

  if (nextIndex < 0 || nextIndex === currentIndex) return;

  projectButtons.forEach((button) => {
    const isActive = button.dataset.projectTarget === projectId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  window.scrollTo({ top: 0, behavior: 'auto' });

  const currentPanel = projectPanels[currentIndex];
  const nextPanel = projectPanels[nextIndex];
  const direction = nextIndex > currentIndex ? 1 : -1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  currentPanel.querySelectorAll('.project-video-preview').forEach((video) => video.pause());

  currentPanel.classList.remove('is-active');
  currentPanel.hidden = true;
  nextPanel.hidden = false;
  nextPanel.classList.add('is-active');

  if (!reduceMotion && nextPanel.animate) {
    nextPanel.animate([
      { opacity: 0, transform: `translateX(${direction * 1.5}rem)` },
      { opacity: 1, transform: 'translateX(0)' }
    ], {
      duration: 240,
      easing: 'cubic-bezier(.22, .75, .25, 1)',
      fill: 'none'
    });
  }
}

function setProjectsView(isProjectsView) {
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (!isProjectsView) pauseProjectVideos();
  page.classList.toggle('projects-active', isProjectsView);
  themeColor.content = isProjectsView ? '#ffffff' : '#111416';

  projectsButton.classList.toggle('is-active', isProjectsView);
  projectsButton.setAttribute('aria-pressed', String(isProjectsView));
  galleryButton.classList.toggle('is-active', !isProjectsView);
  galleryButton.setAttribute('aria-pressed', String(!isProjectsView));

  portfolioView.inert = isProjectsView;
  portfolioView.setAttribute('aria-hidden', String(isProjectsView));
  projectsView.inert = !isProjectsView;
  projectsView.setAttribute('aria-hidden', String(!isProjectsView));
}

projectsButton.addEventListener('click', () => setProjectsView(true));
galleryButton.addEventListener('click', () => setProjectsView(false));
projectButtons.forEach((button) => {
  button.addEventListener('click', () => selectProject(button.dataset.projectTarget));
});
projectVideos.forEach((video) => {
  video.addEventListener('play', () => pauseProjectVideos(video));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && page.classList.contains('projects-active')) {
    setProjectsView(false);
    projectsButton.focus();
  }
});

