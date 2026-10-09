const page = document.body;
const projectsButton = document.querySelector('[data-show-projects]');
const galleryButton = document.querySelector('[data-show-gallery]');
const portfolioView = document.querySelector('[data-portfolio-view]');
const projectsView = document.querySelector('[data-projects-view]');
const themeColor = document.querySelector('meta[name="theme-color"]');
const projectButtons = [...document.querySelectorAll('[data-project-target]')];
const projectPanels = [...document.querySelectorAll('[data-project-panel]')];
const projectVideos = [...document.querySelectorAll('[data-project-video]')];

function pauseProjectVideos(except = null) {
  projectVideos.forEach((video) => {
    if (video !== except) video.pause();
  });
}

function selectProject(projectId) {
  projectButtons.forEach((button) => {
    const isActive = button.dataset.projectTarget === projectId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  projectPanels.forEach((panel) => {
    const isActive = panel.dataset.projectPanel === projectId;
    if (!isActive) {
      panel.querySelectorAll('[data-project-video]').forEach((video) => video.pause());
    }
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });

  window.scrollTo({ top: 0, behavior: 'auto' });
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
