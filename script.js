const items = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('.lightbox');
const fullImage = lightbox.querySelector('figure img');
const fullVideo = lightbox.querySelector('figure video');
const closeButton = lightbox.querySelector('.lightbox-close');
const previousButton = lightbox.querySelector('.lightbox-previous');
const nextButton = lightbox.querySelector('.lightbox-next');
const profileMenu = document.querySelector('[data-profile-menu]');
const profileMenuToggle = document.querySelector('[data-profile-menu-toggle]');
const profileMenuPanel = document.querySelector('[data-profile-menu-panel]');
const profileMenuTrigger = document.querySelector('[data-open-profile-menu]');
let activeIndex = 0;

function setProfileMenuOpen(isOpen) {
  profileMenu.classList.toggle('is-open', isOpen);
  profileMenuToggle.setAttribute('aria-expanded', String(isOpen));
  profileMenuPanel.setAttribute('aria-hidden', String(!isOpen));
}

profileMenuToggle.addEventListener('click', () => {
  setProfileMenuOpen(!profileMenu.classList.contains('is-open'));
});

profileMenuTrigger.addEventListener('click', (event) => {
  event.stopPropagation();
  setProfileMenuOpen(true);
});

document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) setProfileMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !profileMenu.classList.contains('is-open')) return;
  setProfileMenuOpen(false);
  profileMenuToggle.focus();
});

function clearMedia() {
  fullVideo.pause();
  fullVideo.removeAttribute('src');
  fullVideo.removeAttribute('poster');
  fullVideo.removeAttribute('aria-label');
  fullVideo.hidden = true;
  fullImage.src = '';
  fullImage.alt = '';
  fullImage.hidden = true;
}

function showMedia(index) {
  activeIndex = (index + items.length) % items.length;
  const item = items[activeIndex];
  const thumbnail = item.querySelector('img');
  const mediaLabel = item.dataset.mediaLabel || thumbnail?.alt || item.getAttribute('aria-label') || '';
  clearMedia();

  if (item.dataset.video) {
    fullVideo.src = item.dataset.video;
    if (item.dataset.poster) fullVideo.poster = item.dataset.poster;
    fullVideo.setAttribute('aria-label', mediaLabel);
    fullVideo.hidden = false;
    fullVideo.load();
    const playback = fullVideo.play();
    if (playback) playback.catch(() => {});
    return;
  }

  fullImage.src = item.dataset.full;
  fullImage.alt = mediaLabel;
  fullImage.hidden = false;
}

function openMedia(index) {
  showMedia(index);
  lightbox.showModal();
  document.body.style.overflow = 'hidden';
}

function closeMedia() {
  lightbox.close();
}

items.forEach((item, index) => {
  item.addEventListener('click', () => openMedia(index));
});

closeButton.addEventListener('click', closeMedia);
previousButton.addEventListener('click', () => showMedia(activeIndex - 1));
nextButton.addEventListener('click', () => showMedia(activeIndex + 1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeMedia();
});

lightbox.addEventListener('close', () => {
  document.body.style.overflow = '';
  clearMedia();
  items[activeIndex].focus();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') showMedia(activeIndex - 1);
  if (event.key === 'ArrowRight') showMedia(activeIndex + 1);
});
